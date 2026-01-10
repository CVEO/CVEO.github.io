import { defineCollection, z } from 'astro:content'

const papers = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    journal: z.string(),
    date: z.date(),
    partition: z.string().optional(),
    equalFirst: z.array(z.number()).optional(),
    corresponding: z.array(z.number()).optional(),
    authors: z.array(z.string())
  })
})

const members = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    group: z.enum(['Professor','Researcher','PhD', 'Master', 'Undergrad', 'Advisor']).optional(),
    photo: z.string().optional(),
    bio: z.string().optional()
  })
})

export const collections = { papers, members }
