// 格式化日期
export function formatDate(dateStr: string): string {
  if (!dateStr) return '日期未知';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
  // 尝试解析 YYYY-MM-DD 格式
  const match = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    const year = parseInt(match[1] || '0');
    const month = parseInt(match[2] || '0');
    return `${year}年${month.toString().padStart(2, '0')}月`;
  }
      return '日期格式错误';
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}年${month}月`;
  } catch (error) {
    return '日期解析错误';
  }
}

// 格式化新闻日期
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

// 生成URL友好的slug
export function generateSlug(text: string): string {
  return text.toLowerCase()
    .replace(/[\s\/\\]+/g, '-')
    .replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, '')
    .replace(/-+/g, '-');
}

// 截断文本
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// 安全解析JSON
export function safeParseJSON<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('JSON解析失败:', error);
    return defaultValue;
  }
}