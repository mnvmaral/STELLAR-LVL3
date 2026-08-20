import type { User, LoginCredentials, SignupData, AuthResponse } from '../types';

// Mock storage for users
const USERS_KEY = 'eventhub_users';
const AUTH_KEY = 'eventhub_auth';

// Initialize with default admin and user
const initializeUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    const defaultUsers: User[] = [
      {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@eventhub.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-1',
        name: 'John Doe',
        email: 'user@eventhub.com',
        role: 'user',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
};

initializeUsers();

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email === credentials.email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Mock token
    const token = `mock-token-${user.id}-${Date.now()}`;
    
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token }));
    
    return { user, token };
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find(u => u.email === data.email)) {
      throw new Error('Email already exists');
    }

    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const token = `mock-token-${newUser.id}-${Date.now()}`;
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user: newUser, token }));

    return { user: newUser, token };
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentUser: (): User | null => {
    const auth = localStorage.getItem(AUTH_KEY);
    if (!auth) return null;
    
    try {
      const { user } = JSON.parse(auth);
      return user;
    } catch {
      return null;
    }
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const auth = JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
    auth.user = users[userIndex];
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));

    return users[userIndex];
  },
};
