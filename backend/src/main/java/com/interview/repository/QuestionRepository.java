package com.interview.repository;

import com.interview.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, String> {

    Page<Question> findByStatus(String status, Pageable pageable);

    Page<Question> findByCategoryAndStatus(String category, String status, Pageable pageable);

    @Query("SELECT q FROM Question q WHERE q.status = :status AND " +
           "(LOWER(q.question) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(q.answer) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "EXISTS (SELECT t FROM q.tags t WHERE LOWER(t) LIKE LOWER(CONCAT('%', :keyword, '%'))))")
    Page<Question> searchByKeyword(@Param("status") String status, @Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT q FROM Question q WHERE q.status = 'approved' ORDER BY q.hotScore DESC")
    Page<Question> findHotQuestions(Pageable pageable);

    List<Question> findByCategoryAndSectionIdAndStatus(String category, String sectionId, String status);

    @Query("SELECT DISTINCT q.category FROM Question q WHERE q.status = 'approved'")
    List<String> findAllCategories();

    @Query("SELECT DISTINCT t FROM Question q JOIN q.tags t WHERE q.status = 'approved'")
    List<String> findAllTags();
}
