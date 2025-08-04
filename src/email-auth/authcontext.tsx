import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType, AuthResult } from './types';
import { invoke } from '@tauri-apps/api/core';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    setLoading(false);
  };

  const login = async (email: string, key: string): Promise<AuthResult> => {
    try {
      const verified = await invoke("verify_key", { email, key });
      if (verified) {
        const user = { id: email, email, name: email };
        setUser(user);
        return { success: true };
      } else {
        return { success: false, error: "Invalid key" };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};