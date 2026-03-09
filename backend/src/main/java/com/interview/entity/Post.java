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
 * 社区帖子实体
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * 标题
     */
    @Column(nullable = false, length = 200)
    private String title;

    /**
     * 内容
     */
    @Column(nullable = false, length = 10000)
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
     * 分类：discussion/question/share/experience
     */
    @Column(length = 20)
    private String category;

    /**
     * 标签列表
     */
    @ElementCollection
    @CollectionTable(name = "post_tags", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "tag")
    private List<String> tags;

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

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
