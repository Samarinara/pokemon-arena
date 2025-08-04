// types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}