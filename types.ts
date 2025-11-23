export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  GUEST = 'GUEST'
}

export interface User {
  username: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  techStack: string[];
  githubUrl?: string;
  playStoreUrl?: string;
  createdAt: number;
}

export interface Technology {
  id: string;
  name: string;
  icon: string; // devicon class string
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}