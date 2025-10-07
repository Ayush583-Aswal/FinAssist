import axios from 'axios';
import type { ApiResponse, User } from './types';
import type { Transaction } from './types';

const API_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor to automatically add the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth Endpoints ---
export const registerUser = (userData: any) => 
  api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', userData);

export const loginUser = (userData: any) => 
  api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', userData);

// --- Transaction Endpoints ---
export const getTransactions = () => 
  api.get<ApiResponse<Transaction[]>>('/transactions');

export const createTransaction = (transactionData: Partial<Transaction>) => 
  api.post<ApiResponse<Transaction>>('/transactions', transactionData);

export const updateTransaction = (id: string, transactionData: Partial<Transaction>) =>
  api.patch<ApiResponse<Transaction>>(`/transactions/${id}`, transactionData);

export const deleteTransaction = (id: string) => 
  api.delete<ApiResponse<null>>(`/transactions/${id}`);

export const scanReceipt = (formData: FormData) =>
  api.post<ApiResponse<any>>('/transactions/scan-receipt', formData);

export default api;