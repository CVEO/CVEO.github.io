import { defineCollection, z } from 'astro:content'

const papers = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    journal: z.string(),
    date: z.string(),
    authors: z.array(z.string()),
    link: z.string().optional(),
    abstract: z.string().optional(),
    partition: z.string().optional(),
    equalFirst: z.array(z.number()).optional(),
    corresponding: z.array(z.number()).optional()
  })
})

const members = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    group: z.enum(['Professor','Researcher','PhD', 'Master', 'Undergrad', 'Advisor']).optional(),
    photo: z.string().optional(),
    bio: z.string().optional(),
    externalLink: z.string().optional()
  })
})

export const collections = { papers, members }
