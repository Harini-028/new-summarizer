import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'user' | 'admin' | 'subscriber';
  plan: 'Free Tier' | 'Pro Member' | 'Enterprise SaaS';
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);   // true on mount to restore session
  const [error, setError] = useState<string | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('chronicle_token') || sessionStorage.getItem('chronicle_token');
      const storedUser = localStorage.getItem('chronicle_user');
      const refreshToken = localStorage.getItem('chronicle_refresh_token') || sessionStorage.getItem('chronicle_refresh_token');
      
      if (token) {
        try {
          // Verify with server
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const serverUser = await res.json();
            setUser(normalizeUser(serverUser));
          } else if ((res.status === 401 || res.status === 403) && refreshToken) {
            // Access token expired — try refreshing
            const refreshRes = await fetch('/api/auth/refresh', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken })
            });
            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              const newToken = refreshData.token;
              
              if (localStorage.getItem('chronicle_token')) {
                localStorage.setItem('chronicle_token', newToken);
              } else {
                sessionStorage.setItem('chronicle_token', newToken);
              }

              // Retry fetch profile
              const retryRes = await fetch('/api/auth/me', {
                headers: { Authorization: `Bearer ${newToken}` }
              });
              if (retryRes.ok) {
                const serverUser = await retryRes.json();
                setUser(normalizeUser(serverUser));
              }
            } else {
              // Refresh token also invalid
              localStorage.removeItem('chronicle_token');
              localStorage.removeItem('chronicle_refresh_token');
              localStorage.removeItem('chronicle_user');
              sessionStorage.removeItem('chronicle_token');
              sessionStorage.removeItem('chronicle_refresh_token');
            }
          } else {
            // Token invalid — clear storage
            localStorage.removeItem('chronicle_token');
            localStorage.removeItem('chronicle_refresh_token');
            localStorage.removeItem('chronicle_user');
            sessionStorage.removeItem('chronicle_token');
            sessionStorage.removeItem('chronicle_refresh_token');
          }
        } catch {
          // Network error — use cached user so app still works offline
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              /* ignore */
            }
          }
        }
      }
      setIsLoading(false);
    };
    void restoreSession();
  }, []);

  const normalizeUser = (raw: any): AuthUser => ({
    id: raw.id || 'usr_' + Math.random().toString(36).substr(2, 6),
    name: raw.name || 'Chronicle User',
    email: raw.email || '',
    avatarUrl: raw.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(raw.name || 'U')}&background=6366f1&color=fff&size=200`,
    role: raw.role || 'subscriber',
    plan: raw.plan || 'Free Tier',
  });

  const persistSession = (token: string, refreshToken: string | undefined, authUser: AuthUser, remember: boolean) => {
    if (remember) {
      localStorage.setItem('chronicle_token', token);
      if (refreshToken) localStorage.setItem('chronicle_refresh_token', refreshToken);
      localStorage.setItem('chronicle_user', JSON.stringify(authUser));
    } else {
      sessionStorage.setItem('chronicle_token', token);
      if (refreshToken) sessionStorage.setItem('chronicle_refresh_token', refreshToken);
    }
  };

  const login = useCallback(async (email: string, password: string, remember = true) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[AUTH_LOGIN_ATTEMPT]', email);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 429) {
        const rateError = 'Too many login attempts. Please wait a moment and try again.';
        setError(rateError);
        throw new Error(rateError);
      }
      if (!res.ok) {
        const authError = data.error || 'Invalid email or password.';
        setError(authError);
        throw new Error(authError);
      }
      console.log('[AUTH_LOGIN_SUCCESS]', email);
      const authUser = normalizeUser(data.user);
      persistSession(data.token, data.refreshToken, authUser, remember);
      setUser(authUser);
    } catch (err: any) {
      if (!err.message || err.message === 'Failed to fetch') {
        const netErr = 'Unable to connect to the authentication service. Please check your network connection.';
        setError(netErr);
        throw new Error(netErr);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      const authUser = normalizeUser(data.user);
      persistSession(data.token, data.refreshToken, authUser, true);
      setUser(authUser);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('chronicle_token');
    localStorage.removeItem('chronicle_refresh_token');
    localStorage.removeItem('chronicle_user');
    sessionStorage.removeItem('chronicle_token');
    sessionStorage.removeItem('chronicle_refresh_token');
    setUser(null);
    // Fire and forget
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      register,
      logout,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
