package com.interview.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 面试题请求 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewRequest {

    /**
     * 面试题内容
     */
    private String question;

    /**
     * 分类（Java、Python、前端等）
     */
    private String category;

    /**
     * 主题（用于生成题目）
     */
    private String topic;

    /**
     * 生成题目数量
     */
    private int count;

    /**
     * 代码内容（用于代码分析）
     */
    private String codeContent;

    /**
     * 文件路径（用于代码分析）
     */
    private String filePath;
}
