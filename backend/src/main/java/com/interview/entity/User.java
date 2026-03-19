package com.interview.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 用户实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("users")
public class User {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 密码（加密存储）
     */
    private String password;

    /**
     * 头像URL
     */
    private String avatar;

    /**
     * 角色：user/admin
     */
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

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
