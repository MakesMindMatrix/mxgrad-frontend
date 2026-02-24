import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import type { User } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Check, X, RefreshCw } from 'lucide-react';

type ConfirmUserAction = { action: 'approve' | 'reject'; user: User } | null;

export default function AdminApprovals() {
  const [pending, setPending] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmUser, setConfirmUser] = useState<ConfirmUserAction>(null);

  const load = () => {
    setLoading(true);
    adminApi.getPendingApprovals().then(setPending).catch(() => setPending([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      await adminApi.approve(userId);
      setPending((p) => p.filter((u) => u.id !== userId));
    } catch {
      load();
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await adminApi.reject(userId);
      setPending((p) => p.filter((u) => u.id !== userId));
    } catch {
      load();
    }
  };

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Pending approvals</h1>
          <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        <p className="text-muted-foreground mb-6">Approve or reject new GCC and Startup registrations. Until approved, they cannot log in.</p>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : pending.length === 0 ? (
          <div className="page-card p-12 text-center text-muted-foreground">
            <Check className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-70" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No pending approvals</h2>
            <p>All registrations have been processed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((u) => (
              <div key={u.id} className="page-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{u.name}</span>
                    <span className={`chip ${u.role === 'GCC' ? 'chip-default' : 'chip-ai'}`}>{u.role}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registered {(u.createdAt ?? u.created_at) ? new Date((u.createdAt ?? u.created_at) as string).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-destructive"
                    onClick={() => setConfirmUser({ action: 'reject', user: u })}
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1 text-green-600 bg-green-500/20 hover:bg-green-500/30"
                    onClick={() => setConfirmUser({ action: 'approve', user: u })}
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {confirmUser && (
          <ConfirmDialog
            open
            onClose={() => setConfirmUser(null)}
            title={confirmUser.action === 'approve' ? 'Approve this user?' : 'Reject this user?'}
            message={
              confirmUser.action === 'approve'
                ? `Are you sure you want to approve ${confirmUser.user.name}? They will be able to log in.`
                : `Are you sure you want to reject ${confirmUser.user.name}? They will not be able to log in.`
            }
            confirmLabel={confirmUser.action === 'approve' ? 'Yes, approve' : 'Yes, reject'}
            cancelLabel="No"
            variant={confirmUser.action === 'reject' ? 'destructive' : 'default'}
            onConfirm={async () => {
              if (confirmUser.action === 'approve') await handleApprove(confirmUser.user.id);
              else await handleReject(confirmUser.user.id);
              setConfirmUser(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
