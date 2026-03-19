package com.interview.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 学习记录实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("learning_records")
public class LearningRecord {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 题目ID
     */
    private String questionId;

    /**
     * 掌握状态：unknown/vague/mastered
     */
    @Builder.Default
    private String masteryStatus = "unknown";

    /**
     * 复习次数
     */
    @Builder.Default
    private Integer reviewCount = 0;

    /**
     * 下次复习时间
     */
    private LocalDateTime nextReviewAt;

    /**
     * 最后复习时间
     */
    private LocalDateTime lastReviewedAt;

    /**
     * 是否收藏
     */
    @Builder.Default
    private Boolean isFavorite = false;

    /**
     * 是否标记为薄弱项
     */
    @Builder.Default
    private Boolean isWeak = false;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
