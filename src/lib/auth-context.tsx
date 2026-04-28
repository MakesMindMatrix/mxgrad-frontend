import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { authApi, ApiError, type ApprovalStatus, type RegisterPayload, type User } from './api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, endpoint?: string) => Promise<User | null>;
  register: (data: RegisterPayload) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  isApproved: boolean;
  pendingApprovalUser: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeApprovalStatus(value: unknown): ApprovalStatus {
  return value === 'PENDING' || value === 'REJECTED' ? value : 'APPROVED';
}

function normalizeUser(user: User): User {
  const approvalStatus = normalizeApprovalStatus(user.approvalStatus ?? user.approval_status);
  return {
    ...user,
    approvalStatus,
    approval_status: approvalStatus,
  };
}

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
      const normalized = normalizeUser(me);
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

  const login = useCallback(async (email: string, password: string, endpoint?: string): Promise<User | null> => {
    try {
      const res = await authApi.login(email, password, endpoint);
      const normalized = normalizeUser(res.user);
      setToken(res.token);
      setUser(normalized);
      setPendingApprovalUser(null);
      return normalized;
    } catch (err) {
      if (err instanceof ApiError && err.code === 'PENDING_APPROVAL' && err.data?.user) {
        setPendingApprovalUser(normalizeUser(err.data.user as User));
      }
      throw err;
    }
  }, []);

  const register = useCallback(async (data: RegisterPayload) => {
    const res = await authApi.register(data);
    const pendingUser = normalizeUser(res.user);
    setPendingApprovalUser(pendingUser);
    return pendingUser;
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
