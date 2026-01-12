import type { Patent, PatentType, PatentStatus } from '../types';

// 验证专利类型
export function isValidPatentType(type: string): type is PatentType {
  return ['发明专利', '实用新型专利', '软件著作权'].includes(type);
}

// 验证专利状态
export function isValidPatentStatus(status: string): status is PatentStatus {
  return ['已授权', '已登记', '申请中', '审查中'].includes(status);
}

// 验证单个专利
export function validatePatent(patent: any): Patent {
  if (!patent.type || !isValidPatentType(patent.type)) {
    throw new Error(`无效的专利类型: ${patent.type}`);
  }
  
  if (!patent.title || typeof patent.title !== 'string') {
    throw new Error('专利标题必须为字符串');
  }
  
  if (!patent.patentNumber || typeof patent.patentNumber !== 'string') {
    throw new Error('专利号必须为字符串');
  }
  
  if (!patent.grantDate || typeof patent.grantDate !== 'string') {
    throw new Error('授权日期必须为字符串');
  }
  
  // 验证日期格式 (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(patent.grantDate)) {
    throw new Error(`无效的日期格式: ${patent.grantDate}，应为 YYYY-MM-DD`);
  }
  
  if (patent.status && !isValidPatentStatus(patent.status)) {
    throw new Error(`无效的专利状态: ${patent.status}`);
  }
  
  if (patent.inventors && !Array.isArray(patent.inventors)) {
    throw new Error('发明人必须为数组');
  }
  
  if (patent.abstract && typeof patent.abstract !== 'string') {
    throw new Error('摘要必须为字符串');
  }
  
  return patent as Patent;
}

// 加载和验证专利数据
export async function loadPatents(): Promise<Patent[]> {
  try {
    // 动态导入JSON数据
    const patentsData = await import('../../data/patents.json');
    const patents = patentsData.default;
    
    if (!Array.isArray(patents)) {
      throw new Error('专利数据必须是数组');
    }
    
    // 验证所有专利
    return patents.map(validatePatent);
  } catch (error) {
    console.error('加载专利数据失败:', error);
    throw error;
  }
}

// 按类型筛选专利
export function filterPatentsByType(patents: Patent[], type: PatentType): Patent[] {
  return patents.filter(patent => patent.type === type);
}

// 按状态筛选专利
export function filterPatentsByStatus(patents: Patent[], status: PatentStatus): Patent[] {
  return patents.filter(patent => patent.status === status);
}

// 按年份筛选专利
export function filterPatentsByYear(patents: Patent[], year: number): Patent[] {
  return patents.filter(patent => {
    const patentYear = new Date(patent.grantDate).getFullYear();
    return patentYear === year;
  });
}

// 排序专利
export function sortPatents(patents: Patent[], sortBy: 'date-desc' | 'date-asc' | 'title' | 'type'): Patent[] {
  const sorted = [...patents];
  
  switch (sortBy) {
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.grantDate).getTime() - new Date(a.grantDate).getTime());
    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.grantDate).getTime() - new Date(b.grantDate).getTime());
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
    case 'type':
      return sorted.sort((a, b) => a.type.localeCompare(b.type, 'zh-CN'));
    default:
      return sorted;
  }
}