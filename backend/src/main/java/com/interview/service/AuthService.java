package com.interview.service;

import com.interview.entity.User;
import com.interview.model.ApiResponse;
import com.interview.repository.UserRepository;
import com.interview.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * 用户认证服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * 用户注册
     */
    public ApiResponse<Map<String, Object>> register(String username, String email, String password) {
        // 检查邮箱是否已存在
        if (userRepository.existsByEmail(email)) {
            return ApiResponse.error("邮箱已被注册");
        }

        // 检查用户名是否已存在
        if (userRepository.existsByUsername(username)) {
            return ApiResponse.error("用户名已被使用");
        }

        // 创建新用户
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role("user")
                .level(1)
                .xp(0)
                .streakDays(0)
                .dailyGoal(15)
                .enabled(true)
                .build();

        userRepository.save(user);

        // 生成 token
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", convertToUserInfo(user));

        return ApiResponse.success(result);
    }

    /**
     * 用户登录
     */
    public ApiResponse<Map<String, Object>> login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ApiResponse.error("邮箱或密码错误");
        }

        User user = userOpt.get();

        if (!user.getEnabled()) {
            return ApiResponse.error("账号已被禁用");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ApiResponse.error("邮箱或密码错误");
        }

        // 生成 token
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", convertToUserInfo(user));

        return ApiResponse.success(result);
    }

    /**
     * 获取当前用户信息
     */
    public ApiResponse<Map<String, Object>> getCurrentUser(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return ApiResponse.error("用户不存在");
        }

        return ApiResponse.success(convertToUserInfo(userOpt.get()));
    }

    /**
     * 更新用户信息
     */
    public ApiResponse<Map<String, Object>> updateUser(String userId, String username, String avatar) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return ApiResponse.error("用户不存在");
        }

        User user = userOpt.get();

        // 检查用户名是否已被其他用户使用
        if (username != null && !username.equals(user.getUsername())) {
            if (userRepository.existsByUsername(username)) {
                return ApiResponse.error("用户名已被使用");
            }
            user.setUsername(username);
        }

        if (avatar != null) {
            user.setAvatar(avatar);
        }

        userRepository.save(user);

        return ApiResponse.success(convertToUserInfo(user));
    }

    /**
     * 修改密码
     */
    public ApiResponse<Void> changePassword(String userId, String oldPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return ApiResponse.error("用户不存在");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ApiResponse.error("原密码错误");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ApiResponse.success(null);
    }

    /**
     * 将 User 转换为 UserInfo Map
     */
    private Map<String, Object> convertToUserInfo(User user) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("email", user.getEmail());
        userInfo.put("avatar", user.getAvatar());
        userInfo.put("role", user.getRole());
        userInfo.put("level", user.getLevel());
        userInfo.put("xp", user.getXp());
        userInfo.put("streakDays", user.getStreakDays());
        userInfo.put("dailyGoal", user.getDailyGoal());
        userInfo.put("createdAt", user.getCreatedAt());
        return userInfo;
    }
}
