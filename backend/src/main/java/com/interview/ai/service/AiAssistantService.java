package com.interview.ai.service;

import com.interview.ai.config.AiProperties;
import com.interview.ai.provider.AiProvider;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AiAssistantService {

    private final AiProperties properties;
    private final Map<String, AiProvider> providers;

    public AiAssistantService(AiProperties properties, List<AiProvider> providerList) {
        this.properties = properties;
        this.providers = providerList.stream()
                .collect(Collectors.toMap(AiProvider::getName, Function.identity()));
    }

    /**
     * @return Extensible fetching of active AI provider
     */
    public AiProvider getActiveProvider() {
        String active = properties.getActiveProvider();
        AiProvider provider = providers.get(active);
        if (provider == null) {
            throw new IllegalArgumentException("No AI provider found with name: " + active);
        }
        return provider;
    }

    public boolean isConnected() {
        return getActiveProvider().isAvailable();
    }

    /* ==================== Business Services Adapted For UI ==================== */

    public CompletableFuture<String> explainInterviewQuestion(String question, String category) {
        String sys = "You are an expert technical interviewer.";
        String prompt = "Please politely and professionally explain the following interview question from the category '" + category + "':\n" + question;
        return CompletableFuture.supplyAsync(() -> getActiveProvider().chat(sys, prompt));
    }

    public void streamExplainInterviewQuestion(String question, String category, Consumer<String> onChunk, Runnable onComplete, Consumer<Throwable> onError) {
        String sys = "You are an expert technical interviewer.";
        String prompt = "Please politely and professionally explain the following interview question from the category '" + category + "':\n" + question;
        getActiveProvider().streamChat(sys, prompt, onChunk, onComplete, onError);
    }

    public CompletableFuture<String> generateInterviewQuestions(String topic, int count) {
        String sys = "You are an expert technical interviewer.";
        String prompt = "Please generate " + count + " relevant interview questions for the topic: " + topic;
        return CompletableFuture.supplyAsync(() -> getActiveProvider().chat(sys, prompt));
    }

    public void streamGenerateInterviewQuestions(String topic, int count, Consumer<String> onChunk, Runnable onComplete, Consumer<Throwable> onError) {
        String sys = "You are an expert technical interviewer.";
        String prompt = "Please generate " + count + " relevant interview questions for the topic: " + topic;
        getActiveProvider().streamChat(sys, prompt, onChunk, onComplete, onError);
    }

    public CompletableFuture<String> analyzeCode(String filePath, String codeContent) {
        String sys = "You are an expert code reviewer.";
        String prompt = "Please objectively analyze this code snippet located in " + filePath + ":\n\n" + codeContent;
        return CompletableFuture.supplyAsync(() -> getActiveProvider().chat(sys, prompt));
    }

    public CompletableFuture<String> query(String question) {
        String sys = "You are a helpful IT technical interview assistant.";
        return CompletableFuture.supplyAsync(() -> getActiveProvider().chat(sys, question));
    }

    public void streamQuery(String question, Consumer<String> onChunk, Runnable onComplete, Consumer<Throwable> onError) {
        // Here we just pass the user prompt since frontend structures its own system messages for generic querying (like evaluation scoring).
        String sys = "You are a helpful IT technical interview assistant.";
        getActiveProvider().streamChat(sys, question, onChunk, onComplete, onError);
    }
}
