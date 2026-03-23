package com.interview.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 社区帖子实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("posts")
public class Post {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    /**
     * 标题
     */
    private String title;

    /**
     * 内容
     */
    private String content;

    /**
     * 作者ID
     */
    @TableField("user_id")
    private String authorId;

    /**
     * 作者名称
     */
    @TableField("author_name")
    private String authorName;

    /**
     * 分类：discussion/question/share/experience
     */
    private String category;

    /**
     * 标签列表（逗号分隔存储）
     */
    private String tags;

    /**
     * 是否置顶
     */
    @Builder.Default
    private Boolean isPinned = false;

    /**
     * 点赞数
     */
    @Builder.Default
    private Integer likeCount = 0;

    /**
     * 浏览数
     */
    @Builder.Default
    private Integer viewCount = 0;

    /**
     * 评论数
     */
    @Builder.Default
    private Integer commentCount = 0;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
