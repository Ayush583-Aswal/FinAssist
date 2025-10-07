export interface User {
    _id: string;
    name: string;
    email: string;
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
  
  export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
  }
  
  export interface ChartDataPoint {
    name: string;
    value: number;
  }