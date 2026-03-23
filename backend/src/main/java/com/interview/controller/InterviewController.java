package com.interview.controller;

import com.interview.ai.service.AiAssistantService;
import com.interview.model.ApiResponse;
import com.interview.model.CoachPlanRequest;
import com.interview.model.InterviewRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;

/**
 * Interview-related API endpoints.
 */
@Slf4j
@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "*")
public class InterviewController {

    @Nullable
    private final AiAssistantService aiAssistantService;

    public InterviewController(@Nullable AiAssistantService aiAssistantService) {
        this.aiAssistantService = aiAssistantService;
    }

    private boolean isAIAvailable() {
        return aiAssistantService != null && aiAssistantService.isConnected();
    }

    @PostMapping("/explain")
    public CompletableFuture<ResponseEntity<ApiResponse<String>>> explainQuestion(@RequestBody InterviewRequest request) {
        if (!isAIAvailable()) {
            return CompletableFuture.completedFuture(
                ResponseEntity.ok(ApiResponse.success("AI 功能当前不可用，请稍后重试"))
            );
        }

        String question = requireNotBlank(request.getQuestion(), "question");
        String category = defaultIfBlank(request.getCategory(), "general");

        return aiAssistantService.explainInterviewQuestion(question, category)
                .thenApply(explanation -> ResponseEntity.ok(ApiResponse.success(explanation)))
                .exceptionally(ex -> ResponseEntity.badRequest().body(ApiResponse.error(rootMessage(ex))));
    }

    @GetMapping(value = "/explain/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamExplainQuestion(@RequestParam("q") String question,
                                            @RequestParam(value = "category", required = false) String category) {
        String q = requireNotBlank(question, "q");
        String c = defaultIfBlank(category, "general");
        SseEmitter emitter = new SseEmitter(0L);

        if (!isAIAvailable()) {
            sendEvent(emitter, "error", "AI 功能当前不可用");
            emitter.complete();
            return emitter;
        }

        aiAssistantService.streamExplainInterviewQuestion(
                q,
                c,
                chunk -> sendEvent(emitter, "chunk", chunk),
                () -> {
                    sendEvent(emitter, "done", "[DONE]");
                    emitter.complete();
                },
                error -> {
                    sendEvent(emitter, "error", rootMessage(error));
                    emitter.completeWithError(error);
                }
        );

        emitter.onTimeout(emitter::complete);
        return emitter;
    }

    @PostMapping("/generate")
    public CompletableFuture<ResponseEntity<ApiResponse<String>>> generateQuestions(@RequestBody InterviewRequest request) {
        if (!isAIAvailable()) {
            return CompletableFuture.completedFuture(
                ResponseEntity.ok(ApiResponse.success("AI 功能当前不可用，请稍后重试"))
            );
        }

        String topic = defaultIfBlank(request.getTopic(), request.getCategory());
        topic = requireNotBlank(topic, "topic");
        int count = normalizeCount(request.getCount());

        return aiAssistantService.generateInterviewQuestions(topic, count)
                .thenApply(questions -> ResponseEntity.ok(ApiResponse.success(questions)))
                .exceptionally(ex -> ResponseEntity.badRequest().body(ApiResponse.error(rootMessage(ex))));
    }

    @GetMapping(value = "/generate/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamGenerateQuestions(@RequestParam("topic") String topic,
                                              @RequestParam(value = "count", required = false) Integer count) {
        String t = requireNotBlank(topic, "topic");
        int c = normalizeCount(count == null ? 5 : count);
        SseEmitter emitter = new SseEmitter(0L);

        if (!isAIAvailable()) {
            sendEvent(emitter, "error", "AI 功能当前不可用");
            emitter.complete();
            return emitter;
        }

        aiAssistantService.streamGenerateInterviewQuestions(
                t,
                c,
                chunk -> sendEvent(emitter, "chunk", chunk),
                () -> {
                    sendEvent(emitter, "done", "[DONE]");
                    emitter.complete();
                },
                error -> {
                    sendEvent(emitter, "error", rootMessage(error));
                    emitter.completeWithError(error);
                }
        );

        emitter.onTimeout(emitter::complete);
        return emitter;
    }

    @PostMapping("/analyze-code")
    public CompletableFuture<ResponseEntity<ApiResponse<String>>> analyzeCode(@RequestBody InterviewRequest request) {
        if (!isAIAvailable()) {
            return CompletableFuture.completedFuture(
                ResponseEntity.ok(ApiResponse.success("AI 功能当前不可用，请稍后重试"))
            );
        }

        String codeContent = requireNotBlank(request.getCodeContent(), "codeContent");
        String filePath = defaultIfBlank(request.getFilePath(), "unknown-file");

        return aiAssistantService.analyzeCode(filePath, codeContent)
                .thenApply(analysis -> ResponseEntity.ok(ApiResponse.success(analysis)))
                .exceptionally(ex -> ResponseEntity.badRequest().body(ApiResponse.error(rootMessage(ex))));
    }

