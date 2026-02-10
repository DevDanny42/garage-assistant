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
  getAll: () => apiClient.get<Customer[]>('/customers'),
  getById: (id: string) => apiClient.get<Customer>(`/customers/${id}`),
  create: (data: CreateCustomerDto) => apiClient.post<Customer>('/customers', data),
  update: (id: string, data: Partial<Customer>) => apiClient.put<Customer>(`/customers/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/customers/${id}`),
};
