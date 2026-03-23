package com.interview.ai.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "ai")
public class AiProperties {
    private String activeProvider = "deepseek"; // default provider
    
    private DeepSeek deepseek = new DeepSeek();
    private OpenAi openai = new OpenAi();

    @Data
    public static class DeepSeek {
        private String apiKey = "";
        private String baseUrl = "https://api.deepseek.com";
        private String model = "deepseek-chat";
    }

    @Data
    public static class OpenAi {
        private String apiKey = "";
        private String baseUrl = "https://api.openai.com/v1";
        private String model = "gpt-3.5-turbo";
    }
}
