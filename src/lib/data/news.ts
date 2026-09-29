import type { NewsItem } from '../types';

// 解析新闻标题行（基础格式）
function parseTitleLine(line: string): Partial<NewsItem> | null {
  const trimmedLine = line.trim();
  
  if (!trimmedLine.startsWith('## ')) {
    return null;
  }
  
  const content = trimmedLine.replace(/^##\s*/, '');
  const match = content.match(/^(\d{4}-\d{2}-\d{2})\s+(.*)$/);
  
  if (!match) {
    return null;
  }
  
  const dateStr = match[1] || '';
  const title = match[2] || '';
  
  // 验证日期格式
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return null;
  }
  
  // 生成唯一ID
  const slug = title.toLowerCase()
    .replace(/[\s\/\\]+/g, '-')
    .replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, '');
  const id = `news-${dateStr}-${slug}`.replace(/-+/g, '-');
  
  return {
    date: dateStr,
    title: title || '',
    id
  };
}

// 解析属性行（增强格式）
function parsePropertyLine(line: string, newsItem: Partial<NewsItem>): void {
  const trimmedLine = line.trim();
  
  // 匹配格式：- **属性名**: 值
  const match = trimmedLine.match(/^-\s*\*\*([^:]+)\*\*:\s*(.+)$/);
  if (!match) {
    return;
  }
  
  const propertyName = match[1]!.trim().toLowerCase();
  const propertyValue = match[2]!.trim();
  
  switch (propertyName) {
    case '链接':
    case 'url':
      newsItem.url = propertyValue;
      break;
    case '图片':
    case 'image':
      newsItem.image = propertyValue;
      break;
    case '描述':
    case 'description':
      newsItem.description = propertyValue;
      break;
  }
}

// 增强解析新闻Markdown内容
export function parseEnhancedNewsContent(content: string): NewsItem[] {
  const lines = content.split(/\r?\n/);
  const newsItems: NewsItem[] = [];
  let currentNews: Partial<NewsItem> | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim();
    
    // 检测新闻标题行
    if (line.startsWith('## ')) {
      // 保存上一个新闻
      if (currentNews && currentNews.date && currentNews.title) {
        newsItems.push(currentNews as NewsItem);
      }

      // 解析新新闻标题
      const parsed = parseTitleLine(line);
      if (!parsed) {
        // 格式错误的条目不参与渲染，必须让维护者在构建期就发现
        console.warn(`[news] 跳过格式错误的新闻标题行（应为 "## YYYY-MM-DD 标题"）: ${line}`);
      }
      currentNews = parsed;
    }
    // 解析属性行（只有在当前新闻存在时）
    else if (currentNews && line.startsWith('- **')) {
      parsePropertyLine(line, currentNews);
    }
    // 空行或注释，忽略
    else if (!line || line.startsWith('<!--')) {
      continue;
    }
    // 其他内容（可能是旧格式的延续），忽略
  }
  
  // 保存最后一个新闻
  if (currentNews && currentNews.date && currentNews.title) {
    newsItems.push(currentNews as NewsItem);
  }
  
  // 按日期降序排序
  return newsItems.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}

// 获取最新新闻
export function getLatestNews(newsItems: NewsItem[], count: number = 3): NewsItem[] {
  return newsItems.slice(0, count);
}

// 获取新闻年份列表（用于时间轴）
export function getNewsYears(newsItems: NewsItem[]): number[] {
  const years = new Set<number>();
  newsItems.forEach(item => {
    const year = new Date(item.date).getFullYear();
    years.add(year);
  });
  
  // 按降序排序
  return Array.from(years).sort((a, b) => b - a);
}

// 按年份分组新闻
export function groupNewsByYear(newsItems: NewsItem[]): Map<number, NewsItem[]> {
  const grouped = new Map<number, NewsItem[]>();
  
  newsItems.forEach(item => {
    const year = new Date(item.date).getFullYear();
    if (!grouped.has(year)) {
      grouped.set(year, []);
    }
    grouped.get(year)!.push(item);
  });
  
  // 每个年份内的新闻按日期降序排序
  grouped.forEach((items) => {
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });
  
  return grouped;
}

// 加载新闻数据
export async function loadNews(): Promise<NewsItem[]> {
  try {
    const newsContent = await import('../../data/news.md?raw');
    return parseEnhancedNewsContent(newsContent.default);
  } catch (error) {
    console.error('加载新闻数据失败:', error);
    throw error;
  }
}

