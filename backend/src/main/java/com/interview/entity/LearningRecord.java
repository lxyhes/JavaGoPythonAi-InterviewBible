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
 * 学习记录实体
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "learning_records")
public class LearningRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * 用户ID
     */
    @Column(nullable = false)
    private String userId;

    /**
     * 题目ID
     */
    @Column(nullable = false)
    private String questionId;

    /**
     * 掌握状态：unknown/vague/mastered
     */
    @Column(length = 20)
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

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
