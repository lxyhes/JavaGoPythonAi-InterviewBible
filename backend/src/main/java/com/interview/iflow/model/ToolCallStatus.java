package com.interview.iflow.model;

/**
 * 工具调用状态枚举
 */
public enum ToolCallStatus {
    /**
     * 工具调用开始
     */
    STARTED,

    /**
     * 工具调用进行中
     */
    IN_PROGRESS,

    /**
     * 工具调用完成
     */
    COMPLETED,

    /**
     * 工具调用失败
     */
    FAILED,

    /**
     * 工具调用被取消
     */
    CANCELLED
}
