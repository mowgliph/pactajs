import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string, role?: string) => api.post('/auth/register', { email, password, name, role }),
};

export const contractAPI = {
  getContracts: () => api.get('/contracts'),
  getContract: (id: string) => api.get(`/contracts/${id}`),
  createContract: (data: any) => api.post('/contracts', data),
  updateContract: (id: string, data: any) => api.put(`/contracts/${id}`, data),
  deleteContract: (id: string) => api.delete(`/contracts/${id}`),
  searchContracts: (params: any) => api.get('/contracts/search', { params }),
};

export const dashboardAPI = {
  getDashboardData: () => api.get('/dashboard'),
};

export const notificationAPI = {
  getNotifications: (params?: any) => api.get('/notifications', { params }),
  getNotification: (id: string) => api.get(`/notifications/${id}`),
  markAsRead: (id: string, read: boolean) => api.put(`/notifications/${id}/read`, { read }),
  markAllAsRead: () => api.post('/notifications/mark-all-read'),
  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),
  getPreferences: () => api.get('/notifications/preferences'),
  updatePreferences: (prefs: any) => api.put('/notifications/preferences', prefs),
  subscribe: (subscription: any) => api.post('/notifications/subscribe', { subscription }),
  unsubscribe: (endpoint: string) => api.post('/notifications/unsubscribe', { endpoint }),
  getVapidKey: () => api.get('/notifications/vapid-key'),
};

export const supplementAPI = {
  createSupplement: (contractId: string, data: any) => api.post(`/supplements/${contractId}`, data),
  getSupplements: (contractId: string) => api.get(`/supplements/${contractId}`),
  searchSupplements: (params?: any) => api.get('/supplements', { params }),
};

export const userAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id: string) => api.get(`/users/${id}`),
  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};

export const repositoryAPI = {
  uploadDocument: (contractId: string, file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    return api.post(`/contracts/${contractId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  listDocuments: (contractId: string) => api.get(`/contracts/${contractId}/documents`),
  downloadDocument: (contractId: string, documentId: string) => api.get(`/contracts/${contractId}/documents/${documentId}/download`, { responseType: 'blob' }),
  deleteDocument: (contractId: string, documentId: string) => api.delete(`/contracts/${contractId}/documents/${documentId}`),
};

export default api;