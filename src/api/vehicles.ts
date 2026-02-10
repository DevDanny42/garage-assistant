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
  getAll: () => apiClient.get<Vehicle[]>('/vehicles'),
  getById: (id: string) => apiClient.get<Vehicle>(`/vehicles/${id}`),
  create: (data: CreateVehicleDto) => apiClient.post<Vehicle>('/vehicles', data),
  update: (id: string, data: Partial<Vehicle>) => apiClient.put<Vehicle>(`/vehicles/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/vehicles/${id}`),
};
