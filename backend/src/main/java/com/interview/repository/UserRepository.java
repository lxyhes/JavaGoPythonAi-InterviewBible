package com.interview.repository;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.interview.entity.User;
import com.interview.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 用户 Repository
 */
@Repository
@RequiredArgsConstructor
public class UserRepository {

    private final UserMapper userMapper;

    public Optional<User> findById(String id) {
        return Optional.ofNullable(userMapper.selectById(id));
    }

    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(userMapper.selectOne(
            new QueryWrapper<User>().eq("email", email)
        ));
    }

    public Optional<User> findByUsername(String username) {
        return Optional.ofNullable(userMapper.selectOne(
            new QueryWrapper<User>().eq("username", username)
        ));
    }

    public boolean existsByEmail(String email) {
        return userMapper.selectCount(
            new QueryWrapper<User>().eq("email", email)
        ) > 0;
    }

    public boolean existsByUsername(String username) {
        return userMapper.selectCount(
            new QueryWrapper<User>().eq("username", username)
        ) > 0;
    }

    public User save(User user) {
        if (user.getId() == null) {
            userMapper.insert(user);
        } else {
            userMapper.updateById(user);
        }
        return user;
    }

    public void deleteById(String id) {
        userMapper.deleteById(id);
    }
}
