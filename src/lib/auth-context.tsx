import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { authApi, ApiError, User } from './api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: 'GCC' | 'STARTUP';
    company_website?: string;
    description: string;
    gst_number?: string;
    additional_email?: string;
    mobile_primary?: string;
    mobile_secondary?: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isApproved: boolean;
  pendingApprovalUser: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [pendingApprovalUser, setPendingApprovalUser] = useState<User | null>(null);

  const loadUser = useCallback(async () => {
    const t = localStorage.getItem('token');
    if (!t) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      const normalized = { ...me, approvalStatus: me.approvalStatus ?? (me as unknown as { approval_status?: string }).approval_status ?? 'APPROVED' };
      setUser(normalized);
      setPendingApprovalUser(null);
    } catch {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    try {
      const res = await authApi.login(email, password);
      const user = res.user;
      // Ensure approvalStatus is set (backend may send approval_status)
      const normalized = { ...user, approvalStatus: user.approvalStatus ?? (user as unknown as { approval_status?: string }).approval_status ?? 'APPROVED' };
      setToken(res.token);
      setUser(normalized);
      setPendingApprovalUser(null);
      return normalized;
    } catch (err) {
      if (err instanceof ApiError && err.code === 'PENDING_APPROVAL' && err.data?.user) {
        setPendingApprovalUser(err.data.user as User);
      }
      throw err;
    }
  }, []);

  const register = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    role: 'GCC' | 'STARTUP';
    company_website?: string;
    description: string;
    gst_number?: string;
    additional_email?: string;
    mobile_primary?: string;
    mobile_secondary?: string;
  }) => {
    await authApi.register(data);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setPendingApprovalUser(null);
    localStorage.removeItem('token');
  }, []);

  const isAuthenticated = !!user && (user.role === 'ADMIN' || user.approvalStatus === 'APPROVED');
  const isApproved = !!user && (user.role === 'ADMIN' || user.approvalStatus === 'APPROVED');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isApproved,
        pendingApprovalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
