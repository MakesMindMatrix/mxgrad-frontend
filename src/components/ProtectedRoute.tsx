import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedRoles?: ('ADMIN' | 'GCC' | 'STARTUP')[];
}

export default function ProtectedRoute({ children, requireAdmin, allowedRoles }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin is always considered approved; others must have APPROVED status
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
