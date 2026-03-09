package com.interview.service;

import com.interview.entity.LearningRecord;
import com.interview.entity.User;
import com.interview.model.ApiResponse;
import com.interview.repository.LearningRecordRepository;
import com.interview.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

/**
 * 学习记录服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LearningService {

    private final LearningRecordRepository learningRecordRepository;
    private final UserRepository userRepository;

    /**
     * 获取用户的学习记录
     */
    public ApiResponse<List<LearningRecord>> getUserRecords(String userId) {
        return ApiResponse.success(learningRecordRepository.findByUserId(userId));
    }

    /**
     * 获取或创建学习记录
     */
    public ApiResponse<LearningRecord> getOrCreateRecord(String userId, String questionId) {
        Optional<LearningRecord> recordOpt = learningRecordRepository.findByUserIdAndQuestionId(userId, questionId);

        if (recordOpt.isPresent()) {
            return ApiResponse.success(recordOpt.get());
        }

        LearningRecord newRecord = LearningRecord.builder()
                .userId(userId)
                .questionId(questionId)
                .masteryStatus("unknown")
                .reviewCount(0)
                .isFavorite(false)
                .isWeak(false)
                .build();

        learningRecordRepository.save(newRecord);
        return ApiResponse.success(newRecord);
    }

    /**
     * 更新掌握状态
     */
    public ApiResponse<LearningRecord> updateMasteryStatus(String userId, String questionId, String status) {
        Optional<LearningRecord> recordOpt = learningRecordRepository.findByUserIdAndQuestionId(userId, questionId);

        LearningRecord record;
        if (recordOpt.isPresent()) {
            record = recordOpt.get();
        } else {
            record = LearningRecord.builder()
                    .userId(userId)
                    .questionId(questionId)
                    .reviewCount(0)
                    .isFavorite(false)
                    .isWeak(false)
                    .build();
        }

        record.setMasteryStatus(status);
        record.setReviewCount(record.getReviewCount() + 1);
        record.setLastReviewedAt(LocalDateTime.now());

        // 根据掌握状态设置下次复习时间
        LocalDateTime nextReview = calculateNextReview(status, record.getReviewCount());
        record.setNextReviewAt(nextReview);

        learningRecordRepository.save(record);
        updateUserStats(userId);

        return ApiResponse.success(record);
    }

    /**
     * 切换收藏状态
     */
    public ApiResponse<LearningRecord> toggleFavorite(String userId, String questionId) {
        Optional<LearningRecord> recordOpt = learningRecordRepository.findByUserIdAndQuestionId(userId, questionId);

        LearningRecord record;
        if (recordOpt.isPresent()) {
            record = recordOpt.get();
            record.setIsFavorite(!record.getIsFavorite());
        } else {
            record = LearningRecord.builder()
                    .userId(userId)
                    .questionId(questionId)
                    .masteryStatus("unknown")
                    .reviewCount(0)
                    .isFavorite(true)
                    .isWeak(false)
                    .build();
        }

        learningRecordRepository.save(record);
        return ApiResponse.success(record);
    }

    /**
     * 切换薄弱项标记
     */
    public ApiResponse<LearningRecord> toggleWeak(String userId, String questionId) {
        Optional<LearningRecord> recordOpt = learningRecordRepository.findByUserIdAndQuestionId(userId, questionId);

        LearningRecord record;
        if (recordOpt.isPresent()) {
            record = recordOpt.get();
            record.setIsWeak(!record.getIsWeak());
        } else {
            record = LearningRecord.builder()
                    .userId(userId)
                    .questionId(questionId)
                    .masteryStatus("unknown")
                    .reviewCount(0)
                    .isFavorite(false)
                    .isWeak(true)
                    .build();
        }

        learningRecordRepository.save(record);
        return ApiResponse.success(record);
    }

    /**
     * 获取待复习的题目
     */
    public ApiResponse<List<LearningRecord>> getDueForReview(String userId) {
        return ApiResponse.success(learningRecordRepository.findDueForReview(userId, LocalDateTime.now()));
    }

    /**
     * 获取薄弱项
     */
    public ApiResponse<List<LearningRecord>> getWeakQuestions(String userId) {
        return ApiResponse.success(learningRecordRepository.findWeakQuestions(userId));
    }

    /**
     * 获取学习统计
     */
    public ApiResponse<Map<String, Object>> getLearningStats(String userId) {
        long masteredCount = learningRecordRepository.countMasteredByUserId(userId);
        long totalCount = learningRecordRepository.countByUserId(userId);
        long dueCount = learningRecordRepository.findDueForReview(userId, LocalDateTime.now()).size();
        long weakCount = learningRecordRepository.findWeakQuestions(userId).size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("masteredCount", masteredCount);
        stats.put("totalCount", totalCount);
        stats.put("dueCount", dueCount);
        stats.put("weakCount", weakCount);
        stats.put("masteryRate", totalCount > 0 ? (double) masteredCount / totalCount : 0);

        return ApiResponse.success(stats);
    }

    /**
     * 计算下次复习时间
     */
    private LocalDateTime calculateNextReview(String status, int reviewCount) {
        LocalDateTime now = LocalDateTime.now();

        return switch (status) {
            case "mastered" -> now.plusDays(7 * (reviewCount + 1)); // 已掌握：间隔越来越长
            case "vague" -> now.plusDays(3); // 模糊：3天后复习
            default -> now.plusDays(1); // 未知：1天后复习
        };
    }

    /**
     * 更新用户学习统计
     */
    private void updateUserStats(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // 检查是否是连续学习
            LocalDateTime lastStudy = user.getLastStudyDate();
            LocalDateTime today = LocalDateTime.now();

            if (lastStudy == null || lastStudy.toLocalDate().isBefore(today.toLocalDate())) {
                // 今天还没学习过
                if (lastStudy != null && lastStudy.toLocalDate().isEqual(today.minusDays(1).toLocalDate())) {
                    // 昨天学习了，连续天数+1
                    user.setStreakDays(user.getStreakDays() + 1);
                } else if (lastStudy == null || !lastStudy.toLocalDate().isEqual(today.toLocalDate())) {
                    // 断掉了，重置为1
                    user.setStreakDays(1);
                }
                user.setLastStudyDate(today);
            }

            // 增加经验值
            user.setXp(user.getXp() + 10);

            // 检查升级
            int newLevel = calculateLevel(user.getXp());
            if (newLevel > user.getLevel()) {
                user.setLevel(newLevel);
            }

            userRepository.save(user);
        }
    }

    /**
     * 根据经验值计算等级
     */
    private int calculateLevel(int xp) {
        // 简单的等级计算公式：每100经验升一级
        return Math.max(1, xp / 100 + 1);
    }
}
