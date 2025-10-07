const API_BASE_URL = "http://localhost:5000/api/v1";

export interface AuthResponse {
  statusCode: number;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
    };
    token: string;
  };
  message: string;
  success: boolean;
}

export interface Transaction {
  _id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionResponse {
  statusCode: number;
  data: Transaction | Transaction[];
  message: string;
  success: boolean;
}

export interface ReceiptScanResponse {
  statusCode: number;
  data: {
    amount: number;
    date: string;
    description: string;
    category: string;
  };
  message: string;
  success: boolean;
}

// Auth API
export const authApi = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }
    
    return response.json();
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
    
    return response.json();
  },
};

// Transactions API
export const transactionsApi = {
  getAll: async (token: string): Promise<Transaction[]> => {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    
    const data: TransactionResponse = await response.json();
    return Array.isArray(data.data) ? data.data : [];
  },

  create: async (
    token: string,
    transaction: Omit<Transaction, "_id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<Transaction> => {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transaction),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create transaction");
    }
    
    const data: TransactionResponse = await response.json();
    return data.data as Transaction;
  },

  update: async (
    token: string,
    id: string,
    updates: Partial<Omit<Transaction, "_id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<Transaction> => {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error("Failed to update transaction");
    }
    
    const data: TransactionResponse = await response.json();
    return data.data as Transaction;
  },

  delete: async (token: string, id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to delete transaction");
    }
  },

  scanReceipt: async (token: string, file: File): Promise<ReceiptScanResponse["data"]> => {
    const formData = new FormData();
    formData.append("receipt", file);

    const response = await fetch(`${API_BASE_URL}/transactions/scan-receipt`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Failed to scan receipt");
    }
    
    const data: ReceiptScanResponse = await response.json();
    return data.data;
  },
};