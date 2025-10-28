import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export enum MeatType {
  CHICKEN = 'CHICKEN',
  BEEF = 'BEEF',
}

export enum PackageSize {
  SIZE_15 = 'SIZE_15',
  SIZE_20 = 'SIZE_20',
}

export interface Supply {
  id: string;
  date: string;
  meatType: MeatType;
  packageSize: PackageSize;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  clientId: string;
  client?: Client;
  date: string;
  meatType: MeatType;
  packageSize: PackageSize;
  quantity: number;
  isPaid: boolean;
  totalAmount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const suppliesApi = {
  getAll: () => api.get<Supply[]>('/supplies'),
  getOne: (id: string) => api.get<Supply>(`/supplies/${id}`),
  create: (data: Omit<Supply, 'id' | 'createdAt' | 'updatedAt'>) => api.post<Supply>('/supplies', data),
  update: (id: string, data: Partial<Omit<Supply, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.patch<Supply>(`/supplies/${id}`, data),
  delete: (id: string) => api.delete(`/supplies/${id}`),
};

export const clientsApi = {
  getAll: () => api.get<Client[]>('/clients'),
  getOne: (id: string) => api.get<Client>(`/clients/${id}`),
  create: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => api.post<Client>('/clients', data),
  update: (id: string, data: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.patch<Client>(`/clients/${id}`, data),
  delete: (id: string) => api.delete(`/clients/${id}`),
};

export const shipmentsApi = {
  getAll: (isPaid?: boolean) => {
    const params = isPaid !== undefined ? { isPaid } : {};
    return api.get<Shipment[]>('/shipments', { params });
  },
  getUnpaid: () => api.get<Shipment[]>('/shipments/unpaid'),
  getOne: (id: string) => api.get<Shipment>(`/shipments/${id}`),
  create: (data: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt' | 'client'>) =>
    api.post<Shipment>('/shipments', data),
  update: (id: string, data: Partial<Omit<Shipment, 'id' | 'createdAt' | 'updatedAt' | 'client'>>) =>
    api.patch<Shipment>(`/shipments/${id}`, data),
  markAsPaid: (id: string) => api.patch<Shipment>(`/shipments/${id}/mark-paid`),
  delete: (id: string) => api.delete(`/shipments/${id}`),
};

export const dashboardApi = {
  getDashboard: () => api.get('/dashboard'),
  getInventory: () => api.get('/dashboard/inventory'),
  getDebtors: () => api.get('/dashboard/debtors'),
  getStats: () => api.get('/dashboard/stats'),
};

export const reportsApi = {
  getPeriodReport: (startDate: string, endDate: string) =>
    api.get('/reports/period', { params: { startDate, endDate } }),
};
