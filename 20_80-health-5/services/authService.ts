
import { User } from '../types';

const USERS_KEY = 'moodflow_users';
const SESSION_KEY = 'moodflow_session';

export const authService = {
  getUsers: (): User[] => {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  createUserAccount: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin' | 'password'> & { password: string }): User | string => {
    const users = authService.getUsers();
    
    if (users.find(u => u.email === userData.email)) {
      return "Email already exists.";
    }

    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      password: btoa(userData.password),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    users.push(newUser);
    authService.saveUsers(users);
    authService.createSession(newUser);
    return newUser;
  },

  loginUser: (email: string, password: string): User | string => {
    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.password === btoa(password));
    
    if (!user) {
      return "Invalid email or password.";
    }

    user.lastLogin = new Date().toISOString();
    authService.saveUsers(users);
    authService.createSession(user);
    return user;
  },

  createSession: (user: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  isLoggedIn: (): boolean => {
    return localStorage.getItem(SESSION_KEY) !== null;
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  updateUser: (updatedUser: User) => {
    const users = authService.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      authService.saveUsers(users);
      authService.createSession(updatedUser);
    }
  },

  deleteAccount: (userId: string) => {
    const users = authService.getUsers();
    const filtered = users.filter(u => u.id !== userId);
    authService.saveUsers(filtered);
    authService.logout();
  }
};
