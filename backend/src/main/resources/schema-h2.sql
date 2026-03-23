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
    last_study_date TIMESTAMP,
    daily_goal INT DEFAULT 15,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(64) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    section_id VARCHAR(50),
    question CLOB NOT NULL,
    answer CLOB,
    tags VARCHAR(1000),
    source VARCHAR(255),
    submitter_id VARCHAR(64),
    status VARCHAR(20) DEFAULT 'approved',
    hot_score INT DEFAULT 0,
    view_count INT DEFAULT 0,
    favorite_count INT DEFAULT 0,
    practice_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS learning_records (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    question_id VARCHAR(64) NOT NULL,
    mastery_status VARCHAR(20) DEFAULT 'unknown',
    review_count INT DEFAULT 0,
    next_review_at TIMESTAMP,
    last_reviewed_at TIMESTAMP,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_weak BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_question UNIQUE (user_id, question_id)
);

CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    author_name VARCHAR(50),
    title VARCHAR(200) NOT NULL,
    content CLOB NOT NULL,
    category VARCHAR(50),
    tags VARCHAR(1000),
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(64) PRIMARY KEY,
    post_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    author_name VARCHAR(50),
    parent_id VARCHAR(64),
    content CLOB NOT NULL,
    like_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_name VARCHAR(50);
ALTER TABLE comments ADD COLUMN IF NOT EXISTS author_name VARCHAR(50);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions (category);
CREATE INDEX IF NOT EXISTS idx_questions_section ON questions (section_id);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions (status);
CREATE INDEX IF NOT EXISTS idx_learning_records_user_id ON learning_records (user_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_question_id ON learning_records (question_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_next_review ON learning_records (next_review_at);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts (user_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts (category);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments (user_id);
