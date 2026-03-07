import { apiClient } from './config';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
  owner: string;
  ownerEmail?: string;
  ownerPhone?: string;
  lastService: string;
  totalServices: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
  submittedAt?: string;
}

export type CreateVehicleDto = Omit<Vehicle, 'id' | 'lastService' | 'totalServices' | 'status' | 'submittedAt'>;

export const vehiclesApi = {
  getAll: (): Promise<Vehicle[]> => apiClient.get('/vehicles'),
  getById: (id: string): Promise<Vehicle> => apiClient.get(`/vehicles/${id}`),
  getMyVehicles: (): Promise<Vehicle[]> => apiClient.get('/vehicles/my'),
  getPending: (): Promise<Vehicle[]> => apiClient.get('/vehicles/pending'),
  create: (data: CreateVehicleDto): Promise<Vehicle> => apiClient.post('/vehicles', data),
  update: (id: string, data: Partial<Vehicle>): Promise<Vehicle> => apiClient.put(`/vehicles/${id}`, data),
  approve: (id: string): Promise<Vehicle> => apiClient.put(`/vehicles/${id}/approve`),
  reject: (id: string): Promise<Vehicle> => apiClient.put(`/vehicles/${id}/reject`),
  delete: (id: string): Promise<void> => apiClient.delete(`/vehicles/${id}`),
};
