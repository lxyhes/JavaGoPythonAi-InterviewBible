package com.interview.repository;

import com.interview.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {

    List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);

    List<Comment> findByAuthorIdOrderByCreatedAtDesc(String authorId);

    long countByPostId(String postId);
}
