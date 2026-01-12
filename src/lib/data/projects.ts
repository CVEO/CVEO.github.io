import type { Project } from '../types';

// 验证项目数据
export function validateProject(project: any): Project {
  if (!project.title || typeof project.title !== 'string') {
    throw new Error('项目标题必须为字符串');
  }
  
  if (!project.period || typeof project.period !== 'string') {
    throw new Error('项目周期必须为字符串');
  }
  
  if (!project.status || !['在研', '已结题'].includes(project.status)) {
    throw new Error('项目状态必须是"在研"或"已结题"');
  }
  
  if (typeof project.source !== 'string') {
    throw new Error('项目来源必须为字符串');
  }
  
  if (!project.level || !['国家级', '省部级', '社会服务'].includes(project.level)) {
    throw new Error('项目级别必须是"国家级"、"省部级"或"社会服务"');
  }
  
  return project as Project;
}

// 加载项目数据
export async function loadProjects(): Promise<Project[]> {
  try {
    const projectsData = await import('../../data/research-projects.json');
    const projects = projectsData.default;
    
    if (!Array.isArray(projects)) {
      throw new Error('项目数据必须是数组');
    }
    
    return projects.map(validateProject);
  } catch (error) {
    console.error('加载项目数据失败:', error);
    throw error;
  }
}

// 按状态筛选项目
export function filterProjectsByStatus(projects: Project[], status: '在研' | '已结题'): Project[] {
  return projects.filter(project => project.status === status);
}

// 按来源筛选项目
export function filterProjectsBySource(projects: Project[], source: string): Project[] {
  return projects.filter(project => project.source === source);
}

// 提取项目开始时间
function extractStartTime(period: string): number {
  if (!period) return 0;
  
  // 尝试匹配各种日期格式
  const patterns = [
    /(\d{4})年(\d{1,2})月\s*-\s*\d{4}年\d{1,2}月/, // 2023年1月 - 2026年12月
    /(\d{4})\.(\d{1,2})-(\d{4})\.(\d{1,2})/, // 2023.6-2025.12
    /(\d{4})-(\d{4})/, // 2023-2025
    /(\d{4})/, // 2024
  ];
  
  for (const pattern of patterns) {
    const match = period.match(pattern);
    if (match && match[1]) {
      const year = parseInt(match[1]);
      const month = match[2] ? parseInt(match[2]) : 1;
      return year * 100 + month; // 转换为 YYYYMM 格式便于比较
    }
  }
  
  return 0; // 如果无法解析，返回0
}

// 按级别和开始时间排序项目
export function sortProjectsByLevel(projects: Project[]): Project[] {
  const levelOrder = {
    '国家级': 1,
    '省部级': 2,
    '社会服务': 3
  };
  
  return [...projects].sort((a, b) => {
    // 首先按级别排序
    const levelDiff = levelOrder[a.level] - levelOrder[b.level];
    if (levelDiff !== 0) {
      return levelDiff;
    }
    
    // 如果级别相同，按开始时间倒序排序
    const aStartTime = extractStartTime(a.period);
    const bStartTime = extractStartTime(b.period);
    return bStartTime - aStartTime; // 倒序：新的在前
  });
}