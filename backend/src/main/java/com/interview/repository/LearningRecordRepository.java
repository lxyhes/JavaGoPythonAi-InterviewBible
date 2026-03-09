package com.interview.repository;

import com.interview.entity.LearningRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LearningRecordRepository extends JpaRepository<LearningRecord, String> {

    List<LearningRecord> findByUserId(String userId);

    Optional<LearningRecord> findByUserIdAndQuestionId(String userId, String questionId);

    @Query("SELECT lr FROM LearningRecord lr WHERE lr.userId = :userId AND lr.nextReviewAt <= :now")
    List<LearningRecord> findDueForReview(@Param("userId") String userId, @Param("now") LocalDateTime now);

    @Query("SELECT lr FROM LearningRecord lr WHERE lr.userId = :userId AND lr.isWeak = true")
    List<LearningRecord> findWeakQuestions(@Param("userId") String userId);

    @Query("SELECT COUNT(lr) FROM LearningRecord lr WHERE lr.userId = :userId AND lr.masteryStatus = 'mastered'")
    long countMasteredByUserId(@Param("userId") String userId);

    @Query("SELECT COUNT(lr) FROM LearningRecord lr WHERE lr.userId = :userId")
    long countByUserId(@Param("userId") String userId);

    @Query("SELECT lr FROM LearningRecord lr WHERE lr.userId = :userId ORDER BY lr.lastReviewedAt DESC")
    List<LearningRecord> findRecentByUserId(@Param("userId") String userId, org.springframework.data.domain.Pageable pageable);
}
