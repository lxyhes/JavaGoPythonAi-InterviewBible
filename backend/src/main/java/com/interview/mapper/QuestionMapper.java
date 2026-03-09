package com.interview.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.interview.entity.Question;
import org.apache.ibatis.annotations.Mapper;

/**
 * 面试题 Mapper 接口
 */
@Mapper
public interface QuestionMapper extends BaseMapper<Question> {
}