    @PostMapping("/query")
    public CompletableFuture<ResponseEntity<ApiResponse<String>>> query(@RequestBody InterviewRequest request) {
        if (!isAIAvailable()) {
            return CompletableFuture.completedFuture(
                ResponseEntity.ok(ApiResponse.success("AI 功能当前不可用，请稍后重试"))
            );
        }

        String question = requireNotBlank(request.getQuestion(), "question");

        return aiAssistantService.query(question)
                .thenApply(response -> ResponseEntity.ok(ApiResponse.success(response)))
                .exceptionally(ex -> ResponseEntity.badRequest().body(ApiResponse.error(rootMessage(ex))));
    }

    @GetMapping(value = "/query/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamQuery(@RequestParam("q") String question) {
        String query = requireNotBlank(question, "q");
        SseEmitter emitter = new SseEmitter(0L);

        if (!isAIAvailable()) {
            sendEvent(emitter, "error", "AI 功能当前不可用");
            emitter.complete();
            return emitter;
        }

        aiAssistantService.streamQuery(
                query,
                chunk -> sendEvent(emitter, "chunk", chunk),
                () -> {
                    sendEvent(emitter, "done", "[DONE]");
                    emitter.complete();
                },
                error -> {
                    sendEvent(emitter, "error", rootMessage(error));
                    emitter.completeWithError(error);
                }
        );

        emitter.onTimeout(emitter::complete);
        return emitter;
    }

    @PostMapping("/coach-plan")
    public CompletableFuture<ResponseEntity<ApiResponse<String>>> coachPlan(@RequestBody CoachPlanRequest request) {
        if (!isAIAvailable()) {
            return CompletableFuture.completedFuture(
                ResponseEntity.ok(ApiResponse.success("AI 功能当前不可用，请稍后重试"))
            );
        }

        String prompt = buildCoachPrompt(request);

        return aiAssistantService.query(prompt)
                .thenApply(plan -> ResponseEntity.ok(ApiResponse.success(plan)))
                .exceptionally(ex -> ResponseEntity.badRequest().body(ApiResponse.error(rootMessage(ex))));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Boolean>> health() {
        boolean connected = isAIAvailable();
        return ResponseEntity.ok(ApiResponse.success(connected));
    }

    private static int normalizeCount(int count) {
        if (count <= 0) {
            return 5;
        }
        return Math.min(count, 20);
    }

    private static String requireNotBlank(String value, String field) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(field + " must not be blank");
        }
        return value.trim();
    }

    private static String defaultIfBlank(String value, String fallback) {
        if (value == null || value.trim().isEmpty()) {
            return fallback;
        }
        return value.trim();
    }

    private static String rootMessage(Throwable throwable) {
        Throwable root = throwable;
        while (root.getCause() != null) {
            root = root.getCause();
        }
        return root.getMessage() == null ? "unknown error" : root.getMessage();
    }

    private static String buildCoachPrompt(CoachPlanRequest request) {
        String category = defaultIfBlank(request.getCategory(), "mixed");
        String heatLevel = defaultIfBlank(request.getHeatLevel(), "hot");
        String nextAction = defaultIfBlank(request.getNextAction(), "practice");
        int target = request.getDailyGoalTarget() <= 0 ? 15 : request.getDailyGoalTarget();

        return String.format(
                "You are an interview prep coach. Build a practical one-day study plan with clear actions.\n" +
                        "User profile:\n" +
                        "- category focus: %s\n" +
                        "- learning heat level: %s\n" +
                        "- suggested next action: %s\n" +
                        "- current level: %d\n" +
                        "- streak days: %d\n" +
                        "- reviewed today: %d\n" +
                        "- daily target: %d\n" +
                        "- weak questions: %d\n" +
                        "- due for review: %d\n" +
                        "- unlocked achievements: %d\n\n" +
                        "Output in Markdown only with sections: \n" +
                        "## Today Focus\n" +
                        "## Next 3 Actions (with estimated minutes)\n" +
                        "## If You Only Have 15 Minutes\n" +
                        "## Anti-drop Strategy (how to come back tomorrow)\n" +
                        "Keep it concise and highly actionable.",
                category,
                heatLevel,
                nextAction,
                Math.max(1, request.getLevel()),
                Math.max(0, request.getStreakDays()),
                Math.max(0, request.getReviewedToday()),
                target,
                Math.max(0, request.getWeakCount()),
                Math.max(0, request.getDueCount()),
                Math.max(0, request.getUnlockedAchievements())
        );
    }

    private void sendEvent(SseEmitter emitter, String event, String data) {
        try {
            emitter.send(SseEmitter.event().name(event).data(data));
        } catch (IOException e) {
            log.warn("Failed to push SSE event: {}", e.getMessage());
            emitter.completeWithError(e);
        }
    }
}
