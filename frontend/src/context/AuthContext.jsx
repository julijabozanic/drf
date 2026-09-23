import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch, ensureCsrfCookie } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      await ensureCsrfCookie();
      const data = await apiFetch('/auth/me/');
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(username, password) {
    await ensureCsrfCookie();
    const data = await apiFetch('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setUser(data);
  }

  async function register(username, email, password, password2) {
    await ensureCsrfCookie();
    const data = await apiFetch('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, password2 }),
    });
    setUser(data);
  }

  async function logout() {
    await apiFetch('/auth/logout/', { method: 'POST' });
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: !!user?.is_admin,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}