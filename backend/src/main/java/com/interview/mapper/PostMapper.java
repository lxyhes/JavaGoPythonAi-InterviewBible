package com.interview.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.interview.entity.Post;
import org.apache.ibatis.annotations.Mapper;

/**
 * 帖子 Mapper 接口
 */
@Mapper
public interface PostMapper extends BaseMapper<Post> {
}
