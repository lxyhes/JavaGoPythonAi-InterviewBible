package com.interview.iflow.model;

/**
 * 任务停止原因枚举
 */
public enum StopReason {
    /**
     * 正常完成
     */
    STOP_SEQUENCE,

    /**
     * 达到最大令牌限制
     */
    MAX_TOKENS,

    /**
     * 用户中断
     */
    USER_INTERRUPT,

    /**
     * 发生错误
     */
    ERROR,

    /**
     * 超时
     */
    TIMEOUT
}
