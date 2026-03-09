package com.interview.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 用户实体
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * 用户名
     */
    @Column(unique = true, nullable = false, length = 50)
    private String username;

    /**
     * 邮箱
     */
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    /**
     * 密码（加密存储）
     */
    @Column(nullable = false)
    private String password;

    /**
     * 头像URL
     */
    private String avatar;

    /**
     * 角色：user/admin
     */
    @Column(length = 20)
    @Builder.Default
    private String role = "user";

    /**
     * 等级
     */
    @Builder.Default
    private Integer level = 1;

    /**
     * 经验值
     */
    @Builder.Default
    private Integer xp = 0;

    /**
     * 连续学习天数
     */
    @Builder.Default
    private Integer streakDays = 0;

    /**
     * 最后学习日期
     */
    private LocalDateTime lastStudyDate;

    /**
     * 今日目标
     */
    @Builder.Default
    private Integer dailyGoal = 15;

    /**
     * 账号状态
     */
    @Builder.Default
    private Boolean enabled = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
