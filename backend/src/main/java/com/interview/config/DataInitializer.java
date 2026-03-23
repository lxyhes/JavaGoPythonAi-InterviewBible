package com.interview.config;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.interview.entity.Comment;
import com.interview.entity.LearningRecord;
import com.interview.entity.Post;
import com.interview.entity.Question;
import com.interview.entity.User;
import com.interview.mapper.CommentMapper;
import com.interview.mapper.LearningRecordMapper;
import com.interview.mapper.PostMapper;
import com.interview.mapper.QuestionMapper;
import com.interview.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserMapper userMapper;
    private final QuestionMapper questionMapper;
    private final PostMapper postMapper;
    private final CommentMapper commentMapper;
    private final LearningRecordMapper learningRecordMapper;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Profile("dev")
    public CommandLineRunner initDevData() {
        return args -> {
            log.info("Initializing development data...");

            createDefaultUser("dev-user-001", "dev", "dev@example.com", "123456", "user", 3, 180, 5, 15);
            createDefaultUser("admin-user-001", "admin", "admin@example.com", "admin123", "admin", 10, 5000, 30, 20);

            seedQuestions();
            seedPosts();
            seedComments();
            seedLearningRecords();

            log.info("Development data initialization completed.");
        };
    }

    private void createDefaultUser(String id, String username, String email, String password,
                                   String role, Integer level, Integer xp, Integer streakDays, Integer dailyGoal) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", email);
        if (userMapper.selectCount(queryWrapper) > 0) {
            log.info("User {} already exists, skipping...", email);
            return;
        }

        User user = User.builder()
                .id(id)
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .level(level)
                .xp(xp)
                .streakDays(streakDays)
                .dailyGoal(dailyGoal)
                .enabled(true)
                .lastStudyDate(LocalDateTime.now().minusDays(1))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userMapper.insert(user);
        log.info("Created default user: {} (password: {})", email, password);
    }

    private void seedQuestions() {
        List<Question> questions = List.of(
                Question.builder()
                        .id("seed-q-frontend-001")
                        .category("frontend")
                        .sectionId("javascript-core")
                        .question("What is the difference between debounce and throttle?")
                        .answer("Debounce waits until rapid triggers stop before executing once. Throttle limits execution frequency within a fixed interval. Debounce is great for search boxes. Throttle is better for scroll or resize handlers where steady feedback matters.")
                        .tags("[\"must\",\"frequent\"]")
                        .source("seed")
                        .submitterId("admin-user-001")
                        .status("approved")
                        .hotScore(92)
                        .viewCount(188)
                        .favoriteCount(46)
                        .practiceCount(73)
                        .createdAt(LocalDateTime.now().minusDays(12))
                        .updatedAt(LocalDateTime.now().minusDays(1))
                        .build(),
                Question.builder()
                        .id("seed-q-backend-001")
                        .category("backend")
                        .sectionId("spring-boot")
                        .question("How do singleton and prototype Bean scopes differ in Spring?")
                        .answer("A singleton Bean is created once per IoC container and shared across injections. A prototype Bean creates a new instance on each lookup or injection request. Singleton works for stateless services. Prototype is useful for short-lived stateful helpers.")
                        .tags("[\"must\",\"important\"]")
                        .source("seed")
                        .submitterId("admin-user-001")
                        .status("approved")
                        .hotScore(88)
                        .viewCount(166)
                        .favoriteCount(39)
                        .practiceCount(69)
                        .createdAt(LocalDateTime.now().minusDays(10))
                        .updatedAt(LocalDateTime.now().minusDays(2))
                        .build(),
                Question.builder()
                        .id("seed-q-database-001")
                        .category("database")
                        .sectionId("mysql-index")
                        .question("Why can a composite index fail to be used effectively?")
                        .answer("Composite indexes follow the leftmost prefix rule. If the query skips the first column, wraps indexed columns in functions, or triggers implicit type conversion, the optimizer may ignore the index or only use part of it. Query shape matters as much as index creation.")
                        .tags("[\"must\",\"frequent\"]")
                        .source("seed")
                        .submitterId("admin-user-001")
                        .status("approved")
                        .hotScore(95)
                        .viewCount(201)
                        .favoriteCount(58)
                        .practiceCount(84)
                        .createdAt(LocalDateTime.now().minusDays(8))
                        .updatedAt(LocalDateTime.now().minusDays(1))
                        .build(),
                Question.builder()
                        .id("seed-q-system-001")
                        .category("system-design")
                        .sectionId("cache-design")
                        .question("How would you prevent cache avalanche in a high traffic system?")
                        .answer("Use staggered expiration, multi-level caching, circuit breakers, and request coalescing. Hot keys should be prewarmed and cache rebuild should be protected by mutex or single-flight logic. The main goal is preventing many keys from expiring at once and stampeding the database.")
                        .tags("[\"must\",\"important\"]")
                        .source("seed")
                        .submitterId("admin-user-001")
                        .status("approved")
                        .hotScore(99)
                        .viewCount(227)
                        .favoriteCount(67)
                        .practiceCount(91)
                        .createdAt(LocalDateTime.now().minusDays(6))
                        .updatedAt(LocalDateTime.now().minusDays(1))
                        .build(),
                Question.builder()
                        .id("seed-q-ai-001")
                        .category("ai")
                        .sectionId("llm-basics")
                        .question("What are embeddings and why are they useful in AI products?")
                        .answer("Embeddings convert content into dense vectors that preserve semantic similarity. They power retrieval, recommendation, clustering, semantic search, and RAG. In practice, embeddings let applications compare meaning instead of exact keyword overlap.")
                        .tags("[\"frequent\",\"important\"]")
                        .source("seed")
                        .submitterId("admin-user-001")
                        .status("approved")
                        .hotScore(81)
                        .viewCount(149)
                        .favoriteCount(31)
                        .practiceCount(55)
                        .createdAt(LocalDateTime.now().minusDays(4))
                        .updatedAt(LocalDateTime.now().minusDays(1))
                        .build()
        );

        for (Question question : questions) {
            QueryWrapper<Question> query = new QueryWrapper<>();
            query.eq("id", question.getId());
            if (questionMapper.selectCount(query) == 0) {
                questionMapper.insert(question);
            }
        }
    }

    private void seedPosts() {
        List<Post> posts = List.of(
                Post.builder()
                        .id("seed-post-001")
                        .title("How I turned interview prep into a weekly system")
                        .content("I stopped collecting random hot questions and instead reviewed weak areas every evening. The biggest change was writing down why I forgot something, not just whether I forgot it.")
                        .authorId("admin-user-001")
                        .authorName("admin")
                        .category("share")
                        .tags("[\"methodology\",\"learning\"]")
                        .isPinned(true)
                        .likeCount(24)
                        .viewCount(116)
                        .commentCount(2)
                        .createdAt(LocalDateTime.now().minusDays(5))
                        .updatedAt(LocalDateTime.now().minusDays(1))
                        .build(),
                Post.builder()
                        .id("seed-post-002")
                        .title("What backend topics are most important for Java interviews right now?")
                        .content("I am okay with CRUD and MVC but still weak on transactions, concurrency, and distributed systems. If you had two weeks, how would you prioritize?")
                        .authorId("dev-user-001")
                        .authorName("dev")
                        .category("question")
                        .tags("[\"java\",\"backend\"]")
                        .isPinned(false)
                        .likeCount(9)
                        .viewCount(43)
                        .commentCount(1)
                        .createdAt(LocalDateTime.now().minusDays(2))
                        .updatedAt(LocalDateTime.now().minusHours(10))
                        .build()
        );

        for (Post post : posts) {
            QueryWrapper<Post> query = new QueryWrapper<>();
            query.eq("id", post.getId());
            if (postMapper.selectCount(query) == 0) {
                postMapper.insert(post);
            }
        }
    }

    private void seedComments() {
        List<Comment> comments = List.of(
                Comment.builder()
                        .id("seed-comment-001")
                        .postId("seed-post-001")
                        .content("The part about reviewing weak areas instead of random topics really clicked for me.")
                        .authorId("dev-user-001")
                        .authorName("dev")
                        .likeCount(3)
                        .createdAt(LocalDateTime.now().minusDays(4))
                        .updatedAt(LocalDateTime.now().minusDays(4))
                        .build(),
                Comment.builder()
                        .id("seed-comment-002")
                        .postId("seed-post-001")
                        .content("Exactly. Stable interview output usually comes from structure and repetition, not motivation bursts.")
                        .authorId("admin-user-001")
                        .authorName("admin")
                        .likeCount(4)
                        .createdAt(LocalDateTime.now().minusDays(3))
                        .updatedAt(LocalDateTime.now().minusDays(3))
                        .build(),
                Comment.builder()
                        .id("seed-comment-003")
                        .postId("seed-post-002")
                        .content("I would rank transactions first, then thread pools and locking, then Redis and distributed consistency.")
                        .authorId("admin-user-001")
                        .authorName("admin")
                        .likeCount(6)
                        .createdAt(LocalDateTime.now().minusDays(1))
                        .updatedAt(LocalDateTime.now().minusDays(1))
                        .build()
        );

        for (Comment comment : comments) {
            QueryWrapper<Comment> query = new QueryWrapper<>();
            query.eq("id", comment.getId());
            if (commentMapper.selectCount(query) == 0) {
                commentMapper.insert(comment);
            }
        }
    }

    private void seedLearningRecords() {
        List<LearningRecord> records = List.of(
                LearningRecord.builder()
                        .id("seed-record-001")
                        .userId("dev-user-001")
                        .questionId("seed-q-frontend-001")
                        .masteryStatus("vague")
                        .reviewCount(2)
                        .lastReviewedAt(LocalDateTime.now().minusDays(1))
                        .nextReviewAt(LocalDateTime.now().minusHours(2))
                        .isFavorite(true)
                        .isWeak(true)
                        .createdAt(LocalDateTime.now().minusDays(4))
                        .updatedAt(LocalDateTime.now().minusDays(1))
                        .build(),
                LearningRecord.builder()
                        .id("seed-record-002")
                        .userId("dev-user-001")
                        .questionId("seed-q-backend-001")
                        .masteryStatus("mastered")
                        .reviewCount(4)
                        .lastReviewedAt(LocalDateTime.now().minusDays(2))
                        .nextReviewAt(LocalDateTime.now().plusDays(4))
                        .isFavorite(false)
                        .isWeak(false)
                        .createdAt(LocalDateTime.now().minusDays(6))
                        .updatedAt(LocalDateTime.now().minusDays(2))
                        .build(),
                LearningRecord.builder()
                        .id("seed-record-003")
                        .userId("dev-user-001")
                        .questionId("seed-q-database-001")
                        .masteryStatus("unknown")
                        .reviewCount(1)
                        .lastReviewedAt(LocalDateTime.now().minusDays(3))
                        .nextReviewAt(LocalDateTime.now().minusHours(1))
                        .isFavorite(false)
                        .isWeak(true)
                        .createdAt(LocalDateTime.now().minusDays(3))
                        .updatedAt(LocalDateTime.now().minusDays(3))
                        .build(),
                LearningRecord.builder()
                        .id("seed-record-004")
                        .userId("dev-user-001")
                        .questionId("seed-q-system-001")
                        .masteryStatus("vague")
                        .reviewCount(3)
                        .lastReviewedAt(LocalDateTime.now().minusDays(1))
                        .nextReviewAt(LocalDateTime.now().plusDays(1))
                        .isFavorite(true)
                        .isWeak(false)
                        .createdAt(LocalDateTime.now().minusDays(2))
                        .updatedAt(LocalDateTime.now().minusDays(1))
                        .build()
        );

        for (LearningRecord record : records) {
            QueryWrapper<LearningRecord> query = new QueryWrapper<>();
            query.eq("id", record.getId());
            if (learningRecordMapper.selectCount(query) == 0) {
                learningRecordMapper.insert(record);
            }
        }
    }
}
