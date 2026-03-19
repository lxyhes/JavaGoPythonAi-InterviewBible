package com.interview.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.interview.entity.Question;
import com.interview.model.ApiResponse;
import com.interview.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 题库服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    /**
     * 获取分类列表
     */
    public ApiResponse<List<String>> getCategories() {
        return ApiResponse.success(questionRepository.findAllCategories());
    }

    /**
     * 获取标签列表
     */
    public ApiResponse<List<String>> getTags() {
        // 由于tags字段改为字符串存储，这里返回空列表或从所有题目中解析
        return ApiResponse.success(new ArrayList<>());
    }

    /**
     * 获取题目列表
     */
    public ApiResponse<Map<String, Object>> getQuestions(String category, String search, int page, int size) {
        Page<Question> questionPage = new Page<>(page + 1, size);

        if (search != null && !search.isEmpty()) {
            questionPage = questionRepository.searchByKeyword("approved", search, questionPage);
        } else if (category != null && !category.isEmpty()) {
            questionPage = questionRepository.findByCategoryAndStatus(category, "approved", questionPage);
        } else {
            questionPage = questionRepository.findByStatus("approved", questionPage);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("content", questionPage.getRecords());
        result.put("totalElements", questionPage.getTotal());
        result.put("totalPages", questionPage.getPages());
        result.put("currentPage", questionPage.getCurrent() - 1);
        result.put("size", questionPage.getSize());

        return ApiResponse.success(result);
    }

    /**
     * 获取热门题目
     */
    public ApiResponse<List<Question>> getHotQuestions(int limit) {
        Page<Question> page = new Page<>(1, limit);
        return ApiResponse.success(questionRepository.findHotQuestions(page).getRecords());
    }

    /**
     * 获取题目详情
     */
    public ApiResponse<Question> getQuestionById(String id) {
        Optional<Question> questionOpt = questionRepository.findById(id);
        if (questionOpt.isEmpty()) {
            return ApiResponse.error("题目不存在");
        }

        Question question = questionOpt.get();
        // 增加浏览次数
        question.setViewCount(question.getViewCount() + 1);
        question.calculateHotScore();
        questionRepository.save(question);

        return ApiResponse.success(question);
    }

    /**
     * 根据分类和章节获取题目
     */
    public ApiResponse<List<Question>> getQuestionsBySection(String category, String sectionId) {
        return ApiResponse.success(
            questionRepository.findByCategoryAndSectionIdAndStatus(category, sectionId, "approved")
        );
    }

    /**
     * 创建题目（提交审核）
     */
    public ApiResponse<Question> createQuestion(String category, String sectionId, String question,
                                                 String answer, String tags, String source, String submitterId) {
        Question newQuestion = Question.builder()
                .category(category)
                .sectionId(sectionId)
                .question(question)
                .answer(answer)
                .tags(tags)
                .source(source)
                .submitterId(submitterId)
                .status("pending")
                .hotScore(0)
                .viewCount(0)
                .favoriteCount(0)
                .practiceCount(0)
                .build();

        questionRepository.save(newQuestion);
        return ApiResponse.success(newQuestion);
    }

    /**
     * 随机获取题目
     */
    public ApiResponse<List<Question>> getRandomQuestions(String category, int count) {
        List<Question> allQuestions;
        if (category != null && !category.isEmpty()) {
            allQuestions = questionRepository.findByCategoryAndStatus(category, "approved", new Page<>(1, Integer.MAX_VALUE)).getRecords();
        } else {
            allQuestions = questionRepository.findByStatus("approved", new Page<>(1, Integer.MAX_VALUE)).getRecords();
        }

        Collections.shuffle(allQuestions);
        int limit = Math.min(count, allQuestions.size());
        return ApiResponse.success(allQuestions.subList(0, limit));
    }
}
