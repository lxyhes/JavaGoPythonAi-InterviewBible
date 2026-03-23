package com.interview.iflow.service;

import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;

public interface IFlowClient {

    CompletableFuture<String> explainInterviewQuestion(String question, String category);

    void streamExplainInterviewQuestion(
            String question,
            String category,
            Consumer<String> onChunk,
            Runnable onComplete,
            Consumer<Throwable> onError
    );

    CompletableFuture<String> generateInterviewQuestions(String topic, int count);

    void streamGenerateInterviewQuestions(
            String topic,
            int count,
            Consumer<String> onChunk,
            Runnable onComplete,
            Consumer<Throwable> onError
    );

    CompletableFuture<String> analyzeCode(String filePath, String codeContent);

    CompletableFuture<String> query(String question);

    void streamQuery(
            String question,
            Consumer<String> onChunk,
            Runnable onComplete,
            Consumer<Throwable> onError
    );

    boolean isConnected();
}
