import { apiClient } from './config';

export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface PendingUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  documentUrl?: string;
  documentName?: string;
  createdAt: string;
}

export const usersApi = {
  getPending: (): Promise<PendingUser[]> => apiClient.get('/users/pending'),
  getAll: (): Promise<PendingUser[]> => apiClient.get('/users'),
  approve: (id: string): Promise<void> => apiClient.put(`/users/${id}/approve`),
  reject: (id: string): Promise<void> => apiClient.put(`/users/${id}/reject`),
};
