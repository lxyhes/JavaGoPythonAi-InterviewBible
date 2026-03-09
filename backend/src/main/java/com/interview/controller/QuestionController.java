package com.interview.controller;

import com.interview.model.ApiResponse;
import com.interview.model.QuestionSubmission;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Question submission and moderation API.
 */
@Slf4j
@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    private final Map<String, QuestionSubmission> submissions = new ConcurrentHashMap<>();

    private static final Set<String> VALID_CATEGORIES = Set.of(
            "frontend", "backend", "database", "algorithm",
            "system-design", "devops", "network", "os", "ai"
    );

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<QuestionSubmission>> submitQuestion(@RequestBody QuestionSubmission submission) {
        List<String> errors = validateSubmission(submission);
        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(String.join("; ", errors)));
        }

        String id = UUID.randomUUID().toString();
        submission.setId(id);
        submission.setStatus("pending");
        submission.setHotScore(0);
        submission.setViewCount(0);
        submission.setFavoriteCount(0);
        submission.setPracticeCount(0);
        submission.setSubmittedAt(Instant.now());

        submissions.put(id, submission);
        log.info("Question submitted: id={}, category={}", id, submission.getCategory());

        return ResponseEntity.ok(ApiResponse.success(submission));
    }

    @PostMapping("/review")
    public ResponseEntity<ApiResponse<QuestionSubmission>> reviewQuestion(@RequestBody ReviewRequest request) {
        QuestionSubmission submission = submissions.get(request.getId());
        if (submission == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Question not found: " + request.getId()));
        }

        if (!"pending".equals(submission.getStatus())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Question already reviewed: " + submission.getStatus()));
        }

        if ("approve".equals(request.getAction())) {
            submission.setStatus("approved");
        } else if ("reject".equals(request.getAction())) {
            submission.setStatus("rejected");
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid action: " + request.getAction()));
        }

        submission.setReviewNote(request.getNote());
        submission.setReviewedAt(Instant.now());
        return ResponseEntity.ok(ApiResponse.success(submission));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<QuestionSubmission>>> getPendingQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        List<QuestionSubmission> pending = submissions.values().stream()
                .filter(q -> "pending".equals(q.getStatus()))
                .sorted(Comparator.comparing(QuestionSubmission::getSubmittedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .skip((long) page * size)
                .limit(size)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(pending));
    }

    @GetMapping("/approved")
    public ResponseEntity<ApiResponse<List<QuestionSubmission>>> getApprovedQuestions(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "hot") String sortBy) {

        List<QuestionSubmission> approved = submissions.values().stream()
                .filter(q -> "approved".equals(q.getStatus()))
                .filter(q -> category == null || category.equals(q.getCategory()))
                .sorted(getComparator(sortBy))
                .skip((long) page * size)
                .limit(size)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(approved));
    }

    @PostMapping("/{id}/interaction")
    public ResponseEntity<ApiResponse<QuestionSubmission>> updateInteraction(
            @PathVariable String id,
            @RequestBody InteractionRequest request) {

        QuestionSubmission submission = submissions.get(id);
        if (submission == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Question not found: " + id));
        }

        switch (request.getType()) {
            case "view" -> submission.setViewCount((submission.getViewCount() == null ? 0 : submission.getViewCount()) + 1);
            case "favorite" -> submission.setFavoriteCount((submission.getFavoriteCount() == null ? 0 : submission.getFavoriteCount()) + 1);
            case "practice" -> submission.setPracticeCount((submission.getPracticeCount() == null ? 0 : submission.getPracticeCount()) + 1);
            default -> {
                return ResponseEntity.badRequest().body(ApiResponse.error("Invalid interaction type: " + request.getType()));
            }
        }

        submission.calculateHotScore();
        return ResponseEntity.ok(ApiResponse.success(submission));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<StatsResponse>> getStats() {
        long pending = submissions.values().stream().filter(q -> "pending".equals(q.getStatus())).count();
        long approved = submissions.values().stream().filter(q -> "approved".equals(q.getStatus())).count();
        long rejected = submissions.values().stream().filter(q -> "rejected".equals(q.getStatus())).count();

        return ResponseEntity.ok(ApiResponse.success(new StatsResponse(pending, approved, rejected)));
    }

    private List<String> validateSubmission(QuestionSubmission submission) {
        List<String> errors = new ArrayList<>();

        if (submission.getCategory() == null || submission.getCategory().isBlank()) {
            errors.add("Category is required");
        } else if (!VALID_CATEGORIES.contains(submission.getCategory())) {
            errors.add("Invalid category");
        }

        if (submission.getSectionId() == null || submission.getSectionId().isBlank()) {
            errors.add("Section ID is required");
        }

        if (submission.getQuestion() == null || submission.getQuestion().trim().length() < 5) {
            errors.add("Question must be at least 5 characters");
        }

        if (submission.getAnswer() == null || submission.getAnswer().trim().length() < 10) {
            errors.add("Answer must be at least 10 characters");
        }

        return errors;
    }

    private Comparator<QuestionSubmission> getComparator(String sortBy) {
        return switch (sortBy) {
            case "newest" -> Comparator.comparing(QuestionSubmission::getSubmittedAt, Comparator.nullsLast(Comparator.reverseOrder()));
            case "oldest" -> Comparator.comparing(QuestionSubmission::getSubmittedAt, Comparator.nullsLast(Comparator.naturalOrder()));
            case "hot" -> Comparator.comparing(QuestionSubmission::getHotScore, Comparator.nullsLast(Comparator.reverseOrder()));
            default -> Comparator.comparing(QuestionSubmission::getHotScore, Comparator.nullsLast(Comparator.reverseOrder()));
        };
    }

    @Data
    public static class ReviewRequest {
        private String id;
        private String action;
        private String note;
    }

    @Data
    public static class InteractionRequest {
        private String type;
    }

    @Data
    @AllArgsConstructor
    public static class StatsResponse {
        private long pending;
        private long approved;
        private long rejected;
    }
}
