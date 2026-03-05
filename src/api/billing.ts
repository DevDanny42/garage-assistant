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
  getAll: (): Promise<Invoice[]> => apiClient.get('/invoices'),
  getById: (id: string): Promise<Invoice> => apiClient.get(`/invoices/${id}`),
  create: (data: CreateInvoiceDto): Promise<Invoice> => apiClient.post('/invoices', data),
  update: (id: string, data: Partial<Invoice>): Promise<Invoice> => apiClient.put(`/invoices/${id}`, data),
  delete: (id: string): Promise<void> => apiClient.delete(`/invoices/${id}`),
};
