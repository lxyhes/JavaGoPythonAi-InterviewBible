package com.interview.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

/**
 * 题目提交实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionSubmission {

    /**
     * 提交ID
     */
    private String id;

    /**
     * 分类：frontend/backend/database/algorithm 等
     */
    private String category;

    /**
     * 章节ID
     */
    private String sectionId;

    /**
     * 问题内容
     */
    private String question;

    /**
     * 答案内容
     */
    private String answer;

    /**
     * 标签列表
     */
    private List<String> tags;

    /**
     * 来源URL
     */
    private String source;

    /**
     * 提交者（可选）
     */
    private String submitter;

    /**
     * 状态：pending/approved/rejected
     */
    private String status;

    /**
     * 热度分数
     */
    private Integer hotScore;

    /**
     * 浏览次数
     */
    private Integer viewCount;

    /**
     * 收藏次数
     */
    private Integer favoriteCount;

    /**
     * 练习次数
     */
    private Integer practiceCount;

    /**
     * 提交时间
     */
    private Instant submittedAt;

    /**
     * 审核时间
     */
    private Instant reviewedAt;

    /**
     * 审核备注
     */
    private String reviewNote;

    public void calculateHotScore() {
        if (this.viewCount == null) this.viewCount = 0;
        if (this.favoriteCount == null) this.favoriteCount = 0;
        if (this.practiceCount == null) this.practiceCount = 0;
        
        // 热度公式：浏览*1 + 收藏*3 + 练习*2
        this.hotScore = this.viewCount * 1 + this.favoriteCount * 3 + this.practiceCount * 2;
    }
}
