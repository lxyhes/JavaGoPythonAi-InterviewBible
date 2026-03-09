package com.interview.iflow.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * iFlow ACP 消息基类
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class IFlowMessage {

    @JsonProperty("type")
    private MessageType type;

    @JsonProperty("timestamp")
    private Instant timestamp;

    @JsonProperty("message_id")
    private String messageId;

    @JsonProperty("session_id")
    private String sessionId;

    // AssistantMessage 字段
    @JsonProperty("text")
    private String text;

    @JsonProperty("chunk")
    private TextChunk chunk;

    @JsonProperty("agent_id")
    private String agentId;

    // ToolCallMessage 字段
    @JsonProperty("tool_name")
    private String toolName;

    @JsonProperty("status")
    private ToolCallStatus status;

    @JsonProperty("result")
    private Object result;

    @JsonProperty("arguments")
    private Map<String, Object> arguments;

    // PlanMessage 字段
    @JsonProperty("entries")
    private List<PlanEntry> entries;

    // TaskFinishMessage 字段
    @JsonProperty("stop_reason")
    private StopReason stopReason;

    @JsonProperty("summary")
    private String summary;

    /**
     * 文本块
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TextChunk {
        @JsonProperty("text")
        private String text;

        @JsonProperty("index")
        private int index;
    }

    /**
     * 计划条目
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PlanEntry {
        @JsonProperty("id")
        private String id;

        @JsonProperty("content")
        private String content;

        @JsonProperty("status")
        private String status;

        @JsonProperty("priority")
        private int priority;
    }
}
