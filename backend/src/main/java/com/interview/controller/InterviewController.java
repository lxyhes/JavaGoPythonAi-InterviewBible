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
        String category = defaultIfBlank(request.getCategory(), "综合方向");
        String heatLevel = defaultIfBlank(request.getHeatLevel(), "hot");
        String nextAction = defaultIfBlank(request.getNextAction(), "practice");
        int target = request.getDailyGoalTarget() <= 0 ? 15 : request.getDailyGoalTarget();

        String resumeContext = (request.getResumeText() == null || request.getResumeText().trim().isEmpty())
                ? ""
                : "- 用户简历关键背景: " + request.getResumeText() + "\n";

        return String.format(
                "你是一个资深的程序员面试教练。请基于以下用户画像，为用户定制一份今天的学习建议。\n" +
                        "用户当前状态：\n" +
                        "- 目标方向: %s\n" +
                        "- 学习热度: %s\n" +
                        "- 建议下一步操作: %s\n" +
                        "- 当前等级: %d\n" +
                        "- 连续打卡天数: %d\n" +
                        "- 今日已练习: %d 题\n" +
                        "- 每日目标: %d 题\n" +
                        "- 薄弱环节题目数: %d\n" +
                        "- 待复习题目数: %d\n" +
                        "- 已解锁成就: %d\n" +
                        "%s\n" +
                        "请仅输出 Markdown 格式，包含以下模块：\n" +
                        "## 今日核心建议\n" +
                        "## 推荐 3 个具体动作（建议结合简历背景提及具体技术栈）\n" +
                        "## 如果只有 15 分钟（极速建议）\n" +
                        "## 避坑/防断更贴士\n" +
                        "语言要专业、有启发性、简洁明了且必须使用中文回复。",
                category,
                heatLevel,
                nextAction,
                Math.max(1, request.getLevel()),
                Math.max(0, request.getStreakDays()),
                Math.max(0, request.getReviewedToday()),
                target,
                Math.max(0, request.getWeakCount()),
                Math.max(0, request.getDueCount()),
                Math.max(0, request.getUnlockedAchievements()),
                resumeContext
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
