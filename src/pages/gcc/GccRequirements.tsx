import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gccApi } from '@/lib/api';
import type { Requirement, RequirementApprovalStatus } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';

function ApprovalBadge({ status }: { status?: RequirementApprovalStatus | string }) {
  if (!status || status === 'APPROVED') return null;
  const label =
    status === 'PENDING_APPROVAL'
      ? 'Pending approval'
      : status === 'SENT_BACK'
        ? 'Sent back'
        : status === 'REJECTED'
          ? 'Rejected'
          : status;
  const className =
    status === 'PENDING_APPROVAL'
      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
      : status === 'SENT_BACK'
        ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
        : 'bg-destructive/20 text-destructive';
  return <span className={`chip text-xs ${className}`}>{label}</span>;
}

export default function GccRequirements() {
  const [list, setList] = useState<Requirement[]>([]);

  useEffect(() => {
    gccApi.getRequirements().then(setList).catch(() => setList([]));
  }, []);

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Tech requirements</h1>
          <Link to="/gcc/requirements/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New requirement
            </Button>
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="page-card p-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No requirements yet. Post your first tech need from deep-tech startups.</p>
            <Link to="/gcc/requirements/new" className="mt-4 inline-block">
              <Button>Post requirement</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((r) => (
              <div key={r.id} className="page-card p-6 flex items-center justify-between hover:border-blue-400 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs text-muted-foreground font-mono">{r.anonymous_id || r.id.slice(0, 8)}</span>
                    <span className="chip chip-default">{r.category}</span>
                    <ApprovalBadge status={r.approval_status} />
                  </div>
                  <h3 className="font-semibold">{r.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{r.description}</p>
                  {(r.approval_status === 'SENT_BACK' || r.approval_status === 'REJECTED') && r.admin_remarks && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">Admin: {r.admin_remarks}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {Number(r.interest_count) || 0} interest(s) · {r.status}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <Link to={`/gcc/requirements/${r.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                  <Link to={`/gcc/requirements/${r.id}/edit`}>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
