export type PatentType = '发明专利' | '实用新型专利' | '软件著作权';
export type PatentStatus = '已授权' | '已登记' | '申请中' | '审查中';

export interface Patent {
  type: PatentType;
  title: string;
  patentNumber: string;
  grantDate: string;
  status?: PatentStatus;
  inventors?: string[];
  abstract?: string;
}

export interface Paper {
  title: string;
  journal: string;
  date: string;
  authors: string[];
  link?: string;
  abstract?: string;
  partition?: '中科院一区' | '中科院二区' | '中科院三区' | '中科院四区';
  equalFirst?: number[];
  corresponding?: number[];
  otherContributions?: Array<{
    authorIndex: number;
    symbol: string;
    description: string;
  }>;
}

export interface Member {
  name: string;
  role: string;
  group?: 'Professor' | 'Researcher' | 'PhD' | 'Master' | 'Undergrad' | 'Advisor';
  photo?: string;
  bio?: string;
  externalLink?: string;
  research?: string;  // 研究方向字段
}

export interface Project {
  title: string;
  period: string;
  status: '在研' | '已结题';
  source: string;
  level: '国家级' | '省部级' | '社会服务';
}

export interface Award {
  title: string;
  date: string;
  level: string;
  recipients?: string[];
}

export interface NewsItem {
  date: string;           // 日期 YYYY-MM-DD
  title: string;          // 新闻标题
  id: string;             // 唯一标识符
  url?: string;           // 可选：跳转链接
  image?: string;         // 可选：新闻图片路径
  description?: string;   // 可选：简短描述（1-2句话）
}

export interface TeamStats {
  label: string;
  value: string;
  unit: string;
}

export interface ResearchField {
  title: string;
  description: string;
}

export interface AboutData {
  teamName: string;
  leader: string;
  affiliation: string;
  introduction: string;
  researchFields: ResearchField[];
  stats: TeamStats[];
}