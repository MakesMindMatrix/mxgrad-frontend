import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import type { EoiApprovalItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Check, X, Trash2, RefreshCw, Calendar } from 'lucide-react';

type ConfirmAction = { type: 'approve' | 'reject' | 'delete'; eoi: EoiApprovalItem } | null;

export default function AdminEoiApprovals() {
  const [list, setList] = useState<EoiApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<ConfirmAction>(null);

  const load = () => {
    setLoading(true);
    adminApi.getEoiApprovals().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (eoiId: string) => {
    await adminApi.approveEoi(eoiId);
    setList((prev) => prev.map((e) => (e.id === eoiId ? { ...e, status: 'ACCEPTED' } : e)));
  };

  const handleReject = async (eoiId: string) => {
    await adminApi.rejectEoi(eoiId);
    setList((prev) => prev.map((e) => (e.id === eoiId ? { ...e, status: 'REJECTED' } : e)));
  };

  const handleDelete = async (eoiId: string) => {
    await adminApi.deleteEoi(eoiId);
    setList((prev) => prev.filter((e) => e.id !== eoiId));
  };

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Expression of interest approvals</h1>
          <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        <p className="text-muted-foreground mb-6">
          All expressions of interest from startups. Approve to accept, reject to decline, or delete to remove.
        </p>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : list.length === 0 ? (
          <div className="page-card p-12 text-center text-muted-foreground">
            <p>No expressions of interest yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((e) => (
              <div key={e.id} className="page-card p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">Re: {e.requirement_title}</p>
                      <p className="text-sm text-muted-foreground">
                        by {e.startup_name} ({e.startup_email})
                      </p>
                      {e.message && <p className="text-sm mt-2 whitespace-pre-wrap line-clamp-4">{e.message}</p>}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="chip chip-default">{e.status}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(e.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {e.status === 'PENDING' && (
                      <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                        <Button
                          size="sm"
                          className="gap-1 text-green-600 bg-green-500/20 hover:bg-green-500/30"
                          onClick={() => setConfirm({ type: 'approve', eoi: e })}
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-destructive"
                          onClick={() => setConfirm({ type: 'reject', eoi: e })}
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-destructive"
                          onClick={() => setConfirm({ type: 'delete', eoi: e })}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirm && (
        <ConfirmDialog
          open
          onClose={() => setConfirm(null)}
          title={
            confirm.type === 'approve'
              ? 'Approve expression of interest?'
              : confirm.type === 'reject'
                ? 'Reject expression of interest?'
                : 'Delete expression of interest?'
          }
          message={
            confirm.type === 'approve'
              ? 'Are you sure you want to approve this expression of interest?'
              : confirm.type === 'reject'
                ? 'Are you sure you want to reject this expression of interest?'
                : 'Are you sure? This action cannot be undone.'
          }
          confirmLabel={
            confirm.type === 'approve' ? 'Yes, approve' : confirm.type === 'reject' ? 'Yes, reject' : 'Yes, delete'
          }
          cancelLabel="No"
          variant={confirm.type === 'delete' || confirm.type === 'reject' ? 'destructive' : 'default'}
          onConfirm={() =>
            confirm.type === 'approve'
              ? handleApprove(confirm.eoi.id)
              : confirm.type === 'reject'
                ? handleReject(confirm.eoi.id)
                : handleDelete(confirm.eoi.id)
          }
        />
      )}
    </div>
  );
}
