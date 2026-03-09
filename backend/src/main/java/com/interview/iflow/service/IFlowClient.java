package com.interview.iflow.service;

import com.interview.iflow.client.IFlowWebSocketClient;
import com.interview.iflow.config.IFlowProperties;
import com.interview.iflow.model.IFlowMessage;
import com.interview.iflow.model.MessageType;
import lombok.extern.slf4j.Slf4j;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

/**
 * iFlow client service responsible for ACP websocket lifecycle and AI requests.
 */
@Slf4j
public class IFlowClient implements AutoCloseable {

    private final IFlowProperties properties;
    private final Object connectLock = new Object();

    private IFlowWebSocketClient webSocketClient;
    private Process iflowProcess;
    private volatile boolean connected = false;

    public IFlowClient(IFlowProperties properties) {
        this.properties = properties;
    }

    public CompletableFuture<Void> connect() {
        return CompletableFuture.runAsync(() -> {
            synchronized (connectLock) {
                if (isConnected()) {
                    return;
                }

                try {
                    if (properties.isAutoStartProcess()) {
                        startIFlowProcess();
                    }

                    webSocketClient = new IFlowWebSocketClient(properties);
                    webSocketClient.connect();
                    webSocketClient.awaitConnection().get(properties.getConnectionTimeout(), TimeUnit.SECONDS);

                    connected = true;
                    log.info("Connected to iFlow ACP Server");
                } catch (Exception e) {
                    connected = false;
                    log.error("Failed to connect to iFlow ACP Server", e);
                    throw new RuntimeException("Connection failed", e);
                }
            }
        });
    }

    public CompletableFuture<String> query(String message) {
        return CompletableFuture.supplyAsync(() -> {
            ensureConnected();

            StringBuilder response = new StringBuilder();
            CompletableFuture<Void> completionFuture = new CompletableFuture<>();

            Consumer<IFlowMessage> messageListener = msg -> {
                if (msg.getType() == MessageType.ASSISTANT_MESSAGE) {
                    String chunk = extractText(msg);
                    if (chunk != null) {
                        response.append(chunk);
                    }
                    return;
                }

                if (msg.getType() == MessageType.TASK_FINISH) {
                    completionFuture.complete(null);
                    return;
                }

                if (msg.getType() == MessageType.ERROR) {
                    completionFuture.completeExceptionally(new RuntimeException("iFlow error: " + msg.getText()));
                }
            };

            webSocketClient.addMessageListener(messageListener);

            try {
                webSocketClient.sendUserMessage(message);
                completionFuture.get(properties.getReadTimeout(), TimeUnit.SECONDS);
                return response.toString();
            } catch (Exception e) {
                log.error("Query failed", e);
                throw new RuntimeException("Query failed", e);
            } finally {
                webSocketClient.removeMessageListener(messageListener);
            }
        });
    }

    public CompletableFuture<Void> streamQuery(
            String message,
            Consumer<String> onChunk,
            Runnable onComplete,
            Consumer<Throwable> onError
    ) {
        CompletableFuture<Void> future = new CompletableFuture<>();

        try {
            ensureConnected();
        } catch (Throwable e) {
            onError.accept(e);
            future.completeExceptionally(e);
            return future;
        }

        Consumer<IFlowMessage> messageListener = new Consumer<>() {
            @Override
            public void accept(IFlowMessage msg) {
                try {
                    if (msg.getType() == MessageType.ASSISTANT_MESSAGE) {
                        String chunk = extractText(msg);
                        if (chunk != null) {
                            onChunk.accept(chunk);
                        }
                        return;
                    }

                    if (msg.getType() == MessageType.TASK_FINISH) {
                        webSocketClient.removeMessageListener(this);
                        onComplete.run();
                        future.complete(null);
                        return;
                    }

                    if (msg.getType() == MessageType.ERROR) {
                        RuntimeException ex = new RuntimeException("iFlow error: " + msg.getText());
                        webSocketClient.removeMessageListener(this);
                        onError.accept(ex);
                        future.completeExceptionally(ex);
                    }
                } catch (Exception e) {
                    webSocketClient.removeMessageListener(this);
                    onError.accept(e);
                    future.completeExceptionally(e);
                }
            }
        };

        webSocketClient.addMessageListener(messageListener);

        try {
            webSocketClient.sendUserMessage(message);
        } catch (Exception e) {
            webSocketClient.removeMessageListener(messageListener);
            onError.accept(e);
            future.completeExceptionally(e);
        }

        return future;
    }

