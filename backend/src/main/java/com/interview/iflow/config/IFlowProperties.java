package com.interview.iflow.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * iFlow SDK 配置属性
 */
@Data
@ConfigurationProperties(prefix = "iflow")
public class IFlowProperties {

    /**
     * Whether iFlow-backed AI endpoints should be enabled.
     */
    private boolean enabled = false;

    /**
     * iFlow ACP Server WebSocket URL
     * 默认: ws://localhost:8090/acp
     */
    private String url = "ws://localhost:8090/acp";

    /**
     * 连接超时时间（秒）
     */
    private int connectionTimeout = 30;

    /**
     * 读取超时时间（秒）
     */
    private int readTimeout = 600;

    /**
     * 是否自动启动 iFlow CLI 进程
     */
    private boolean autoStartProcess = false;

    /**
     * iFlow CLI 可执行文件路径
     */
    private String cliPath = "iflow";

    /**
     * 是否启用 ACP 协议
     */
    private boolean acpEnabled = true;

    /**
     * ACP 服务端口
     */
    private int acpPort = 8090;

    /**
     * 日志级别
     */
    private String logLevel = "INFO";

    /**
     * 最大重连次数
     */
    private int maxReconnectAttempts = 3;

    /**
     * 重连间隔（毫秒）
     */
    private long reconnectInterval = 5000;
}
