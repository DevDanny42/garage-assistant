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
  lastService: string;
  totalServices: number;
}

export type CreateVehicleDto = Omit<Vehicle, 'id' | 'lastService' | 'totalServices'>;

export const vehiclesApi = {
  getAll: (): Promise<Vehicle[]> => apiClient.get('/vehicles'),
  getById: (id: string): Promise<Vehicle> => apiClient.get(`/vehicles/${id}`),
  create: (data: CreateVehicleDto): Promise<Vehicle> => apiClient.post('/vehicles', data),
  update: (id: string, data: Partial<Vehicle>): Promise<Vehicle> => apiClient.put(`/vehicles/${id}`, data),
  delete: (id: string): Promise<void> => apiClient.delete(`/vehicles/${id}`),
};
