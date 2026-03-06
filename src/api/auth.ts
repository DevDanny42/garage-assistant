import { apiClient } from './config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    avatar?: string;
  };
}

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> => apiClient.post('/auth/login', data),
  signup: (data: FormData): Promise<AuthResponse> =>
    apiClient.post('/auth/signup', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
