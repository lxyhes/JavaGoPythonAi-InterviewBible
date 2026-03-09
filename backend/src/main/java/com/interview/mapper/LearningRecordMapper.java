package com.interview.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.interview.entity.LearningRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 学习记录 Mapper 接口
 */
@Mapper
public interface LearningRecordMapper extends BaseMapper<LearningRecord> {
}
