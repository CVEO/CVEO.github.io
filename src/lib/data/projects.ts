import type { Project } from '../types';

// 验证项目数据
export function validateProject(project: any): Project {
  if (!project.title || typeof project.title !== 'string') {
    throw new Error('项目标题必须为字符串');
  }
  
  if (!project.leader || typeof project.leader !== 'string') {
    throw new Error('项目负责人必须为字符串');
  }
  
  if (!project.period || typeof project.period !== 'string') {
    throw new Error('项目周期必须为字符串');
  }
  
  if (!project.status || !['在研', '已结题'].includes(project.status)) {
    throw new Error('项目状态必须是"在研"或"已结题"');
  }
  
  if (!project.description || typeof project.description !== 'string') {
    throw new Error('项目描述必须为字符串');
  }
  
  if (!project.type || typeof project.type !== 'string') {
    throw new Error('项目类型必须为字符串');
  }
  
  return project as Project;
}

// 加载项目数据
export async function loadProjects(): Promise<Project[]> {
  try {
    const projectsData = await import('../../data/projects.json');
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

// 按类型筛选项目
export function filterProjectsByType(projects: Project[], type: string): Project[] {
  return projects.filter(project => project.type === type);
}