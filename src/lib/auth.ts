
import { User } from '@/types';
import { getUsers, setUsers, getCurrentUser, setCurrentUser } from './storage';

export const login = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password && u.status === 'active');
  
  if (user) {
    const updatedUser = { ...user, lastAccess: new Date().toISOString() };
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    return updatedUser;
  }
  
  return null;
};

export const logout = (): void => {
  setCurrentUser(null);
};

export const register = (name: string, email: string, password: string): User | null => {
  const users = getUsers();
  
  if (users.some(u => u.email === email)) {
    return null;
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    password,
    role: 'viewer',
    status: 'active',
    lastAccess: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  
  setUsers([...users, newUser]);
  return newUser;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const hasPermission = (requiredRole: User['role']): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const roleHierarchy: Record<User['role'], number> = {
    viewer: 1,
    editor: 2,
    manager: 3,
    admin: 4,
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};
