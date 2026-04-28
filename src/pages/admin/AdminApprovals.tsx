import { useEffect, useState, useMemo } from 'react';
import { adminApi } from '@/lib/api';
import type { User } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Check, X, RefreshCw, Building2, Lightbulb, FlaskConical, Users } from 'lucide-react';

type ConfirmUserAction = { action: 'approve' | 'reject'; user: User } | null;
type Tab = 'all' | 'GCC' | 'STARTUP' | 'INCUBATION';

const TABS: { key: Tab; label: string; icon: React.ElementType; color: string; empty: string }[] = [
  { key: 'all', label: 'All Pending', icon: Users, color: 'text-slate-400', empty: 'No pending approvals.' },
  { key: 'GCC', label: 'Enterprises / GCC', icon: Building2, color: 'text-blue-400', empty: 'No pending GCC registrations.' },
  { key: 'STARTUP', label: 'Startups', icon: Lightbulb, color: 'text-violet-400', empty: 'No pending startup registrations.' },
  { key: 'INCUBATION', label: 'Incubation Centers', icon: FlaskConical, color: 'text-emerald-400', empty: 'No pending incubation center registrations.' },
];

const ROLE_BADGE: Record<string, string> = {
  GCC: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  STARTUP: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  INCUBATION: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

const ROLE_LABEL: Record<string, string> = {
  GCC: 'Enterprise / GCC',
  STARTUP: 'Startup',
  INCUBATION: 'Incubation Center',
};

function UserCard({ u, onApprove, onReject }: { u: User; onApprove: () => void; onReject: () => void }) {
  const badge = ROLE_BADGE[u.role] ?? 'bg-gray-100 text-gray-700';
  const label = ROLE_LABEL[u.role] ?? u.role;
  const date = (u.createdAt ?? u.created_at) ? new Date((u.createdAt ?? u.created_at) as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="page-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 font-bold text-foreground/60 text-sm">
          {u.name?.charAt(0)?.toUpperCase() ?? '?'}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="font-semibold text-foreground">{u.name}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badge}`}>
              {label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{u.email}</p>
          <p className="text-xs text-muted-foreground mt-1">Registered on {date}</p>
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
          onClick={onReject}
        >
          <X className="h-3.5 w-3.5" />
          Reject
        </Button>
        <Button
          size="sm"
          className="gap-1.5 bg-green-500/15 text-green-600 border border-green-500/30 hover:bg-green-500/25"
          onClick={onApprove}
        >
          <Check className="h-3.5 w-3.5" />
          Approve
        </Button>
      </div>
    </div>
  );
}

export default function AdminApprovals() {
  const [pending, setPending] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmUser, setConfirmUser] = useState<ConfirmUserAction>(null);
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const load = () => {
    setLoading(true);
    adminApi.getPendingApprovals()
      .then(setPending)
      .catch(() => setPending([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return pending;
    return pending.filter(u => u.role === activeTab);
  }, [pending, activeTab]);

  const counts = useMemo(() => ({
    all: pending.length,
    GCC: pending.filter(u => u.role === 'GCC').length,
    STARTUP: pending.filter(u => u.role === 'STARTUP').length,
    INCUBATION: pending.filter(u => u.role === 'INCUBATION').length,
  }), [pending]);

  const handleApprove = async (userId: string) => {
    try {
      await adminApi.approve(userId);
      setPending(p => p.filter(u => u.id !== userId));
    } catch { load(); }
  };

  const handleReject = async (userId: string) => {
    try {
      await adminApi.reject(userId);
      setPending(p => p.filter(u => u.id !== userId));
    } catch { load(); }
  };

  const activeTabMeta = TABS.find(t => t.key === activeTab)!;

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pending Approvals</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Review and approve new user registrations. All users require admin approval before they can access the platform.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2 flex-shrink-0">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl mb-6 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const count = counts[tab.key];
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center ${
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? tab.color : ''}`} />
                {tab.label}
                {count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="page-card p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="page-card p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">All clear!</h2>
            <p className="text-muted-foreground text-sm">{activeTabMeta.empty}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(u => (
              <UserCard
                key={u.id}
                u={u}
                onApprove={() => setConfirmUser({ action: 'approve', user: u })}
                onReject={() => setConfirmUser({ action: 'reject', user: u })}
              />
            ))}
          </div>
        )}
      </div>

      {confirmUser && (
        <ConfirmDialog
          open
          onClose={() => setConfirmUser(null)}
          title={confirmUser.action === 'approve' ? 'Approve this user?' : 'Reject this user?'}
          message={
            confirmUser.action === 'approve'
              ? `Are you sure you want to approve ${confirmUser.user.name} (${ROLE_LABEL[confirmUser.user.role] ?? confirmUser.user.role})? They will be able to log in.`
              : `Are you sure you want to reject ${confirmUser.user.name}? They will not be able to log in.`
          }
          confirmLabel={confirmUser.action === 'approve' ? 'Yes, approve' : 'Yes, reject'}
          cancelLabel="Cancel"
          variant={confirmUser.action === 'reject' ? 'destructive' : 'default'}
          onConfirm={async () => {
            if (confirmUser.action === 'approve') await handleApprove(confirmUser.user.id);
            else await handleReject(confirmUser.user.id);
            setConfirmUser(null);
          }}
        />
      )}
    </div>
  );
}
