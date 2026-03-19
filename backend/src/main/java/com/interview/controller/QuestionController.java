package com.interview.controller;

import com.interview.model.ApiResponse;
import com.interview.service.QuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 题库控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("/categories")
    public ApiResponse<List<String>> getCategories() {
        return questionService.getCategories();
    }

    @GetMapping("/tags")
    public ApiResponse<List<String>> getTags() {
        return questionService.getTags();
    }

    @GetMapping
    public ApiResponse<Map<String, Object>> getQuestions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return questionService.getQuestions(category, search, page, size);
    }

    @GetMapping("/hot")
    public ApiResponse<?> getHotQuestions(@RequestParam(defaultValue = "10") int limit) {
        return questionService.getHotQuestions(limit);
    }

    @GetMapping("/{id}")
    public ApiResponse<?> getQuestionById(@PathVariable String id) {
        return questionService.getQuestionById(id);
    }

    @GetMapping("/section/{category}/{sectionId}")
    public ApiResponse<?> getQuestionsBySection(
            @PathVariable String category,
            @PathVariable String sectionId) {
        return questionService.getQuestionsBySection(category, sectionId);
    }

    @GetMapping("/random")
    public ApiResponse<?> getRandomQuestions(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "10") int count) {
        return questionService.getRandomQuestions(category, count);
    }
}
