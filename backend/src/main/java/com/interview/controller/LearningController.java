package com.interview.controller;

import com.interview.model.ApiResponse;
import com.interview.service.LearningService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 学习记录控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/learning")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LearningController {

    private final LearningService learningService;

    @GetMapping("/records")
    public ApiResponse<?> getUserRecords(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        String userId = userDetails.getUsername();
        return learningService.getUserRecords(userId);
    }

    @GetMapping("/record/{questionId}")
    public ApiResponse<?> getRecord(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String questionId) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        String userId = userDetails.getUsername();
        return learningService.getOrCreateRecord(userId, questionId);
    }

    @PostMapping("/record/{questionId}/mastery")
    public ApiResponse<?> updateMasteryStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String questionId,
            @RequestBody MasteryRequest request) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        String userId = userDetails.getUsername();
        return learningService.updateMasteryStatus(userId, questionId, request.getStatus());
    }

    @PostMapping("/record/{questionId}/favorite")
    public ApiResponse<?> toggleFavorite(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String questionId) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        String userId = userDetails.getUsername();
        return learningService.toggleFavorite(userId, questionId);
    }

    @PostMapping("/record/{questionId}/weak")
    public ApiResponse<?> toggleWeak(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String questionId) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        String userId = userDetails.getUsername();
        return learningService.toggleWeak(userId, questionId);
    }

    @GetMapping("/due")
    public ApiResponse<?> getDueForReview(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        String userId = userDetails.getUsername();
        return learningService.getDueForReview(userId);
    }

    @GetMapping("/weak")
    public ApiResponse<?> getWeakQuestions(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        String userId = userDetails.getUsername();
        return learningService.getWeakQuestions(userId);
    }

    @GetMapping("/stats")
    public ApiResponse<Map<String, Object>> getLearningStats(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        String userId = userDetails.getUsername();
        return learningService.getLearningStats(userId);
    }

    @lombok.Data
    public static class MasteryRequest {
        private String status; // unknown, vague, mastered
    }
}
