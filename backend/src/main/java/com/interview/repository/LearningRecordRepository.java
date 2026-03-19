package com.interview.repository;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.interview.entity.LearningRecord;
import com.interview.mapper.LearningRecordMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 学习记录 Repository
 */
@Repository
@RequiredArgsConstructor
public class LearningRecordRepository {

    private final LearningRecordMapper learningRecordMapper;

    public Optional<LearningRecord> findById(String id) {
        return Optional.ofNullable(learningRecordMapper.selectById(id));
    }

    public List<LearningRecord> findByUserId(String userId) {
        return learningRecordMapper.selectList(
            new QueryWrapper<LearningRecord>().eq("user_id", userId)
        );
    }

    public Optional<LearningRecord> findByUserIdAndQuestionId(String userId, String questionId) {
        return Optional.ofNullable(learningRecordMapper.selectOne(
            new QueryWrapper<LearningRecord>()
                .eq("user_id", userId)
                .eq("question_id", questionId)
        ));
    }

    public List<LearningRecord> findDueForReview(String userId, LocalDateTime now) {
        return learningRecordMapper.selectList(
            new QueryWrapper<LearningRecord>()
                .eq("user_id", userId)
                .le("next_review_at", now)
        );
    }

    public List<LearningRecord> findWeakQuestions(String userId) {
        return learningRecordMapper.selectList(
            new QueryWrapper<LearningRecord>()
                .eq("user_id", userId)
                .eq("is_weak", true)
        );
    }

    public long countMasteredByUserId(String userId) {
        return learningRecordMapper.selectCount(
            new QueryWrapper<LearningRecord>()
                .eq("user_id", userId)
                .eq("mastery_status", "mastered")
        );
    }

    public long countByUserId(String userId) {
        return learningRecordMapper.selectCount(
            new QueryWrapper<LearningRecord>().eq("user_id", userId)
        );
    }

    public List<LearningRecord> findRecentByUserId(String userId, int limit) {
        return learningRecordMapper.selectList(
            new QueryWrapper<LearningRecord>()
                .eq("user_id", userId)
                .orderByDesc("last_reviewed_at")
                .last("LIMIT " + limit)
        );
    }

    public LearningRecord save(LearningRecord record) {
        if (record.getId() == null) {
            learningRecordMapper.insert(record);
        } else {
            learningRecordMapper.updateById(record);
        }
        return record;
    }

    public void deleteById(String id) {
        learningRecordMapper.deleteById(id);
    }
}
