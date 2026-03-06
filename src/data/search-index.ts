import { aiBasicsQA, aiProjectQA, deepLearningQA, promptEngineeringQA } from '@/data/ai'
import { aiMoreQA, llmQA } from '@/data/ai-more'
import { dataStructureQA, leetcodeQA, sortQA } from '@/data/algorithm'
import { backendProjectQA, microservicesQA } from '@/data/backend'
import { javaDistributedQA, javaJVMQA, javaNetworkQA } from '@/data/backend-java-advanced'
import { javaAdvancedQA, javaBasicsQA, javaConcurrentQA, javaSpringQA } from '@/data/backend-java'
import { mongodbQA, mysqlQA, redisQA } from '@/data/database'
import type { SearchCategory, SearchItem, SearchTag } from '@/types/search'
import { buildQuestionAnchor } from '@/utils/questionAnchor'

type QARecord = {
  question: string
  answer: string
  tags: { text: string; type: string }[]
}

type Dataset = {
  category: SearchCategory
  path: string
  sectionId: string
  sectionTitle: string
  items: QARecord[]
}

const normalizeTag = (tag: string): SearchTag | null => {
  if (tag === 'must' || tag === 'frequent' || tag === 'important') {
    return tag
  }
  return null
}

const datasets: Dataset[] = [
  { category: 'backend', path: '/backend', sectionId: 'java-basics', sectionTitle: 'Java 基础', items: javaBasicsQA },
  { category: 'backend', path: '/backend', sectionId: 'java-advanced', sectionTitle: 'Java 进阶', items: javaAdvancedQA },
  { category: 'backend', path: '/backend', sectionId: 'java-jvm', sectionTitle: 'JVM 原理', items: javaJVMQA },
  { category: 'backend', path: '/backend', sectionId: 'java-concurrent', sectionTitle: 'Java 并发', items: javaConcurrentQA },
  { category: 'backend', path: '/backend', sectionId: 'java-network', sectionTitle: '网络编程', items: javaNetworkQA },
  { category: 'backend', path: '/backend', sectionId: 'java-spring', sectionTitle: 'Spring 框架', items: javaSpringQA },
  { category: 'backend', path: '/backend', sectionId: 'java-distributed', sectionTitle: '分布式系统', items: javaDistributedQA },
  { category: 'backend', path: '/backend', sectionId: 'microservices', sectionTitle: '微服务架构', items: microservicesQA },
  { category: 'backend', path: '/backend', sectionId: 'project-backend', sectionTitle: '后端项目实战', items: backendProjectQA },

  { category: 'database', path: '/database', sectionId: 'mysql', sectionTitle: 'MySQL', items: mysqlQA },
  { category: 'database', path: '/database', sectionId: 'redis', sectionTitle: 'Redis', items: redisQA },
  { category: 'database', path: '/database', sectionId: 'mongodb', sectionTitle: 'MongoDB', items: mongodbQA },

  { category: 'algorithm', path: '/algorithm', sectionId: 'sorting', sectionTitle: '排序算法', items: sortQA },
  { category: 'algorithm', path: '/algorithm', sectionId: 'data-structure', sectionTitle: '数据结构', items: dataStructureQA },
  { category: 'algorithm', path: '/algorithm', sectionId: 'leetcode', sectionTitle: 'LeetCode 高频', items: leetcodeQA },

  { category: 'ai', path: '/ai', sectionId: 'ai-basics', sectionTitle: 'AI 基础', items: aiBasicsQA },
  { category: 'ai', path: '/ai', sectionId: 'ai-more', sectionTitle: 'AI 进阶', items: aiMoreQA },
  { category: 'ai', path: '/ai', sectionId: 'deep-learning', sectionTitle: '深度学习', items: deepLearningQA },
  { category: 'ai', path: '/ai', sectionId: 'llm', sectionTitle: '大语言模型', items: llmQA },
  { category: 'ai', path: '/ai', sectionId: 'prompt-engineering', sectionTitle: '提示工程', items: promptEngineeringQA },
  { category: 'ai', path: '/ai', sectionId: 'ai-project', sectionTitle: 'AI 项目实战', items: aiProjectQA },
]

export const searchItems: SearchItem[] = datasets.flatMap((dataset) => {
  return dataset.items.map((item, index) => {
    const tags = item.tags.map((tag) => normalizeTag(tag.type)).filter((tag): tag is SearchTag => tag !== null)
    const anchor = buildQuestionAnchor(dataset.sectionId, item.question, index)

    return {
      id: `${dataset.sectionId}-${index}`,
      category: dataset.category,
      path: dataset.path,
      sectionId: dataset.sectionId,
      sectionTitle: dataset.sectionTitle,
      question: item.question,
      answer: item.answer,
      tags,
      anchor,
    }
  })
})
