export interface User {
    _id: string;
    name: string;
    email: string;
}
  
export interface Transaction {
_id: string;
userId: string;
type: 'income' | 'expense';
amount: number;
category: string;
description?: string;
date: string; // Stored as ISO string
}

// For API responses from your backend
export interface ApiResponse<T> {
statusCode: number;
data: T;
message: string;
success: boolean;
}