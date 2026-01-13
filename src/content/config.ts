import { defineCollection, z } from 'astro:content'

const papers = defineCollection({
  type: 'content',
  schema: () => z.object({
    title: z.string(),
    journal: z.string(),
    date: z.string(),
    authors: z.array(z.string()),
    link: z.string().optional(),
    wechatArticle: z.string().url().optional(),
    codeDataLink: z.string().url().optional(),
    abstract: z.string().optional(),
    partition: z.enum(['中科院一区', '中科院二区', '中科院三区', '中科院四区']).optional(),
    equalFirst: z.array(z.number()).optional(),
    corresponding: z.array(z.number()).optional(),
    otherContributions: z.array(z.object({
      authorIndex: z.number(),
      symbol: z.string(),
      description: z.string()
    })).optional()
  }).refine((data) => {
    // 验证作者索引在有效范围内
    const maxIndex = data.authors.length - 1
    
    if (data.equalFirst) {
      for (const idx of data.equalFirst) {
        if (idx < 0 || idx > maxIndex) {
          return false
        }
      }
    }
    
    if (data.corresponding) {
      for (const idx of data.corresponding) {
        if (idx < 0 || idx > maxIndex) {
          return false
        }
      }
    }
    
    if (data.otherContributions) {
      for (const contrib of data.otherContributions) {
        if (contrib.authorIndex < 0 || contrib.authorIndex > maxIndex) {
          return false
        }
      }
    }
    
    return true
  }, {
    message: "作者索引必须在有效范围内"
  })
})

const members = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    group: z.enum(['Professor','Researcher','ResearchAssistant','PhD', 'Master', 'Undergrad', 'Advisor']).optional(),
    order: z.number().default(999),
    photo: z.string().optional(),
    bio: z.string().optional(),
    externalLink: z.string().optional(),
    research: z.string().optional()  // 研究方向字段
  })
})

export const collections = { papers, members }
