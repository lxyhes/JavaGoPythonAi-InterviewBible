package com.interview.iflow.config;

import com.interview.iflow.service.IFlowClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * iFlow SDK 自动配置类
 */
@Slf4j
@Configuration
@ConditionalOnClass(IFlowClient.class)
@EnableConfigurationProperties(IFlowProperties.class)
@ConditionalOnProperty(prefix = "iflow", name = "enabled", havingValue = "true", matchIfMissing = true)
public class IFlowAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public IFlowClient iflowClient(IFlowProperties properties) {
        log.info("Initializing iFlow Client with URL: {}", properties.getUrl());
        return new IFlowClient(properties);
    }
}
