import { useState, useEffect, useCallback } from 'react';
import { authApi, User } from '@/api/mockApi';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authApi.getCurrentUser().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const result = await authApi.login(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      setUser(result.user);
    }
    setLoading(false);
    return result;
  }, []);

  const signup = useCallback(async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    const result = await authApi.signup(username, email, password);
    if (result.error) {
      setError(result.error);
    } else {
      setUser(result.user);
    }
    setLoading(false);
    return result;
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    await authApi.logout();
    setUser(null);
    setLoading(false);
  }, []);

  return { user, loading, error, login, signup, logout };
}
