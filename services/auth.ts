import { User, UserRole } from '../types';

const USERS_STORAGE_KEY = 'droidfolio_users_v1';

interface StoredUser {
  pass: string;
  user: User;
}

// Default initial users
const DEFAULT_USERS: StoredUser[] = [
  {
    pass: 'admin123',
    user: {
      username: 'admin',
      role: UserRole.ADMIN,
      name: 'System Administrator',
      avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Sunglasses&hairColor=Black&facialHairType=BeardLight&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light'
    }
  },
  {
    pass: 'mod123',
    user: {
      username: 'mod',
      role: UserRole.MODERATOR,
      name: 'Content Moderator',
      avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light'
    }
  },
  {
    pass: 'guest123',
    user: {
      username: 'guest',
      role: UserRole.GUEST,
      name: 'Guest User',
      avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=WinterHat2&accessoriesType=Kurt&hairColor=Blonde&facialHairType=MoustacheMagnum&clotheType=Hoodie&eyeType=Surprised&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Pale'
    }
  }
];

// Helper to access stored users
const getStoredUsers = (): StoredUser[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  return JSON.parse(stored);
};

// Helper to save users
const saveStoredUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const login = async (username: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const users = getStoredUsers();
  const account = users.find(u => u.user.username === username);

  if (account && account.pass === password) {
    localStorage.setItem('currentUser', JSON.stringify(account.user));
    return account.user;
  }
  throw new Error('Invalid credentials');
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem('currentUser');
  return stored ? JSON.parse(stored) : null;
};

// --- User Management Features (Backend Simulation) ---

export const getAllUsers = (): User[] => {
  return getStoredUsers().map(u => u.user);
};

export const updateUserRole = (username: string, newRole: UserRole): void => {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.user.username === username);
  
  if (index !== -1) {
    // Prevent changing the main admin's role to ensure access is not lost
    if (username === 'admin') {
      throw new Error("Cannot change the main Administrator's role.");
    }

    users[index].user.role = newRole;
    saveStoredUsers(users);
    
    // Update current session if the user modified themselves
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.username === username) {
      localStorage.setItem('currentUser', JSON.stringify(users[index].user));
    }
  }
};

export const updateUser = (username: string, updates: Partial<User>): void => {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.user.username === username);

  if (index !== -1) {
    // Security check: Don't allow changing username via this method
    if (updates.username && updates.username !== username) {
      throw new Error("Cannot change username.");
    }

    users[index].user = { ...users[index].user, ...updates };
    saveStoredUsers(users);

    // Update current session if the user modified themselves
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.username === username) {
      localStorage.setItem('currentUser', JSON.stringify(users[index].user));
    }
  }
};

export const deleteUser = (username: string): void => {
  if (username === 'admin') {
    throw new Error("Cannot delete the main Administrator.");
  }
  
  const users = getStoredUsers();
  const filtered = users.filter(u => u.user.username !== username);
  saveStoredUsers(filtered);
};