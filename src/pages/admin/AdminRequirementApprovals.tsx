import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import type { RequirementApprovalItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Check, X, MessageSquareReply, RefreshCw } from 'lucide-react';

export default function AdminRequirementApprovals() {
  const [list, setList] = useState<RequirementApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [remarksModal, setRemarksModal] = useState<'send-back' | 'reject' | null>(null);
  const [remarksReqId, setRemarksReqId] = useState<string | null>(null);
  const [remarksText, setRemarksText] = useState('');
  const [confirmApproveId, setConfirmApproveId] = useState<string | null>(null);
  const [confirmRemarksSubmit, setConfirmRemarksSubmit] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.getPendingRequirementApprovals().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (requirementId: string) => {
    setActionId(requirementId);
    try {
      await adminApi.approveRequirement(requirementId);
      setList((prev) => prev.filter((r) => r.id !== requirementId));
    } finally {
      setActionId(null);
    }
  };

  const openRemarks = (reqId: string, action: 'send-back' | 'reject') => {
    setRemarksReqId(reqId);
    setRemarksModal(action);
    setRemarksText('');
  };

  const submitRemarks = async () => {
    if (!remarksReqId || !remarksModal) return;
    setActionId(remarksReqId);
    try {
      if (remarksModal === 'send-back') {
        await adminApi.sendBackRequirement(remarksReqId, remarksText);
      } else {
        await adminApi.rejectRequirement(remarksReqId, remarksText);
      }
      setList((prev) => prev.filter((r) => r.id !== remarksReqId));
      setRemarksModal(null);
      setRemarksReqId(null);
      setRemarksText('');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Requirement approvals</h1>
          <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        <p className="text-muted-foreground mb-6">
          GCC-posted requirements are listed here. Approve to make them visible to startups; send back with remarks for the GCC to revise; or reject with remarks.
        </p>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : list.length === 0 ? (
          <div className="page-card p-12 text-center text-muted-foreground">
            <Check className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-70" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No pending requirement approvals</h2>
            <p>All submitted requirements have been processed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((r) => (
              <div key={r.id} className="page-card p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="chip chip-default">{r.category}</span>
                        <span className="text-xs text-muted-foreground">by {r.gcc_name}</span>
                        <span className="text-xs text-muted-foreground">{r.gcc_email}</span>
                      </div>
                      <h3 className="font-semibold text-lg">{r.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap line-clamp-4">{r.description}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="gap-1 text-green-600 bg-green-500/20 hover:bg-green-500/30"
                        onClick={() => setConfirmApproveId(r.id)}
                        disabled={actionId !== null}
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => openRemarks(r.id, 'send-back')}
                        disabled={actionId !== null}
                      >
                        <MessageSquareReply className="h-4 w-4" />
                        Send back
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-destructive"
                        onClick={() => openRemarks(r.id, 'reject')}
                        disabled={actionId !== null}
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {remarksModal && remarksReqId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-background border border-border rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="font-semibold mb-2">
                {remarksModal === 'send-back' ? 'Send back to GCC with remarks' : 'Reject with remarks'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {remarksModal === 'send-back'
                  ? 'The GCC will see these remarks and can edit and resubmit the requirement.'
                  : 'The GCC will see these remarks. The requirement will remain rejected.'}
              </p>
              <textarea
                className="w-full min-h-[120px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter remarks..."
                value={remarksText}
                onChange={(e) => setRemarksText(e.target.value)}
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={() => setConfirmRemarksSubmit(true)} disabled={actionId !== null}>
                  {remarksModal === 'send-back' ? 'Send back' : 'Reject'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRemarksModal(null);
                    setRemarksReqId(null);
                    setRemarksText('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {confirmApproveId && (
          <ConfirmDialog
            open
            onClose={() => setConfirmApproveId(null)}
            title="Approve requirement?"
            message="Are you sure you want to approve this requirement? It will become visible to startups."
            confirmLabel="Yes, approve"
            cancelLabel="No"
            onConfirm={async () => {
              await handleApprove(confirmApproveId);
              setConfirmApproveId(null);
            }}
          />
        )}

        {confirmRemarksSubmit && remarksModal && (
          <ConfirmDialog
            open
            onClose={() => setConfirmRemarksSubmit(false)}
            title={remarksModal === 'send-back' ? 'Send back with remarks?' : 'Reject with remarks?'}
            message={
              remarksModal === 'send-back'
                ? 'Are you sure you want to send this requirement back to the GCC with your remarks?'
                : 'Are you sure you want to reject this requirement? The GCC will see your remarks.'
            }
            confirmLabel={remarksModal === 'send-back' ? 'Yes, send back' : 'Yes, reject'}
            cancelLabel="No"
            variant="destructive"
            onConfirm={async () => {
              await submitRemarks();
              setConfirmRemarksSubmit(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
