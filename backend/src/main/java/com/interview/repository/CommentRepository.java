package com.interview.repository;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.interview.entity.Comment;
import com.interview.mapper.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 评论 Repository
 */
@Repository
@RequiredArgsConstructor
public class CommentRepository {

    private final CommentMapper commentMapper;

    public Optional<Comment> findById(String id) {
        return Optional.ofNullable(commentMapper.selectById(id));
    }

    public List<Comment> findByPostIdOrderByCreatedAtAsc(String postId) {
        return commentMapper.selectList(
            new QueryWrapper<Comment>()
                .eq("post_id", postId)
                .orderByAsc("created_at")
        );
    }

    public List<Comment> findByAuthorIdOrderByCreatedAtDesc(String authorId) {
        return commentMapper.selectList(
            new QueryWrapper<Comment>()
                .eq("user_id", authorId)
                .orderByDesc("created_at")
        );
    }

    public long countByPostId(String postId) {
        return commentMapper.selectCount(
            new QueryWrapper<Comment>().eq("post_id", postId)
        );
    }

    public Comment save(Comment comment) {
        if (comment.getId() == null) {
            commentMapper.insert(comment);
        } else {
            commentMapper.updateById(comment);
        }
        return comment;
    }

    public void deleteById(String id) {
        commentMapper.deleteById(id);
    }
}
