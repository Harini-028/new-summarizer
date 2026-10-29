import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'admin';
  plan: string;
}

interface AdminAuthContextValue {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, remember?: boolean) => Promise<AdminUser>;
  logout: () => void;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const ADMIN_TOKEN_KEY = 'chronicle_admin_token';
const ADMIN_REFRESH_KEY = 'chronicle_admin_refresh_token';
const ADMIN_USER_KEY = 'chronicle_admin_user';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore existing admin session on mount
  useEffect(() => {
    const restoreAdminSession = async () => {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY) || sessionStorage.getItem(ADMIN_TOKEN_KEY);
      const storedUser = localStorage.getItem(ADMIN_USER_KEY);
      const refreshToken = localStorage.getItem(ADMIN_REFRESH_KEY) || sessionStorage.getItem(ADMIN_REFRESH_KEY);

      if (token) {
        try {
          const res = await fetch('/api/admin/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (res.ok) {
            const serverAdmin = await res.json();
            if (serverAdmin.role === 'admin') {
              setAdminUser(serverAdmin);
            } else {
              clearStoredAdmin();
            }
          } else if ((res.status === 401 || res.status === 403) && refreshToken) {
            // Attempt token refresh
            const refreshRes = await fetch('/api/auth/refresh', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken })
            });

            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              const newToken = refreshData.token;

              if (localStorage.getItem(ADMIN_TOKEN_KEY)) {
                localStorage.setItem(ADMIN_TOKEN_KEY, newToken);
              } else {
                sessionStorage.setItem(ADMIN_TOKEN_KEY, newToken);
              }

              // Verify new token
              const retryRes = await fetch('/api/admin/auth/me', {
                headers: { Authorization: `Bearer ${newToken}` }
              });

              if (retryRes.ok) {
                const retryUser = await retryRes.json();
                if (retryUser.role === 'admin') {
                  setAdminUser(retryUser);
                } else {
                  clearStoredAdmin();
                }
              } else {
                clearStoredAdmin();
              }
            } else {
              clearStoredAdmin();
            }
          } else {
            clearStoredAdmin();
          }
        } catch {
          // Offline fallback
          if (storedUser) {
            try {
              const parsed = JSON.parse(storedUser);
              if (parsed.role === 'admin') {
                setAdminUser(parsed);
              }
            } catch {
              clearStoredAdmin();
            }
          }
        }
      }
      setIsLoading(false);
    };

    void restoreAdminSession();
  }, []);

  const clearStoredAdmin = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_REFRESH_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_REFRESH_KEY);
    setAdminUser(null);
  };

  const persistAdminSession = (token: string, refreshToken: string | undefined, user: AdminUser, remember: boolean) => {
    if (remember) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      if (refreshToken) localStorage.setItem(ADMIN_REFRESH_KEY, refreshToken);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
      if (refreshToken) sessionStorage.setItem(ADMIN_REFRESH_KEY, refreshToken);
    }
  };

  const login = useCallback(async (email: string, password: string, remember = true): Promise<AdminUser> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 403) {
        const forbiddenErr = data.error || 'Access denied. Administrator privileges required.';
        setError(forbiddenErr);
        throw new Error(forbiddenErr);
      }

      if (!res.ok) {
        const authErr = data.error || 'Invalid administrator email or password.';
        setError(authErr);
        throw new Error(authErr);
      }

      if (!data.user || data.user.role !== 'admin') {
        const roleErr = 'Access denied. Authenticated account does not possess administrator role.';
        setError(roleErr);
        throw new Error(roleErr);
      }

      const adminProfile: AdminUser = {
        id: data.user.id || data.user._id,
        name: data.user.name || 'Chronicle Administrator',
        email: data.user.email,
        avatarUrl: data.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name || 'Admin')}&background=6366f1&color=fff&size=200`,
        role: 'admin',
        plan: data.user.plan || 'Enterprise SaaS'
      };

      persistAdminSession(data.token, data.refreshToken, adminProfile, remember);
      setAdminUser(adminProfile);
      return adminProfile;
    } catch (err: any) {
      if (!err.message || err.message === 'Failed to fetch') {
        const netErr = 'Unable to connect to the authentication server. Please check your network connection.';
        setError(netErr);
        throw new Error(netErr);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredAdmin();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AdminAuthContext.Provider value={{
      adminUser,
      isAuthenticated: !!adminUser,
      isLoading,
      error,
      login,
      logout,
      clearError
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>');
  return ctx;
}
