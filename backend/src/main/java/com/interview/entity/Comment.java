package com.interview.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 评论实体
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("comments")
public class Comment {

    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    /**
     * 帖子ID
     */
    private String postId;

    /**
     * 父评论ID（用于回复）
     */
    private String parentId;

    /**
     * 评论内容
     */
    private String content;

    /**
     * 作者ID
     */
    private String authorId;

    /**
     * 作者名称
     */
    private String authorName;

    /**
     * 点赞数
     */
    @Builder.Default
    private Integer likeCount = 0;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
