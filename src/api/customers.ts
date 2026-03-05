import { apiClient } from './config';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  vehicleCount: number;
  totalSpent: number;
  createdAt: string;
}

export type CreateCustomerDto = Omit<Customer, 'id' | 'vehicleCount' | 'totalSpent' | 'createdAt'>;

export const customersApi = {
  getAll: (): Promise<Customer[]> => apiClient.get('/customers'),
  getById: (id: string): Promise<Customer> => apiClient.get(`/customers/${id}`),
  create: (data: CreateCustomerDto): Promise<Customer> => apiClient.post('/customers', data),
  update: (id: string, data: Partial<Customer>): Promise<Customer> => apiClient.put(`/customers/${id}`, data),
  delete: (id: string): Promise<void> => apiClient.delete(`/customers/${id}`),
};
