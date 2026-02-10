import { apiClient } from './config';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  unitPrice: number;
  supplier: string;
  lastUpdated: string;
}

export type CreateInventoryItemDto = Omit<InventoryItem, 'id' | 'lastUpdated'>;

export const inventoryApi = {
  getAll: () => apiClient.get<InventoryItem[]>('/inventory'),
  getById: (id: string) => apiClient.get<InventoryItem>(`/inventory/${id}`),
  create: (data: CreateInventoryItemDto) => apiClient.post<InventoryItem>('/inventory', data),
  update: (id: string, data: Partial<InventoryItem>) => apiClient.put<InventoryItem>(`/inventory/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/inventory/${id}`),
};