    public CompletableFuture<String> analyzeCode(String filePath, String codeContent) {
        return query(buildAnalyzePrompt(filePath, codeContent));
    }

    public CompletableFuture<String> explainInterviewQuestion(String question, String category) {
        return query(buildExplainPrompt(question, category));
    }

    public CompletableFuture<Void> streamExplainInterviewQuestion(
            String question,
            String category,
            Consumer<String> onChunk,
            Runnable onComplete,
            Consumer<Throwable> onError
    ) {
        return streamQuery(buildExplainPrompt(question, category), onChunk, onComplete, onError);
    }

    public CompletableFuture<String> generateInterviewQuestions(String topic, int count) {
        return query(buildGeneratePrompt(topic, count));
    }

    public CompletableFuture<Void> streamGenerateInterviewQuestions(
            String topic,
            int count,
            Consumer<String> onChunk,
            Runnable onComplete,
            Consumer<Throwable> onError
    ) {
        return streamQuery(buildGeneratePrompt(topic, count), onChunk, onComplete, onError);
    }

    public boolean isConnected() {
        return connected && webSocketClient != null && webSocketClient.isOpen();
    }

    @Override
    public void close() {
        connected = false;

        if (webSocketClient != null) {
            try {
                webSocketClient.close();
                log.info("WebSocket connection closed");
            } catch (Exception e) {
                log.error("Error closing WebSocket connection", e);
            }
        }

        if (iflowProcess != null && iflowProcess.isAlive()) {
            try {
                iflowProcess.destroy();
                log.info("iFlow process terminated");
            } catch (Exception e) {
                log.error("Error terminating iFlow process", e);
            }
        }
    }

    private void ensureConnected() {
        if (isConnected()) {
            return;
        }

        try {
            connect().get(properties.getConnectionTimeout() + 5L, TimeUnit.SECONDS);
        } catch (Exception e) {
            throw new IllegalStateException("Not connected to iFlow ACP Server", e);
        }
    }

    private String extractText(IFlowMessage msg) {
        if (msg.getChunk() != null && msg.getChunk().getText() != null) {
            return msg.getChunk().getText();
        }
        return msg.getText();
    }

    private String buildAnalyzePrompt(String filePath, String codeContent) {
        return String.format(
                "请分析以下代码并提供改进建议：%n%n文件路径: %s%n%n```%n%s%n```",
                filePath, codeContent
        );
    }

    private String buildExplainPrompt(String question, String category) {
        return String.format(
                "请详细解释以下%s面试题，并提供最佳答案：%n%n问题: %s%n%n" +
                        "请包含以下方面：%n" +
                        "1. 核心概念解释%n" +
                        "2. 详细答案%n" +
                        "3. 相关知识点%n" +
                        "4. 实际应用场景",
                category, question
        );
    }

    private String buildGeneratePrompt(String topic, int count) {
        return String.format(
                "请生成%d道关于%s的面试题，包含不同难度级别：%n%n" +
                        "每道题请包含：%n" +
                        "1. 问题%n" +
                        "2. 难度级别（初级/中级/高级）%n" +
                        "3. 参考答案要点",
                count, topic
        );
    }

    private void startIFlowProcess() throws Exception {
        log.info("Starting iFlow CLI process...");

        ProcessBuilder pb = new ProcessBuilder(
                properties.getCliPath(),
                "--experimental-acp",
                "--port", String.valueOf(properties.getAcpPort())
        );

        pb.redirectErrorStream(true);
        iflowProcess = pb.start();

        BufferedReader reader = new BufferedReader(new InputStreamReader(iflowProcess.getInputStream()));

        Thread outputThread = new Thread(() -> {
            String line;
            try {
                while ((line = reader.readLine()) != null) {
                    log.debug("iFlow: {}", line);
                }
            } catch (Exception e) {
                log.debug("Stopped reading iFlow output", e);
            }
        });
        outputThread.setDaemon(true);
        outputThread.start();

        Thread.sleep(2000);

        if (!iflowProcess.isAlive()) {
            throw new RuntimeException("iFlow process failed to start");
        }

        log.info("iFlow CLI process started successfully");
    }
}
