package com.interview.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.interview.entity.Comment;
import com.interview.entity.Post;
import com.interview.model.ApiResponse;
import com.interview.repository.CommentRepository;
import com.interview.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 社区服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    /**
     * 获取分类列表
     */
    public ApiResponse<List<String>> getCategories() {
        return ApiResponse.success(postRepository.findAllCategories());
    }

    /**
     * 获取帖子列表
     */
    public ApiResponse<Map<String, Object>> getPosts(String category, String sort, int page, int size) {
        Page<Post> postPage = new Page<>(page + 1, size);

        if (category != null && !category.isEmpty()) {
            postPage = postRepository.findByCategoryOrderByIsPinnedDescCreatedAtDesc(category, postPage);
        } else if ("hot".equals(sort)) {
            postPage = postRepository.findHotPosts(postPage);
        } else {
            postPage = postRepository.findAllOrderByPinnedAndCreatedAt(postPage);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("content", postPage.getRecords());
        result.put("totalElements", postPage.getTotal());
        result.put("totalPages", postPage.getPages());
        result.put("currentPage", postPage.getCurrent() - 1);
        result.put("size", postPage.getSize());

        return ApiResponse.success(result);
    }

    /**
     * 获取热门帖子
     */
    public ApiResponse<List<Post>> getHotPosts(int limit) {
        Page<Post> page = new Page<>(1, limit);
        return ApiResponse.success(postRepository.findHotPosts(page).getRecords());
    }

    /**
     * 搜索帖子
     */
    public ApiResponse<Map<String, Object>> searchPosts(String keyword, int page, int size) {
        Page<Post> postPage = new Page<>(page + 1, size);
        postPage = postRepository.searchByKeyword(keyword, postPage);

        Map<String, Object> result = new HashMap<>();
        result.put("content", postPage.getRecords());
        result.put("totalElements", postPage.getTotal());
        result.put("totalPages", postPage.getPages());
        result.put("currentPage", postPage.getCurrent() - 1);
        result.put("size", postPage.getSize());

        return ApiResponse.success(result);
    }

    /**
     * 获取帖子详情
     */
    public ApiResponse<Post> getPostById(String id) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ApiResponse.error("帖子不存在");
        }

        Post post = postOpt.get();
        // 增加浏览次数
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);

        return ApiResponse.success(post);
    }

    /**
     * 创建帖子
     */
    public ApiResponse<Post> createPost(String userId, String username, String title, String content, String category, String tags) {
        Post post = Post.builder()
                .title(title)
                .content(content)
                .authorId(userId)
                .authorName(username)
                .category(category != null ? category : "discussion")
                .tags(tags)
                .isPinned(false)
                .likeCount(0)
                .viewCount(0)
                .commentCount(0)
                .build();

        postRepository.save(post);
        return ApiResponse.success(post);
    }

    /**
     * 更新帖子
     */
    public ApiResponse<Post> updatePost(String id, String userId, String title, String content) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ApiResponse.error("帖子不存在");
        }

        Post post = postOpt.get();
        if (!post.getAuthorId().equals(userId)) {
            return ApiResponse.error("无权修改此帖子");
        }

        post.setTitle(title);
        post.setContent(content);
        postRepository.save(post);

        return ApiResponse.success(post);
    }

    /**
     * 删除帖子
     */
    public ApiResponse<Void> deletePost(String id, String userId) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ApiResponse.error("帖子不存在");
        }

        Post post = postOpt.get();
        if (!post.getAuthorId().equals(userId)) {
            return ApiResponse.error("无权删除此帖子");
        }

        postRepository.deleteById(id);
        return ApiResponse.success(null);
    }

    /**
     * 点赞帖子
     */
    public ApiResponse<Void> likePost(String id) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ApiResponse.error("帖子不存在");
        }

        Post post = postOpt.get();
        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);

        return ApiResponse.success(null);
    }

    /**
     * 获取评论列表
     */
    public ApiResponse<List<Comment>> getCommentsByPostId(String postId) {
        return ApiResponse.success(commentRepository.findByPostIdOrderByCreatedAtAsc(postId));
    }

    /**
     * 创建评论
     */
    public ApiResponse<Comment> createComment(String postId, String userId, String username, String content, String parentId) {
        // 检查帖子是否存在
        Optional<Post> postOpt = postRepository.findById(postId);
        if (postOpt.isEmpty()) {
            return ApiResponse.error("帖子不存在");
        }

        Comment comment = Comment.builder()
                .postId(postId)
                .parentId(parentId)
                .content(content)
                .authorId(userId)
                .authorName(username)
                .likeCount(0)
                .build();

        commentRepository.save(comment);

        // 更新帖子评论数
        Post post = postOpt.get();
        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);

        return ApiResponse.success(comment);
    }

    /**
     * 删除评论
     */
    public ApiResponse<Void> deleteComment(String id, String userId) {
        Optional<Comment> commentOpt = commentRepository.findById(id);
        if (commentOpt.isEmpty()) {
            return ApiResponse.error("评论不存在");
        }

        Comment comment = commentOpt.get();
        if (!comment.getAuthorId().equals(userId)) {
            return ApiResponse.error("无权删除此评论");
        }

        commentRepository.deleteById(id);

        // 更新帖子评论数
        Optional<Post> postOpt = postRepository.findById(comment.getPostId());
        if (postOpt.isPresent()) {
            Post post = postOpt.get();
            post.setCommentCount(Math.max(0, post.getCommentCount() - 1));
            postRepository.save(post);
        }

        return ApiResponse.success(null);
    }

    /**
     * 点赞评论
     */
    public ApiResponse<Void> likeComment(String id) {
        Optional<Comment> commentOpt = commentRepository.findById(id);
        if (commentOpt.isEmpty()) {
            return ApiResponse.error("评论不存在");
        }

        Comment comment = commentOpt.get();
        comment.setLikeCount(comment.getLikeCount() + 1);
        commentRepository.save(comment);

        return ApiResponse.success(null);
    }
}
