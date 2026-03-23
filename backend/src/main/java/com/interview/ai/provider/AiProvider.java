package com.interview.ai.provider;

import java.util.function.Consumer;

public interface AiProvider {
    /**
     * @return the unique name of the provider (e.g., "deepseek", "openai", "qwen")
     */
    String getName();

    /**
     * Perform a blocking completion chat request.
     */
    String chat(String systemMessage, String userMessage);

    /**
     * Perform a streaming completion chat request.
     */
    void streamChat(String systemMessage, String userMessage, Consumer<String> onChunk, Runnable onComplete, Consumer<Throwable> onError);
    
    /**
     * Check if the API provider is fully configured
     */
    boolean isAvailable();
}
