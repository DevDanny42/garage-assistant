import { apiClient } from './config';

export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  jobCard: string;
  amount: number;
  tax: number;
  total: number;
  status: PaymentStatus;
  dueDate: string;
  createdAt: string;
  paidAt?: string;
}

export type CreateInvoiceDto = Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>;

export const billingApi = {
  getAll: () => apiClient.get<Invoice[]>('/invoices'),
  getById: (id: string) => apiClient.get<Invoice>(`/invoices/${id}`),
  create: (data: CreateInvoiceDto) => apiClient.post<Invoice>('/invoices', data),
  update: (id: string, data: Partial<Invoice>) => apiClient.put<Invoice>(`/invoices/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/invoices/${id}`),
};
