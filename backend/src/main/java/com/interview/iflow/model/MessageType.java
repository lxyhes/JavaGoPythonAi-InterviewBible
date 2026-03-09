package com.interview.iflow.model;

/**
 * iFlow ACP 消息类型枚举
 */
public enum MessageType {
    /**
     * AI 助手文本响应
     */
    ASSISTANT_MESSAGE,

    /**
     * 工具调用消息
     */
    TOOL_CALL,

    /**
     * 任务计划消息
     */
    PLAN,

    /**
     * 任务完成消息
     */
    TASK_FINISH,

    /**
     * 用户消息
     */
    USER_MESSAGE,

    /**
     * 系统消息
     */
    SYSTEM_MESSAGE,

    /**
     * 错误消息
     */
    ERROR
}
