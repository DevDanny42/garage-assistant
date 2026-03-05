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
  getAll: (): Promise<InventoryItem[]> => apiClient.get('/inventory'),
  getById: (id: string): Promise<InventoryItem> => apiClient.get(`/inventory/${id}`),
  create: (data: CreateInventoryItemDto): Promise<InventoryItem> => apiClient.post('/inventory', data),
  update: (id: string, data: Partial<InventoryItem>): Promise<InventoryItem> => apiClient.put(`/inventory/${id}`, data),
  delete: (id: string): Promise<void> => apiClient.delete(`/inventory/${id}`),
};
