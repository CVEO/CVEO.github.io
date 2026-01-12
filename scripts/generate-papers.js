import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function cleanLine(line) {
  // 清理行号部分 (如 "00001| ")
  if (line.includes('|')) {
    const parts = line.split('|', 2);
    if (parts.length > 1) {
      return parts[1].trim();
    }
  }
  return line.trim();
}

function parsePapers(content) {
  const papers = [];
  let currentPaper = {};
  const lines = content.split('\n');

  for (const line of lines) {
    const cleaned = cleanLine(line);
    
    if (!cleaned) {
      continue;
    }

    if (cleaned.startsWith('【成果类型】')) {
      // 保存前一个文献
      if (currentPaper.title) {
        papers.push(currentPaper);
      }
      
      // 开始新的文献
      currentPaper = {
        type: cleaned.replace('【成果类型】', '').trim(),
        fields: {}
      };
    } else if (cleaned.startsWith('【') && cleaned.includes('】')) {
      // 解析字段
      const start = cleaned.indexOf('【') + 1;
      const end = cleaned.indexOf('】');
      const fieldName = cleaned.substring(start, end).trim();
      const fieldValue = cleaned.substring(end + 1).trim();
      
      // 特殊处理标题字段
      if (fieldName === '篇名') {
        currentPaper.title = fieldValue;
      }
      
      currentPaper.fields[fieldName] = fieldValue;
    }
  }

  // 添加最后一个文献
  if (currentPaper.title) {
    papers.push(currentPaper);
  }

  return papers;
}

function createSlug(title) {
  // 创建安全的文件名
  let slug = title
    .toLowerCase()
    .replace(/[<>:"/\\|?*]/g, '') // 移除非法字符
    .replace(/[\s,，。；：！？、]+/g, '-') // 替换空格和标点
    .replace(/-+/g, '-') // 合并多个连字符
    .replace(/^-|-$/g, ''); // 移除首尾连字符

  // 限制长度
  if (slug.length > 80) {
    slug = slug.substring(0, 80);
  }

  return slug;
}

function generateMarkdown(paper) {
  const lines = [];
  
  // Frontmatter
  lines.push('---');
  lines.push(`title: "${paper.title}"`);
  
  // 年份
  if (paper.fields['年份']) {
    lines.push(`year: ${paper.fields['年份']}`);
  }
  
  // 作者
  if (paper.fields['作者']) {
    lines.push(`authors: "${paper.fields['作者']}"`);
  }
  
  // 根据类型添加字段
  if (paper.type === '期刊论文') {
    if (paper.fields['出处']) {
      lines.push(`journal: "${paper.fields['出处']}"`);
    }
    
    if (paper.fields['卷']) {
      lines.push(`volume: "${paper.fields['卷']}"`);
    }
    
    if (paper.fields['期']) {
      lines.push(`issue: "${paper.fields['期']}"`);
    }
    
    if (paper.fields['页码']) {
      lines.push(`pages: "${paper.fields['页码']}"`);
    }
  } else if (paper.type === '会议论文') {
    if (paper.fields['会议名称']) {
      lines.push(`conference: "${paper.fields['会议名称']}"`);
    }
    
    if (paper.fields['会议地点']) {
      lines.push(`conference_location: "${paper.fields['会议地点']}"`);
    }
  }
  
  // DOI
  if (paper.fields['DOI']) {
    lines.push(`doi: "${paper.fields['DOI']}"`);
  }
  
  // 收录库
  if (paper.fields['收录库']) {
    lines.push(`database: "${paper.fields['收录库']}"`);
  }
  
  lines.push('---');
  lines.push('');
  
  // 摘要
  lines.push('## 摘要');
  lines.push('');
  lines.push('<!-- 请在此处添加论文摘要 -->');
  lines.push('');
  
  // 详细信息
  lines.push('## 详细信息');
  lines.push('');
  
  // 添加所有字段
  const fieldOrder = [
    '成果类型', '篇名', '作者', '通讯作者', '出处', '年份',
    '卷', '期', '页码', '出版时间', 'DOI', '收录库',
    '文献类型', '会议名称', '会议地点', '会议组织者'
  ];
  
  for (const field of fieldOrder) {
    if (paper.fields[field]) {
      lines.push(`- **${field}**: ${paper.fields[field]}`);
    }
  }
  
  return lines.join('\n');
}

async function main() {
  console.log('开始处理文献文件...');
  
  try {
    // 读取文件
    const inputPath = path.join(__dirname, '..', '成果导出.txt');
    const content = fs.readFileSync(inputPath, 'utf-8');
    
    // 解析文献
    const papers = parsePapers(content);
    console.log(`找到 ${papers.length} 条文献记录`);
    
    if (papers.length === 0) {
      console.log('没有找到文献记录');
      return;
    }
    
    // 显示前几条
    console.log('\n前5条文献标题:');
    papers.slice(0, 5).forEach((paper, index) => {
      console.log(`  ${index + 1}. ${paper.title}`);
    });
    
    // 创建输出目录
    const outputDir = path.join(__dirname, '..', 'src', 'content', 'papers', 'our');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log(`\n生成文件到: ${outputDir}`);
    
    let createdCount = 0;
    let skippedCount = 0;
    
    // 生成markdown文件
    for (const paper of papers) {
      try {
        const slug = createSlug(paper.title);
        const filename = `${slug}.md`;
        const filepath = path.join(outputDir, filename);
        
        // 检查文件是否已存在
        if (fs.existsSync(filepath)) {
          console.log(`  跳过已存在: ${filename}`);
          skippedCount++;
          continue;
        }
        
        const markdown = generateMarkdown(paper);
        fs.writeFileSync(filepath, markdown, 'utf-8');
        
        console.log(`  ✓ 已创建: ${filename}`);
        createdCount++;
        
      } catch (error) {
        console.error(`  错误处理 "${paper.title}":`, error.message);
      }
    }
    
    console.log(`\n完成!`);
    console.log(`  成功创建: ${createdCount} 个文件`);
    console.log(`  跳过已存在: ${skippedCount} 个文件`);
    console.log(`  总计处理: ${papers.length} 条文献`);
    
  } catch (error) {
    console.error('处理过程中发生错误:', error.message);
  }
}

// 运行主函数
main().catch(console.error);