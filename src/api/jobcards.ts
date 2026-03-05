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
  getAll: (): Promise<JobCard[]> => apiClient.get('/job-cards'),
  getById: (id: string): Promise<JobCard> => apiClient.get(`/job-cards/${id}`),
  create: (data: CreateJobCardDto): Promise<JobCard> => apiClient.post('/job-cards', data),
  update: (id: string, data: Partial<JobCard>): Promise<JobCard> => apiClient.put(`/job-cards/${id}`, data),
  delete: (id: string): Promise<void> => apiClient.delete(`/job-cards/${id}`),
};
