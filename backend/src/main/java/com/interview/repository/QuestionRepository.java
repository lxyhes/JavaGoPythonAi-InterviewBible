package com.interview.repository;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.interview.entity.Question;
import com.interview.mapper.QuestionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 面试题 Repository
 */
@Repository
@RequiredArgsConstructor
public class QuestionRepository {

    private final QuestionMapper questionMapper;

    public Optional<Question> findById(String id) {
        return Optional.ofNullable(questionMapper.selectById(id));
    }

    public Page<Question> findByStatus(String status, Page<Question> page) {
        return questionMapper.selectPage(page,
            new QueryWrapper<Question>().eq("status", status)
        );
    }

    public Page<Question> findByCategoryAndStatus(String category, String status, Page<Question> page) {
        return questionMapper.selectPage(page,
            new QueryWrapper<Question>()
                .eq("category", category)
                .eq("status", status)
        );
    }

    public Page<Question> searchByKeyword(String status, String keyword, Page<Question> page) {
        return questionMapper.selectPage(page,
            new QueryWrapper<Question>()
                .eq("status", status)
                .and(wrapper -> wrapper
                    .like("question", keyword)
                    .or()
                    .like("answer", keyword)
                    .or()
                    .like("tags", keyword)
                )
        );
    }

    public Page<Question> findHotQuestions(Page<Question> page) {
        return questionMapper.selectPage(page,
            new QueryWrapper<Question>()
                .eq("status", "approved")
                .orderByDesc("hot_score")
        );
    }

    public List<Question> findByCategoryAndSectionIdAndStatus(String category, String sectionId, String status) {
        return questionMapper.selectList(
            new QueryWrapper<Question>()
                .eq("category", category)
                .eq("section_id", sectionId)
                .eq("status", status)
        );
    }

    public List<String> findAllCategories() {
        return questionMapper.selectObjs(
            new QueryWrapper<Question>()
                .select("DISTINCT category")
                .eq("status", "approved")
        ).stream().map(Object::toString).toList();
    }

    public Question save(Question question) {
        if (question.getId() == null) {
            questionMapper.insert(question);
        } else {
            questionMapper.updateById(question);
        }
        return question;
    }

    public void deleteById(String id) {
        questionMapper.deleteById(id);
    }
}
