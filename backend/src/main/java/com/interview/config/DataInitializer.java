package com.interview.config;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.interview.entity.User;
import com.interview.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

/**
 * 数据初始化配置类
 * 用于开发环境自动创建默认账号
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Profile("dev") // 只在开发环境执行
    public CommandLineRunner initDevData() {
        return args -> {
            log.info("Initializing development data...");

            // 创建默认开发账号
            createDefaultUser(
                "dev-user-001",
                "dev",
                "dev@example.com",
                "123456",
                "user",
                1,
                0,
                0,
                15
            );

            // 创建默认管理员账号
            createDefaultUser(
                "admin-user-001",
                "admin",
                "admin@example.com",
                "admin123",
                "admin",
                10,
                5000,
                30,
                20
            );

            log.info("Development data initialization completed.");
        };
    }

    private void createDefaultUser(String id, String username, String email, String password,
                                   String role, Integer level, Integer xp, Integer streakDays, Integer dailyGoal) {
        try {
            // 检查用户是否已存在
            QueryWrapper<User> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("email", email);
            Long count = userMapper.selectCount(queryWrapper);
            if (count > 0) {
                log.info("User {} already exists, skipping...", email);
                return;
            }

            // 创建新用户
            User user = User.builder()
                    .id(id)
                    .username(username)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .role(role)
                    .level(level)
                    .xp(xp)
                    .streakDays(streakDays)
                    .dailyGoal(dailyGoal)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            userMapper.insert(user);
            log.info("Created default user: {} (password: {})", email, password);

        } catch (Exception e) {
            log.error("Failed to create default user {}: {}", email, e.getMessage(), e);
        }
    }
}
