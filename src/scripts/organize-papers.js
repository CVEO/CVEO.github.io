import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 读取原始文件并分类
function readAndClassifyPapers() {
  const papersDir = path.join(__dirname, '..', 'content', 'papers')
  const ourPapers = []
  const collaborativePapers = []
  
  // 读取 our_papers.md
  const ourContent = fs.readFileSync(path.join(papersDir, 'our_papers.md'), 'utf-8')
  const ourSections = ourContent.split(/^##\s+/m).filter(Boolean)
  
  ourSections.forEach(section => {
    const lines = section.trim().split('\n')
    const title = lines[0].replace(/^##\s*/, '').trim()
    
    const authorsMatch = section.match(/- 作者:\s*(.*)/)
    const journalMatch = section.match(/- 发表期刊\/会议:\s*(.*)/)
    const dateMatch = section.match(/- 发表时间:\s*(.*)/)
    const linkMatch = section.match(/- DOI\/链接:\s*(.*)/)
    const abstractMatch = section.match(/- 摘要:\s*(.*)/)
    
    ourPapers.push({
      title,
      authors: authorsMatch ? authorsMatch[1].split(',').map(a => a.trim()) : [],
      journal: journalMatch ? journalMatch[1].trim() : '',
      date: dateMatch ? dateMatch[1].trim() : '',
      link: linkMatch ? linkMatch[1].trim() : '',
      abstract: abstractMatch ? abstractMatch[1].trim() : '',
      type: 'our'
    })
  })
  
  // 读取 collaborative_papers.md
  const collaborativeContent = fs.readFileSync(path.join(papersDir, 'collaborative_papers.md'), 'utf-8')
  const collaborativeSections = collaborativeContent.split(/^##\s+/m).filter(Boolean)
  
  collaborativeSections.forEach(section => {
    const lines = section.trim().split('\n')
    const title = lines[0].replace(/^##\s*/, '').trim()
    
    const authorsMatch = section.match(/- 作者:\s*(.*)/)
    const journalMatch = section.match(/- 发表期刊\/会议:\s*(.*)/)
    const dateMatch = section.match(/- 发表时间:\s*(.*)/)
    const linkMatch = section.match(/- DOI\/链接:\s*(.*)/)
    const abstractMatch = section.match(/- 摘要:\s*(.*)/)
    
    collaborativePapers.push({
      title,
      authors: authorsMatch ? authorsMatch[1].split(',').map(a => a.trim()) : [],
      journal: journalMatch ? journalMatch[1].trim() : '',
      date: dateMatch ? dateMatch[1].trim() : '',
      link: linkMatch ? linkMatch[1].trim() : '',
      abstract: abstractMatch ? abstractMatch[1].trim() : '',
      type: 'collaborative'
    })
  })
  
  return { ourPapers, collaborativePapers }
}

function createPaperFile(paper, outputDir) {
  const slug = paper.title
    .toLowerCase()
    .replace(/[\s\/\\]+/g, '-')
    .replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, '')
    .replace(/-+/g, '-')
  
  const frontmatter = `---
title: "${paper.title.replace(/"/g, '\\"')}"
journal: "${paper.journal.replace(/"/g, '\\"')}"
date: "${paper.date}"
authors: ${JSON.stringify(paper.authors)}
link: "${paper.link}"
abstract: "${paper.abstract.replace(/"/g, '\\"')}"
---

${paper.abstract}`
  
  const filePath = path.join(outputDir, `${slug}.md`)
  fs.writeFileSync(filePath, frontmatter, 'utf-8')
  return filePath
}

function organizePapers() {
  const { ourPapers, collaborativePapers } = readAndClassifyPapers()
  
  // 创建输出目录
  const ourDir = path.join(__dirname, '..', 'content', 'papers', 'our')
  const collaborativeDir = path.join(__dirname, '..', 'content', 'papers', 'collaborative')
  
  if (!fs.existsSync(ourDir)) fs.mkdirSync(ourDir, { recursive: true })
  if (!fs.existsSync(collaborativeDir)) fs.mkdirSync(collaborativeDir, { recursive: true })
  
  // 创建我们的论文文件
  console.log('创建我们的论文:')
  ourPapers.forEach(paper => {
    const filePath = createPaperFile(paper, ourDir)
    console.log(`  ${path.basename(filePath)}`)
  })
  
  // 创建合作论文文件
  console.log('\n创建合作论文:')
  collaborativePapers.forEach(paper => {
    const filePath = createPaperFile(paper, collaborativeDir)
    console.log(`  ${path.basename(filePath)}`)
  })
  
  console.log(`\n总计: ${ourPapers.length} 篇我们的论文, ${collaborativePapers.length} 篇合作论文`)
}

organizePapers()