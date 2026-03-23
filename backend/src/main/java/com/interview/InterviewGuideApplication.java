package com.interview;

import com.interview.iflow.config.IFlowProperties;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@MapperScan("com.interview.mapper")
@EnableConfigurationProperties(IFlowProperties.class)
public class InterviewGuideApplication {

    public static void main(String[] args) {
        SpringApplication.run(InterviewGuideApplication.class, args);
    }
}
