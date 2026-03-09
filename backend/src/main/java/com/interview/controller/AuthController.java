package com.interview.controller;

import com.interview.model.ApiResponse;
import com.interview.security.JwtUtil;
import com.interview.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 用户认证控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public ApiResponse<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("User registering: {}", request.getEmail());
        return authService.register(request.getUsername(), request.getEmail(), request.getPassword());
    }

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        log.info("User logging in: {}", request.getEmail());
        return authService.login(request.getEmail(), request.getPassword());
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/me")
    public ApiResponse<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        // userDetails.getUsername() 返回的是用户ID（JWT的subject）
        String userId = userDetails.getUsername();
        return authService.getCurrentUser(userId);
    }

    /**
     * 更新用户信息
     */
    @PutMapping("/me")
    public ApiResponse<Map<String, Object>> updateUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateUserRequest request) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        String userId = userDetails.getUsername();
        return authService.updateUser(userId, request.getUsername(), request.getAvatar());
    }

    /**
     * 修改密码
     */
    @PutMapping("/password")
    public ApiResponse<Void> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        if (userDetails == null) {
            return ApiResponse.error("未登录");
        }
        String userId = userDetails.getUsername();
        return authService.changePassword(userId, request.getOldPassword(), request.getNewPassword());
    }

    // Request/Response classes
    @lombok.Data
    public static class RegisterRequest {
        @NotBlank(message = "用户名不能为空")
        @Size(min = 3, max = 20, message = "用户名长度应在3-20个字符之间")
        private String username;

        @NotBlank(message = "邮箱不能为空")
        @Email(message = "邮箱格式不正确")
        private String email;

        @NotBlank(message = "密码不能为空")
        @Size(min = 6, message = "密码至少6位")
        private String password;
    }

    @lombok.Data
    public static class LoginRequest {
        @NotBlank(message = "邮箱不能为空")
        @Email(message = "邮箱格式不正确")
        private String email;

        @NotBlank(message = "密码不能为空")
        private String password;
    }

    @lombok.Data
    public static class UpdateUserRequest {
        private String username;
        private String avatar;
    }

    @lombok.Data
    public static class ChangePasswordRequest {
        @NotBlank(message = "原密码不能为空")
        private String oldPassword;

        @NotBlank(message = "新密码不能为空")
        @Size(min = 6, message = "新密码至少6位")
        private String newPassword;
    }
}
