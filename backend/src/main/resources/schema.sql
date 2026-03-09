-- 初始化数据库脚本
-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS interview_guide CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE interview_guide;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user',
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    last_study_date DATETIME,
    daily_goal INT DEFAULT 15,
    enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 题目表
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(64) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    section_id VARCHAR(50),
    question TEXT NOT NULL,
    answer TEXT,
    tags JSON,
    source VARCHAR(100),
    hot_score INT DEFAULT 0,
    view_count INT DEFAULT 0,
    favorite_count INT DEFAULT 0,
    practice_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_section (section_id),
    INDEX idx_hot_score (hot_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 学习记录表
CREATE TABLE IF NOT EXISTS learning_records (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    question_id VARCHAR(64) NOT NULL,
    mastery_status VARCHAR(20) DEFAULT 'unknown',
    review_count INT DEFAULT 0,
    next_review_at DATETIME,
    last_reviewed_at DATETIME,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_weak BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_question (user_id, question_id),
    INDEX idx_user_id (user_id),
    INDEX idx_question_id (question_id),
    INDEX idx_next_review (next_review_at),
    INDEX idx_mastery_status (mastery_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 帖子表（社区功能）
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    tags JSON,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(64) PRIMARY KEY,
    post_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    parent_id VARCHAR(64),
    content TEXT NOT NULL,
    like_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
