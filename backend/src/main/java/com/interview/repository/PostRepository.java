package com.interview.repository;

import com.interview.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, String> {

    Page<Post> findByCategoryOrderByIsPinnedDescCreatedAtDesc(String category, Pageable pageable);

    @Query("SELECT p FROM Post p ORDER BY p.isPinned DESC, p.createdAt DESC")
    Page<Post> findAllOrderByPinnedAndCreatedAt(Pageable pageable);

    @Query("SELECT p FROM Post p ORDER BY p.likeCount DESC, p.createdAt DESC")
    Page<Post> findHotPosts(Pageable pageable);

    List<Post> findByAuthorIdOrderByCreatedAtDesc(String authorId);

    @Query("SELECT DISTINCT p.category FROM Post p")
    List<String> findAllCategories();

    @Query("SELECT p FROM Post p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Post> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
