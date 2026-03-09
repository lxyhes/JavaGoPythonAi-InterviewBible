package com.interview.iflow.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.interview.iflow.config.IFlowProperties;
import com.interview.iflow.model.IFlowMessage;
import com.interview.iflow.model.MessageType;
import lombok.extern.slf4j.Slf4j;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.function.Consumer;

/**
 * iFlow ACP WebSocket 客户端
 */
@Slf4j
public class IFlowWebSocketClient extends WebSocketClient {

    private final ObjectMapper objectMapper;
    private final CopyOnWriteArrayList<Consumer<IFlowMessage>> messageListeners;
    private final CopyOnWriteArrayList<Consumer<String>> errorListeners;
    private final CompletableFuture<Void> connectionFuture;

    public IFlowWebSocketClient(IFlowProperties properties) {
        super(URI.create(properties.getUrl()));
        this.objectMapper = new ObjectMapper()
                .registerModule(new JavaTimeModule());
        this.messageListeners = new CopyOnWriteArrayList<>();
        this.errorListeners = new CopyOnWriteArrayList<>();
        this.connectionFuture = new CompletableFuture<>();

        // 设置连接超时
        setConnectionLostTimeout(properties.getConnectionTimeout());
    }

    @Override
    public void onOpen(ServerHandshake handshake) {
        log.info("Connected to iFlow ACP Server: {}", handshake.getHttpStatusMessage());
        connectionFuture.complete(null);
    }

    @Override
    public void onMessage(String message) {
        log.debug("Received message: {}", message);
        try {
            IFlowMessage iflowMessage = objectMapper.readValue(message, IFlowMessage.class);
            notifyMessageListeners(iflowMessage);
        } catch (Exception e) {
            log.error("Failed to parse message: {}", message, e);
            notifyErrorListeners("Parse error: " + e.getMessage());
        }
    }

    @Override
    public void onClose(int code, String reason, boolean remote) {
        log.info("Connection closed: code={}, reason={}, remote={}", code, reason, remote);
        if (!connectionFuture.isDone()) {
            connectionFuture.completeExceptionally(
                    new RuntimeException("Connection closed: " + reason)
            );
        }
    }

    @Override
    public void onError(Exception ex) {
        log.error("WebSocket error", ex);
        notifyErrorListeners(ex.getMessage());
        if (!connectionFuture.isDone()) {
            connectionFuture.completeExceptionally(ex);
        }
    }

    /**
     * 发送用户消息
     */
    public void sendUserMessage(String content) {
        try {
            IFlowMessage message = IFlowMessage.builder()
                    .type(MessageType.USER_MESSAGE)
                    .text(content)
                    .build();
            String json = objectMapper.writeValueAsString(message);
            send(json);
            log.debug("Sent user message: {}", content);
        } catch (Exception e) {
            log.error("Failed to send message", e);
            throw new RuntimeException("Failed to send message", e);
        }
    }

    /**
     * 发送系统消息
     */
    public void sendSystemMessage(String content) {
        try {
            IFlowMessage message = IFlowMessage.builder()
                    .type(MessageType.SYSTEM_MESSAGE)
                    .text(content)
                    .build();
            String json = objectMapper.writeValueAsString(message);
            send(json);
            log.debug("Sent system message: {}", content);
        } catch (Exception e) {
            log.error("Failed to send system message", e);
            throw new RuntimeException("Failed to send system message", e);
        }
    }

    /**
     * 等待连接建立
     */
    public CompletableFuture<Void> awaitConnection() {
        return connectionFuture;
    }

    /**
     * 添加消息监听器
     */
    public void addMessageListener(Consumer<IFlowMessage> listener) {
        messageListeners.add(listener);
    }

    /**
     * 移除消息监听器
     */
    public void removeMessageListener(Consumer<IFlowMessage> listener) {
        messageListeners.remove(listener);
    }

    /**
     * 添加错误监听器
     */
    public void addErrorListener(Consumer<String> listener) {
        errorListeners.add(listener);
    }

    /**
     * 移除错误监听器
     */
    public void removeErrorListener(Consumer<String> listener) {
        errorListeners.remove(listener);
    }

    private void notifyMessageListeners(IFlowMessage message) {
        for (Consumer<IFlowMessage> listener : messageListeners) {
            try {
                listener.accept(message);
            } catch (Exception e) {
                log.error("Message listener error", e);
            }
        }
    }

    private void notifyErrorListeners(String error) {
        for (Consumer<String> listener : errorListeners) {
            try {
                listener.accept(error);
            } catch (Exception e) {
                log.error("Error listener error", e);
            }
        }
    }
}
