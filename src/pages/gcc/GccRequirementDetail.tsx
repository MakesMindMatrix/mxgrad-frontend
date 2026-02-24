import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { gccApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface RequirementWithApps {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  approval_status?: string;
  admin_remarks?: string | null;
  admin_remarks_at?: string | null;
  applications?: { startup_name: string; startup_email: string; message?: string; status: string; created_at: string }[];
}

export default function GccRequirementDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [req, setReq] = useState<RequirementWithApps | null>(null);
  const successMessage = location.state && typeof location.state === 'object' && 'message' in location.state ? (location.state as { message?: string }).message : undefined;

  useEffect(() => {
    if (!id) return;
    gccApi.getRequirement(id).then(setReq).catch(() => setReq(null));
  }, [id]);

  if (!req) return <div className="min-h-screen pt-6 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/gcc/requirements" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to requirements
        </Link>
        {successMessage && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-300 p-4 mb-6">
            {successMessage}
          </div>
        )}
        <div className="page-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">{req.anonymous_id || req.id.slice(0, 8)}</span>
            <span className="chip chip-default">{req.category}</span>
            <span className="text-sm text-muted-foreground">{req.status}</span>
            {req.approval_status && req.approval_status !== 'APPROVED' && (
              <span
                className={
                  req.approval_status === 'PENDING_APPROVAL'
                    ? 'chip bg-amber-500/20 text-amber-700'
                    : req.approval_status === 'SENT_BACK'
                      ? 'chip bg-blue-500/20 text-blue-700'
                      : 'chip bg-destructive/20 text-destructive'
                }
              >
                {req.approval_status === 'PENDING_APPROVAL'
                  ? 'Pending approval'
                  : req.approval_status === 'SENT_BACK'
                    ? 'Sent back'
                    : 'Rejected'}
              </span>
            )}
          </div>
          {(req.approval_status === 'SENT_BACK' || req.approval_status === 'REJECTED') && req.admin_remarks && (
            <div className="rounded-lg bg-muted/50 border border-border p-4 mb-4">
              <p className="text-sm font-medium text-foreground mb-1">Admin remarks</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{req.admin_remarks}</p>
              {req.admin_remarks_at && (
                <p className="text-xs text-muted-foreground mt-2">{new Date(req.admin_remarks_at).toLocaleString()}</p>
              )}
            </div>
          )}
          {req.approval_status === 'SENT_BACK' && (
            <Link to={`/gcc/requirements/${req.id}/edit`} className="inline-block mb-4">
              <Button variant="outline" size="sm">Edit and resubmit for approval</Button>
            </Link>
          )}
          <h1 className="text-2xl font-bold">{req.title}</h1>
          <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{req.description}</p>
        </div>

        <h2 className="font-semibold mb-4">Applications / Expressions of interest</h2>
        {req.applications && req.applications.length > 0 ? (
          <div className="space-y-4">
            {req.applications.map((app: { startup_name: string; startup_email: string; message?: string; status: string; created_at: string; attachment_path?: string; attachment_original_name?: string }, i: number) => (
              <div key={i} className="page-card p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{app.startup_name}</p>
                    <p className="text-sm text-muted-foreground">{app.startup_email}</p>
                    {app.message && <p className="text-sm mt-2">{app.message}</p>}
                    {app.attachment_path && (
                      <a
                        href={`${import.meta.env.VITE_API_URL || '/api'}/uploads/${app.attachment_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline mt-2 inline-block"
                      >
                        📎 {app.attachment_original_name || 'Download attachment'}
                      </a>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">{new Date(app.created_at).toLocaleString()}</p>
                  </div>
                  <span className="chip chip-default">{app.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No applications yet.</p>
        )}
      </div>
    </div>
  );
}
