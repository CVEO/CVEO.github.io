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

// 解析新闻行（向后兼容）
export function parseNewsLine(line: string): NewsItem | null {
  const newsItem = parseTitleLine(line);
  if (!newsItem) {
    return null;
  }
  
  // 为了向后兼容，将title复制到text字段
  return {
    ...newsItem,
    title: newsItem.title || '',
    text: newsItem.title || ''
  } as NewsItem;
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
      currentNews = parseTitleLine(line);
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

// 向后兼容：保持原有函数名
export function parseNewsContent(content: string): NewsItem[] {
  return parseEnhancedNewsContent(content);
}

// 获取最新新闻
export function getLatestNews(newsItems: NewsItem[], count: number = 3): NewsItem[] {
  return newsItems.slice(0, count);
}

// 按年份筛选新闻
export function filterNewsByYear(newsItems: NewsItem[], year: number): NewsItem[] {
  return newsItems.filter(item => {
    const itemYear = new Date(item.date).getFullYear();
    return itemYear === year;
  });
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

// 格式化日期显示
export function formatNewsDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}年${month}月${day}日`;
  } catch (error) {
    return dateStr;
  }
}

// 加载新闻数据
export async function loadNews(): Promise<NewsItem[]> {
  try {
    const newsContent = await import('../../data/news.md?raw');
    return parseNewsContent(newsContent.default);
  } catch (error) {
    console.error('加载新闻数据失败:', error);
    throw error;
  }
}

