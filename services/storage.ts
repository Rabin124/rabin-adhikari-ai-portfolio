import { Project, Technology } from '../types';

const STORAGE_KEY = 'droidfolio_projects';
const TECH_STORAGE_KEY = 'droidfolio_technologies';

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Dashboard',
    description: 'A responsive admin dashboard for an e-commerce platform. Built with React and Tailwind CSS, featuring dark mode, data visualization charts, and order management tables.',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts'],
    githubUrl: 'https://github.com',
    playStoreUrl: 'https://vercel.com',
    createdAt: Date.now()
  },
  {
    id: '2',
    title: 'Weather Web App',
    description: 'Minimalist weather application consuming the OpenWeatherMap API. Features location-based weather updates, 5-day forecasting, and dynamic background changes based on conditions.',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'REST API'],
    githubUrl: 'https://github.com',
    createdAt: Date.now() - 100000
  },
  {
    id: '3',
    title: 'Task Master',
    description: 'A full-stack productivity tool for managing daily tasks. Implements JWT authentication, drag-and-drop task organization, and real-time updates using Socket.io.',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
    playStoreUrl: 'https://vercel.com',
    createdAt: Date.now() - 200000
  }
];

const INITIAL_TECHNOLOGIES: Technology[] = [
  { id: '1', name: 'HTML5', icon: 'devicon-html5-plain colored' },
  { id: '2', name: 'CSS3', icon: 'devicon-css3-plain colored' },
  { id: '3', name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
  { id: '4', name: 'Java', icon: 'devicon-java-plain colored' },
  { id: '5', name: 'Python', icon: 'devicon-python-plain colored' },
  { id: '6', name: 'PHP', icon: 'devicon-php-plain colored' },
  { id: '7', name: 'WordPress', icon: 'devicon-wordpress-plain colored' },
  { id: '8', name: 'Docker', icon: 'devicon-docker-plain colored' },
  { id: '9', name: 'Web Sockets', icon: 'devicon-socketio-original colored' },
  { id: '10', name: 'Kubernetes', icon: 'devicon-kubernetes-plain colored' },
  { id: '11', name: 'React', icon: 'devicon-react-original colored' },
  { id: '12', name: 'Node.js', icon: 'devicon-nodejs-plain colored' },
  { id: '13', name: 'MongoDB', icon: 'devicon-mongodb-plain colored' },
  { id: '14', name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored' },
  { id: '15', name: 'MySQL', icon: 'devicon-mysql-plain colored' },
  { id: '16', name: 'Figma', icon: 'devicon-figma-plain colored' },
  { id: '17', name: 'Canva', icon: 'devicon-canva-original colored' },
];

// --- Projects ---

export const getProjects = (): Project[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  }
  return JSON.parse(stored);
};

export const saveProject = (project: Project): void => {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const deleteProject = (id: string): void => {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// --- Technologies ---

export const getTechnologies = (): Technology[] => {
  const stored = localStorage.getItem(TECH_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(TECH_STORAGE_KEY, JSON.stringify(INITIAL_TECHNOLOGIES));
    return INITIAL_TECHNOLOGIES;
  }
  return JSON.parse(stored);
};

export const addTechnology = (tech: Omit<Technology, 'id'>): void => {
  const technologies = getTechnologies();
  const newTech = { ...tech, id: crypto.randomUUID() };
  technologies.push(newTech);
  localStorage.setItem(TECH_STORAGE_KEY, JSON.stringify(technologies));
};

export const deleteTechnology = (id: string): void => {
  const technologies = getTechnologies();
  const filtered = technologies.filter(t => t.id !== id);
  localStorage.setItem(TECH_STORAGE_KEY, JSON.stringify(filtered));
};