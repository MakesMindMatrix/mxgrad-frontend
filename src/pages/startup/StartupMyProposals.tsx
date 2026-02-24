import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requirementsApi } from '@/lib/api';
import type { Requirement, ExpressionOfInterest } from '@/lib/api';
import { Button } from '@/components/ui/button';
import ExpressInterestDialog, { type ExpressInterestInitialValues } from '@/components/ExpressInterestDialog';
import { FileText, Eye, Pencil, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function StartupMyProposals() {
  const [list, setList] = useState<ExpressionOfInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editEoi, setEditEoi] = useState<ExpressionOfInterest | null>(null);
  const [editRequirement, setEditRequirement] = useState<Requirement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewEoi, setViewEoi] = useState<ExpressionOfInterest | null>(null);

  const load = () => {
    setLoading(true);
    requirementsApi.myInterests().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = async (eoi: ExpressionOfInterest) => {
    try {
      const req = await requirementsApi.get(eoi.requirement_id);
      setEditEoi(eoi);
      setEditRequirement(req);
      setDialogOpen(true);
    } catch {
      setEditEoi(null);
      setEditRequirement(null);
    }
  };

  const initialValues: ExpressInterestInitialValues | null = editEoi
    ? {
        message: editEoi.message ?? '',
        portfolio_link: editEoi.portfolio_link ?? '',
        proposed_budget: editEoi.proposed_budget ?? null,
        proposed_timeline_start: editEoi.proposed_timeline_start ?? '',
        proposed_timeline_end: editEoi.proposed_timeline_end ?? '',
      }
    : null;

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">My Proposals</h1>
        <p className="text-muted-foreground mb-6">View and modify your proposals (expressions of interest).</p>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : list.length === 0 ? (
          <div className="page-card p-8 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No proposals yet.</p>
            <div className="mt-4">
              <Link to="/startup/explore" className="text-primary hover:underline">Explore requirements</Link> to get started.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((eoi) => (
              <div key={eoi.id} className="page-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{eoi.anonymous_id || eoi.requirement_id?.slice(0, 8)}</span>
                    <span className="chip chip-default">{eoi.category || '—'}</span>
                    <span className="chip text-xs bg-muted text-muted-foreground">{eoi.status}</span>
                  </div>
                  <h3 className="font-semibold">{eoi.requirement_title || 'Requirement'}</h3>
                  {eoi.message && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{eoi.message}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    {eoi.proposed_budget != null && `$ ${eoi.proposed_budget} USD · `}
                    Submitted {eoi.created_at ? new Date(eoi.created_at).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setViewEoi(eoi)}>
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleEdit(eoi)}>
                    <Pencil className="h-4 w-4" />
                    Modify
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <ExpressInterestDialog
          requirement={editRequirement}
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditEoi(null);
              setEditRequirement(null);
              load();
            }
          }}
          initialValues={initialValues}
        />

        {/* View proposal modal (read-only) */}
        {viewEoi && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setViewEoi(null)}
            role="dialog"
            aria-modal="true"
            aria-label="View proposal"
          >
            <div
              className="bg-page border border-border rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-page">
                <h2 className="text-lg font-semibold">Proposal details</h2>
                <Button variant="ghost" size="sm" onClick={() => setViewEoi(null)} aria-label="Close">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-mono text-muted-foreground">{viewEoi.anonymous_id || viewEoi.requirement_id?.slice(0, 8)}</span>
                  <span className="chip chip-default">{viewEoi.category || '—'}</span>
                  <span className="chip text-xs bg-muted text-muted-foreground">{viewEoi.status}</span>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Requirement</div>
                  <div className="font-semibold">{viewEoi.requirement_title || '—'}</div>
                </div>
                {viewEoi.message && (
                  <div>
                    <div className="text-xs text-muted-foreground">Your message</div>
                    <p className="text-sm whitespace-pre-wrap mt-1">{viewEoi.message}</p>
                  </div>
                )}
                {(viewEoi.proposed_budget != null || viewEoi.proposed_timeline_start || viewEoi.proposed_timeline_end) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {viewEoi.proposed_budget != null && (
                      <div>
                        <div className="text-xs text-muted-foreground">Proposed budget (USD)</div>
                        <div className="font-medium">$ {viewEoi.proposed_budget}</div>
                      </div>
                    )}
                    {(viewEoi.proposed_timeline_start || viewEoi.proposed_timeline_end) && (
                      <div>
                        <div className="text-xs text-muted-foreground">Proposed timeline</div>
                        <div className="text-sm">{[viewEoi.proposed_timeline_start, viewEoi.proposed_timeline_end].filter(Boolean).join(' – ') || '—'}</div>
                      </div>
                    )}
                  </div>
                )}
                {viewEoi.portfolio_link && (
                  <div>
                    <div className="text-xs text-muted-foreground">Portfolio link</div>
                    <a href={viewEoi.portfolio_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">{viewEoi.portfolio_link}</a>
                  </div>
                )}
                {viewEoi.attachment_path && (
                  <div>
                    <div className="text-xs text-muted-foreground">Attachment</div>
                    <a href={`${API_BASE}/uploads/${viewEoi.attachment_path}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      {viewEoi.attachment_original_name || 'Download attachment'}
                    </a>
                  </div>
                )}
                <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                  Submitted {viewEoi.created_at ? new Date(viewEoi.created_at).toLocaleString() : '—'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
