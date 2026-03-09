package com.interview.iflow.service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Ensures iFlow client lifecycle is managed with the Spring app lifecycle.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IFlowLifecycleManager {

    private final IFlowClient iflowClient;

    @PostConstruct
    public void init() {
        try {
            iflowClient.connect().join();
            log.info("iFlow client initialized at startup");
        } catch (Exception e) {
            log.warn("iFlow startup connect failed, will retry on first request: {}", e.getMessage());
        }
    }

    @PreDestroy
    public void shutdown() {
        iflowClient.close();
    }
}
