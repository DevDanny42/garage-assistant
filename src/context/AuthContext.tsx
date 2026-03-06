import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/api/auth';
import { ApiError } from '@/api/config';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: 'admin' | 'user') => Promise<boolean>;
  signup: (name: string, email: string, phone: string, password: string, document?: File) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getAuthErrorMessage = (error: unknown, action: 'Login' | 'Signup'): string => {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return 'Cannot connect to backend. Configure VITE_API_URL and ensure server is running.';
    }
    return error.message || `${action} failed`;
  }
  return `${action} failed`;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('garage_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('garage_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'user' = 'user'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      const userData: User = {
        ...response.user,
        role: response.user?.role ?? role,
      };
      setUser(userData);
      localStorage.setItem('garage_user', JSON.stringify({ ...userData, token: response.token }));
      return true;
    } catch (error) {
      console.error('Login error:', getAuthErrorMessage(error, 'Login'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, phone: string, password: string, document?: File): Promise<boolean> => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('password', password);
      if (document) formData.append('document', document);
      const response = await authApi.signup(formData);
      const userData: User = {
        ...response.user,
        role: response.user?.role ?? 'user',
      };
      setUser(userData);
      localStorage.setItem('garage_user', JSON.stringify({ ...userData, token: response.token }));
      return true;
    } catch (error) {
      console.error('Signup error:', getAuthErrorMessage(error, 'Signup'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('garage_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
