import { useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAuthState({ user, isAuthenticated: true });
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setAuthState({ user, isAuthenticated: true });
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const register = (email: string, password: string, name: string, role: 'user' | 'admin' = 'user'): boolean => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      role,
      name,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    setAuthState({ user: newUser, isAuthenticated: true });
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('currentUser');
  };

  return {
    ...authState,
    login,
    register,
    logout,
    isAdmin: authState.user?.role === 'admin'
  };
};