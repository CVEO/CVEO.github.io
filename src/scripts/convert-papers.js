import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function parsePaperSection(section) {
  const lines = section.trim().split('\n')
  const title = lines[0].replace(/^##\s*/, '').trim()
  
  const authorsMatch = section.match(/- 作者:\s*(.*)/)
  const journalMatch = section.match(/- 发表期刊\/会议:\s*(.*)/)
  const dateMatch = section.match(/- 发表时间:\s*(.*)/)
  const linkMatch = section.match(/- DOI\/链接:\s*(.*)/)
  const abstractMatch = section.match(/- 摘要:\s*(.*)/)
  
  return {
    title,
    authors: authorsMatch ? authorsMatch[1].split(',').map(a => a.trim()) : [],
    journal: journalMatch ? journalMatch[1].trim() : '',
    date: dateMatch ? dateMatch[1].trim() : '',
    link: linkMatch ? linkMatch[1].trim() : '',
    abstract: abstractMatch ? abstractMatch[1].trim() : ''
  }
}

function convertPaperFile(inputPath, outputPath) {
  const content = fs.readFileSync(inputPath, 'utf-8')
  const sections = content.split(/^##\s+/m).filter(Boolean)
  
  const convertedPapers = sections.map(section => {
    const paper = parsePaperSection(section)
    
    const frontmatter = `---
title: "${paper.title.replace(/"/g, '\\"')}"
journal: "${paper.journal.replace(/"/g, '\\"')}"
date: "${paper.date}"
authors: ${JSON.stringify(paper.authors)}
link: "${paper.link}"
abstract: "${paper.abstract.replace(/"/g, '\\"')}"
---

${paper.abstract}`
    
    return frontmatter
  })
  
  // 创建输出目录
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  // 为每个论文创建单独的文件
  convertedPapers.forEach((paperContent, index) => {
    const paper = parsePaperSection(sections[index])
    const slug = paper.title
      .toLowerCase()
      .replace(/[\s\/\\]+/g, '-')
      .replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, '')
      .replace(/-+/g, '-')
    
    const paperFilePath = path.join(outputDir, `${slug}.md`)
    fs.writeFileSync(paperFilePath, paperContent, 'utf-8')
    console.log(`已创建: ${paperFilePath}`)
  })
  
  console.log(`共转换了 ${convertedPapers.length} 篇论文`)
}

// 转换 our_papers.md
const inputPath = path.join(__dirname, '..', 'content', 'papers', 'our_papers.md')
const outputDir = path.join(__dirname, '..', 'content', 'papers', 'our')

convertPaperFile(inputPath, outputDir)

// 转换 collaborative_papers.md
const collaborativeInputPath = path.join(__dirname, '..', 'content', 'papers', 'collaborative_papers.md')
const collaborativeOutputDir = path.join(__dirname, '..', 'content', 'papers', 'collaborative')

convertPaperFile(collaborativeInputPath, collaborativeOutputDir)