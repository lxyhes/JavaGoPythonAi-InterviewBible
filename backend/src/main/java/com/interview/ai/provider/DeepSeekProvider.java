package com.interview.ai.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.interview.ai.config.AiProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;

@Slf4j
@Service
public class DeepSeekProvider implements AiProvider {

    private final AiProperties.DeepSeek config;
    private final HttpClient httpClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public DeepSeekProvider(AiProperties properties) {
        this.config = properties.getDeepseek();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
    }

    @Override
    public String getName() {
        return "deepseek";
    }

    @Override
    public boolean isAvailable() {
        return config.getApiKey() != null && !config.getApiKey().trim().isEmpty();
    }

    private HttpRequest buildRequest(String systemMessage, String userMessage, boolean stream) {
        ObjectNode payload = mapper.createObjectNode();
        payload.put("model", config.getModel());
        payload.put("stream", stream);
        
        // Deepseek supports standard chat completions OpenAi format
        ArrayNode messages = payload.putArray("messages");
        
        if (systemMessage != null && !systemMessage.isEmpty()) {
            ObjectNode sys = mapper.createObjectNode();
            sys.put("role", "system");
            sys.put("content", systemMessage);
            messages.add(sys);
        }

        ObjectNode user = mapper.createObjectNode();
        user.put("role", "user");
        user.put("content", userMessage);
        messages.add(user);

        // Remove trailing slash if exists to ensure correct url format
        String baseUrl = config.getBaseUrl().endsWith("/") 
               ? config.getBaseUrl().substring(0, config.getBaseUrl().length() - 1) 
               : config.getBaseUrl();
               
        try {
            return HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + config.getApiKey())
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(payload)))
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to build request", e);
        }
    }

    @Override
    public String chat(String systemMessage, String userMessage) {
        if (!isAvailable()) {
            throw new IllegalStateException("DeepSeek provider is missing API Key configuration");
        }
        
        try {
            HttpRequest request = buildRequest(systemMessage, userMessage, false);
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() >= 400) {
                log.error("DeepSeek API Error: {} - {}", response.statusCode(), response.body());
                throw new RuntimeException("DeepSeek Error: " + response.statusCode());
            }
            
            JsonNode root = mapper.readTree(response.body());
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            log.error("DeepSeek chat error", e);
            throw new RuntimeException("Failed to chat with DeepSeek", e);
        }
    }

    @Override
    public void streamChat(String systemMessage, String userMessage, Consumer<String> onChunk, Runnable onComplete, Consumer<Throwable> onError) {
        if (!isAvailable()) {
            onError.accept(new IllegalStateException("DeepSeek provider is missing API Key configuration"));
            return;
        }

        HttpRequest request = buildRequest(systemMessage, userMessage, true);
        
        CompletableFuture.runAsync(() -> {
            try {
                httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofLines())
                        .thenAccept(response -> {
                            if (response.statusCode() >= 400) {
                                onError.accept(new RuntimeException("DeepSeek Error: HTTP " + response.statusCode()));
                                return;
                            }
                            response.body().forEach(line -> {
                                if (line.startsWith("data: ")) {
                                    String data = line.substring(6).trim();
                                    if ("[DONE]".equals(data)) {
                                        return;
                                    }
                                    try {
                                        JsonNode root = mapper.readTree(data);
                                        JsonNode choices = root.path("choices");
                                        if (choices.isArray() && choices.size() > 0) {
                                            String content = choices.get(0).path("delta").path("content").asText("");
                                            if (!content.isEmpty()) {
                                                onChunk.accept(content);
                                            }
                                        }
                                    } catch (Exception e) {
                                        // Ignore parse errors for broken chunks or keepalive
                                    }
                                }
                            });
                        }).join();
                onComplete.run();
            } catch (Exception e) {
                log.error("DeepSeek stream chat error", e);
                onError.accept(e);
            }
        });
    }
}
