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
}

export interface Project {
  title: string;
  leader: string;
  period: string;
  status: '在研' | '已结题';
  description: string;
  type: string;
}

export interface Award {
  title: string;
  date: string;
  level: string;
  recipients?: string[];
}

export interface NewsItem {
  date: string;
  text: string;
  id: string;
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