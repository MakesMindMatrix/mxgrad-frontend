import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  incubationApi,
  requirementsApi,
  type ExpressionOfInterest,
  type IncubationInterestItem,
  type IncubationStartupListItem,
  type Requirement,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import ExpressInterestDialog, { type ExpressInterestInitialValues } from '@/components/ExpressInterestDialog';
import { Eye, FileText, Pencil, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function IncubationProposals() {
  const [list, setList] = useState<IncubationInterestItem[]>([]);
  const [approvedStartups, setApprovedStartups] = useState<IncubationStartupListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editEoi, setEditEoi] = useState<IncubationInterestItem | null>(null);
  const [editRequirement, setEditRequirement] = useState<Requirement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewEoi, setViewEoi] = useState<IncubationInterestItem | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      incubationApi.getInterests(),
      incubationApi.listStartups({ approval_status: 'APPROVED' }),
    ])
      .then(([proposalList, startupList]) => {
        setList(proposalList);
        setApprovedStartups(startupList);
      })
      .catch(() => {
        setList([]);
        setApprovedStartups([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = async (eoi: IncubationInterestItem) => {
    try {
      const requirement = await requirementsApi.get(eoi.requirement_id);
      setEditEoi(eoi);
      setEditRequirement(requirement);
      setDialogOpen(true);
    } catch {
      setEditEoi(null);
      setEditRequirement(null);
    }
  };

  const initialValues: ExpressInterestInitialValues | null = useMemo(() => (
    editEoi
      ? {
          message: editEoi.message ?? '',
          portfolio_link: editEoi.portfolio_link ?? '',
          proposed_budget: editEoi.proposed_budget ?? null,
          proposed_timeline_start: editEoi.proposed_timeline_start ?? '',
          proposed_timeline_end: editEoi.proposed_timeline_end ?? '',
        }
      : null
  ), [editEoi]);

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">Startup Proposals</h1>
        <p className="text-muted-foreground mb-6">Track proposals submitted by your incubation center on behalf of managed startups.</p>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : list.length === 0 ? (
          <div className="page-card p-8 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No proposals submitted yet.</p>
            <div className="mt-4">
              <Link to="/incubation/explore" className="text-primary hover:underline">Explore GCC requirements</Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((eoi) => (
              <div key={eoi.id} className="page-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-mono text-muted-foreground">{eoi.anonymous_id || eoi.requirement_id?.slice(0, 8)}</span>
                    <span className="chip chip-default">{eoi.category || '-'}</span>
                    <span className="chip text-xs bg-muted text-muted-foreground">{eoi.status}</span>
                    {eoi.gcc_response === 'ACCEPTED' && (
                      <span className="chip bg-green-500/15 text-green-700">GCC accepted</span>
                    )}
                  </div>
                  <h3 className="font-semibold">{eoi.requirement_title || 'Requirement'}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Submitted for <span className="text-foreground">{eoi.startup_company || eoi.startup_name}</span>
                  </p>
                  {eoi.message && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{eoi.message}</p>}
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
          startupOptions={approvedStartups}
          initialStartupUserId={editEoi?.startup_user_id ?? null}
        />

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
              onClick={(event) => event.stopPropagation()}
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
                  <span className="chip chip-default">{viewEoi.category || '-'}</span>
                  <span className="chip text-xs bg-muted text-muted-foreground">{viewEoi.status}</span>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Startup</div>
                  <div className="font-semibold">{viewEoi.startup_company || viewEoi.startup_name || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Requirement</div>
                  <div className="font-semibold">{viewEoi.requirement_title || '-'}</div>
                </div>
                {viewEoi.message && (
                  <div>
                    <div className="text-xs text-muted-foreground">Proposal message</div>
                    <p className="text-sm whitespace-pre-wrap mt-1">{viewEoi.message}</p>
                  </div>
                )}
                {viewEoi.portfolio_link && (
                  <div>
                    <div className="text-xs text-muted-foreground">Portfolio link</div>
                    <a href={viewEoi.portfolio_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                      {viewEoi.portfolio_link}
                    </a>
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
                  Submitted {viewEoi.created_at ? new Date(viewEoi.created_at).toLocaleString() : '-'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
