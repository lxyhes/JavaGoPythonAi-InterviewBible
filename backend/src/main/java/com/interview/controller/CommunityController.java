package com.interview.controller;

import com.interview.entity.Comment;
import com.interview.entity.Post;
import com.interview.model.ApiResponse;
import com.interview.security.JwtUtil;
import com.interview.service.CommunityService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 社区功能控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommunityController {

    private final CommunityService communityService;
    private final JwtUtil jwtUtil;

    /**
     * 获取帖子分类
     */
    @GetMapping("/categories")
    public ApiResponse<List<String>> getCategories() {
        return communityService.getCategories();
    }

    /**
     * 获取帖子列表
     */
    @GetMapping("/posts")
    public ApiResponse<Map<String, Object>> getPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return communityService.getPosts(category, sort, page, size);
    }

    /**
     * 获取热门帖子
     */
    @GetMapping("/posts/hot")
    public ApiResponse<List<Post>> getHotPosts(@RequestParam(defaultValue = "10") int limit) {
        return communityService.getHotPosts(limit);
    }

    /**
     * 搜索帖子
     */
    @GetMapping("/posts/search")
    public ApiResponse<Map<String, Object>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return communityService.searchPosts(keyword, page, size);
    }

    /**
     * 获取帖子详情
     */
    @GetMapping("/posts/{id}")
    public ApiResponse<Post> getPostById(@PathVariable String id) {
        return communityService.getPostById(id);
    }

    /**
     * 创建帖子
     */
    @PostMapping("/posts")
    public ApiResponse<Post> createPost(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreatePostRequest request) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        String userId = jwtUtil.getUserIdFromToken(userDetails.getUsername());
        String username = jwtUtil.getUsernameFromToken(userDetails.getUsername());
        return communityService.createPost(userId, username, request.getTitle(), request.getContent(), request.getCategory(), request.getTags());
    }

    /**
     * 更新帖子
     */
    @PutMapping("/posts/{id}")
    public ApiResponse<Post> updatePost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id,
            @Valid @RequestBody UpdatePostRequest request) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        String userId = jwtUtil.getUserIdFromToken(userDetails.getUsername());
        return communityService.updatePost(id, userId, request.getTitle(), request.getContent());
    }

    /**
     * 删除帖子
     */
    @DeleteMapping("/posts/{id}")
    public ApiResponse<Void> deletePost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        String userId = jwtUtil.getUserIdFromToken(userDetails.getUsername());
        return communityService.deletePost(id, userId);
    }

    /**
     * 点赞帖子
     */
    @PostMapping("/posts/{id}/like")
    public ApiResponse<Void> likePost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        return communityService.likePost(id);
    }

    /**
     * 获取帖子的评论
     */
    @GetMapping("/posts/{postId}/comments")
    public ApiResponse<List<Comment>> getComments(@PathVariable String postId) {
        return communityService.getCommentsByPostId(postId);
    }

    /**
     * 创建评论
     */
    @PostMapping("/posts/{postId}/comments")
    public ApiResponse<Comment> createComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String postId,
            @Valid @RequestBody CreateCommentRequest request) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        String userId = jwtUtil.getUserIdFromToken(userDetails.getUsername());
        String username = jwtUtil.getUsernameFromToken(userDetails.getUsername());
        return communityService.createComment(postId, userId, username, request.getContent(), request.getParentId());
    }

    /**
     * 删除评论
     */
    @DeleteMapping("/comments/{id}")
    public ApiResponse<Void> deleteComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        String userId = jwtUtil.getUserIdFromToken(userDetails.getUsername());
        return communityService.deleteComment(id, userId);
    }

    /**
     * 点赞评论
     */
    @PostMapping("/comments/{id}/like")
    public ApiResponse<Void> likeComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        return communityService.likeComment(id);
    }

    // Request/Response classes
    @lombok.Data
    public static class CreatePostRequest {
        @NotBlank(message = "标题不能为空")
        @Size(min = 5, max = 200, message = "标题长度应在5-200个字符之间")
        private String title;

        @NotBlank(message = "内容不能为空")
        @Size(min = 10, message = "内容至少10个字符")
        private String content;

        private String category;

        private String tags;
    }

    @lombok.Data
    public static class UpdatePostRequest {
        @NotBlank(message = "标题不能为空")
        @Size(min = 5, max = 200, message = "标题长度应在5-200个字符之间")
        private String title;

        @NotBlank(message = "内容不能为空")
        @Size(min = 10, message = "内容至少10个字符")
        private String content;
    }

    @lombok.Data
    public static class CreateCommentRequest {
        @NotBlank(message = "评论内容不能为空")
        @Size(min = 1, max = 5000, message = "评论内容长度应在1-5000个字符之间")
        private String content;

        private String parentId;
    }
}
