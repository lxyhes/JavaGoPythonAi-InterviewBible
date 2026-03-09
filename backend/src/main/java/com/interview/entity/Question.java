package com.interview.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 面试题实体
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * 分类：frontend/backend/database/algorithm/system-design/devops/network/os/ai
     */
    @Column(nullable = false, length = 50)
    private String category;

    /**
     * 章节ID
     */
    @Column(length = 100)
    private String sectionId;

    /**
     * 问题内容
     */
    @Column(nullable = false, length = 2000)
    private String question;

    /**
     * 答案内容
     */
    @Column(nullable = false, length = 10000)
    private String answer;

    /**
     * 标签列表
     */
    @ElementCollection
    @CollectionTable(name = "question_tags", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "tag")
    private List<String> tags;

    /**
     * 来源URL
     */
    private String source;

    /**
     * 提交者ID
     */
    @Column(length = 50)
    private String submitterId;

    /**
     * 状态：pending/approved/rejected
     */
    @Column(length = 20)
    @Builder.Default
    private String status = "approved";

    /**
     * 热度分数
     */
    @Builder.Default
    private Integer hotScore = 0;

    /**
     * 浏览次数
     */
    @Builder.Default
    private Integer viewCount = 0;

    /**
     * 收藏次数
     */
    @Builder.Default
    private Integer favoriteCount = 0;

    /**
     * 练习次数
     */
    @Builder.Default
    private Integer practiceCount = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    /**
     * 计算热度分数
     */
    public void calculateHotScore() {
        this.hotScore = this.viewCount * 1 + this.favoriteCount * 3 + this.practiceCount * 2;
    }
}
