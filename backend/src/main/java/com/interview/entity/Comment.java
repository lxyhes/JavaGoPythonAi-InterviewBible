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
 * 评论实体
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * 帖子ID
     */
    @Column(nullable = false)
    private String postId;

    /**
     * 父评论ID（用于回复）
     */
    private String parentId;

    /**
     * 评论内容
     */
    @Column(nullable = false, length = 5000)
    private String content;

    /**
     * 作者ID
     */
    @Column(nullable = false)
    private String authorId;

    /**
     * 作者名称
     */
    @Column(nullable = false)
    private String authorName;

    /**
     * 点赞数
     */
    @Builder.Default
    private Integer likeCount = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
