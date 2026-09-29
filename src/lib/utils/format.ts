// 格式化日期（年月）
export function formatDate(dateStr: string): string {
  if (!dateStr) return '日期未知';

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return '日期格式错误';
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}年${month}月`;
  } catch (error) {
    return '日期解析错误';
  }
}

// 格式化新闻日期（年月日）
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
