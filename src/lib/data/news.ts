import type { NewsItem } from '../types';

// 解析新闻行
export function parseNewsLine(line: string): NewsItem | null {
  const trimmedLine = line.trim();
  
  // 检查是否是二级标题格式
  if (!trimmedLine.startsWith('## ')) {
    return null;
  }
  
  const content = trimmedLine.replace(/^##\s*/, '');
  const match = content.match(/^(\d{4}-\d{2}-\d{2})\s+(.*)$/);
  
  if (!match) {
    return null;
  }
  
  const dateStr = match[1] || '';
  const text = match[2] || '';
  
  // 验证日期格式
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return null;
  }
  
  // 生成唯一ID
  const slug = text.toLowerCase()
    .replace(/[\s\/\\]+/g, '-')
    .replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, '');
  const id = `news-${dateStr}-${slug}`.replace(/-+/g, '-');
  
  return {
    date: dateStr,
    text,
    id
  };
}

// 解析新闻Markdown内容
export function parseNewsContent(content: string): NewsItem[] {
  const lines = content.split(/\r?\n/);
  const newsItems: NewsItem[] = [];
  
  for (const line of lines) {
    const newsItem = parseNewsLine(line);
    if (newsItem) {
      newsItems.push(newsItem);
    }
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

// 按年份筛选新闻
export function filterNewsByYear(newsItems: NewsItem[], year: number): NewsItem[] {
  return newsItems.filter(item => {
    const itemYear = new Date(item.date).getFullYear();
    return itemYear === year;
  });
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