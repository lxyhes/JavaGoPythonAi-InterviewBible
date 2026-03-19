package com.interview.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 面试题实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("questions")
public class Question {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    /**
     * 分类：frontend/backend/database/algorithm/system-design/devops/network/os/ai
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
     * 标签列表（逗号分隔存储）
     */
    private String tags;

    /**
     * 来源URL
     */
    private String source;

    /**
     * 提交者ID
     */
    private String submitterId;

    /**
     * 状态：pending/approved/rejected
     */
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

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    /**
     * 计算热度分数
     */
    public void calculateHotScore() {
        this.hotScore = this.viewCount * 1 + this.favoriteCount * 3 + this.practiceCount * 2;
    }
}
