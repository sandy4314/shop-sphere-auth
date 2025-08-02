export interface User {
  id: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  name: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
  adminId: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}