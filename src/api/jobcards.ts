import { apiClient } from './config';

export interface JobCard {
  id: string;
  jobNumber: string;
  customer: string;
  vehicle: string;
  services: string[];
  status: string;
  estimatedCost: number;
  assignedTo: string;
  createdAt: string;
  dueDate: string;
}

export type CreateJobCardDto = Omit<JobCard, 'id' | 'jobNumber' | 'createdAt'>;

export const jobCardsApi = {
  getAll: () => apiClient.get<JobCard[]>('/job-cards'),
  getById: (id: string) => apiClient.get<JobCard>(`/job-cards/${id}`),
  create: (data: CreateJobCardDto) => apiClient.post<JobCard>('/job-cards', data),
  update: (id: string, data: Partial<JobCard>) => apiClient.put<JobCard>(`/job-cards/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/job-cards/${id}`),
};
