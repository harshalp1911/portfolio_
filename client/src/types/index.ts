export interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  caption?: string;
  likes: number;
  comments: Comment[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  author: string;
  content: string;
  createdAt: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  visible: boolean;
  order: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  totalViews: number;
  projectViews: number;
  postViews: number;
  contactForms: number;
  topProjects: Project[];
  recentActivity: any[];
  viewsByDay: { _id: string; count: number }[];
}
