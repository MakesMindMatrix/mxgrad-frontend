import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedRoles?: ('ADMIN' | 'GCC' | 'STARTUP' | 'INCUBATION')[];
}

export default function ProtectedRoute({ children, requireAdmin, allowedRoles }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Admin routes redirect to the hidden admin login page
    if (requireAdmin) return <Navigate to="/admin" state={{ from: location }} replace />;
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const approvalStatus = user.approvalStatus ?? (user as unknown as { approval_status?: string }).approval_status;
  if (user.role !== 'ADMIN' && approvalStatus !== 'APPROVED') {
    return <Navigate to="/pending-approval" replace />;
  }

  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
