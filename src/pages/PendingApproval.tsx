import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Clock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PendingApproval() {
  const { user, logout, pendingApprovalUser } = useAuth();
  const navigate = useNavigate();
  const displayUser = pendingApprovalUser || user;
  const isManagedStartup = displayUser?.role === 'STARTUP' && !!displayUser.managed_by_name;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-lg page-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-6">
          <Clock className="h-8 w-8 text-warning" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Registration under review</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for registering. Your account is pending approval by our admin team. You cannot log in until then.
        </p>

        {isManagedStartup && (
          <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-left">
            <p className="font-medium text-foreground">Registered under an incubation center</p>
            <p className="text-sm text-muted-foreground mt-1">
              This startup account is associated with <span className="text-foreground font-medium">{displayUser?.managed_by_name}</span>
              {displayUser?.managed_by_email ? <> ({displayUser.managed_by_email})</> : null}. Admins can see this relationship during approval.
            </p>
          </div>
        )}

        {displayUser && (
          <div className="bg-muted/50 rounded-lg p-4 text-left mb-6">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Name</span>
              <span>{displayUser.name}</span>
              <span className="text-muted-foreground">Email</span>
              <span>{displayUser.email}</span>
              <span className="text-muted-foreground">Account type</span>
              <span>{displayUser.role}</span>
              {isManagedStartup && (
                <>
                  <span className="text-muted-foreground">Registration path</span>
                  <span>Created by incubation center</span>
                </>
              )}
              {displayUser.managed_by_name && (
                <>
                  <span className="text-muted-foreground">Incubation center</span>
                  <span>{displayUser.managed_by_name}</span>
                </>
              )}
              <span className="text-muted-foreground">Status</span>
              <span className="text-warning">{displayUser.approvalStatus}</span>
            </div>
          </div>
        )}

        <div className="space-y-2 text-sm text-muted-foreground mb-8">
          <p>1. Our admin team will verify your details.</p>
          {isManagedStartup && <p>2. Your incubation center link stays attached to this startup after approval.</p>}
          <p>{isManagedStartup ? '3.' : '2.'} Once approved, you can log in and access the portal.</p>
          <p className="italic">Approval usually takes 24-48 hours.</p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
