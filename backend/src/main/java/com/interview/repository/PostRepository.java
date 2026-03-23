package com.interview.repository;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.interview.entity.Post;
import com.interview.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 帖子 Repository
 */
@Repository
@RequiredArgsConstructor
public class PostRepository {

    private final PostMapper postMapper;

    public Optional<Post> findById(String id) {
        return Optional.ofNullable(postMapper.selectById(id));
    }

    public Page<Post> findByCategoryOrderByIsPinnedDescCreatedAtDesc(String category, Page<Post> page) {
        return postMapper.selectPage(page,
            new QueryWrapper<Post>()
                .eq("category", category)
                .orderByDesc("is_pinned", "created_at")
        );
    }

    public Page<Post> findAllOrderByPinnedAndCreatedAt(Page<Post> page) {
        return postMapper.selectPage(page,
            new QueryWrapper<Post>()
                .orderByDesc("is_pinned", "created_at")
        );
    }

    public Page<Post> findHotPosts(Page<Post> page) {
        return postMapper.selectPage(page,
            new QueryWrapper<Post>()
                .orderByDesc("like_count", "created_at")
        );
    }

    public List<Post> findByAuthorIdOrderByCreatedAtDesc(String authorId) {
        return postMapper.selectList(
            new QueryWrapper<Post>()
                .eq("user_id", authorId)
                .orderByDesc("created_at")
        );
    }

    public List<String> findAllCategories() {
        return postMapper.selectObjs(
            new QueryWrapper<Post>().select("DISTINCT category")
        ).stream().map(Object::toString).toList();
    }

    public Page<Post> searchByKeyword(String keyword, Page<Post> page) {
        return postMapper.selectPage(page,
            new QueryWrapper<Post>()
                .like("title", keyword)
                .or()
                .like("content", keyword)
        );
    }

    public Post save(Post post) {
        if (post.getId() == null) {
            postMapper.insert(post);
        } else {
            postMapper.updateById(post);
        }
        return post;
    }

    public void deleteById(String id) {
        postMapper.deleteById(id);
    }
}
