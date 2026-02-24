import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gccApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type Interest = {
  id: string;
  requirement_id: string;
  requirement_title: string;
  startup_name: string;
  startup_company?: string;
  interest_status: string;
  created_at: string;
};

type RequirementWithApps = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  approval_status?: string;
  admin_remarks?: string | null;
  admin_remarks_at?: string | null;
  anonymous_id?: string;
  applications?: {
    startup_name: string;
    startup_email: string;
    message?: string;
    status: string;
    created_at: string;
    attachment_path?: string;
    attachment_original_name?: string;
  }[];
};

export default function GccInterestDetail() {
  const { id } = useParams<{ id: string }>();
  const [interest, setInterest] = useState<Interest | null>(null);
  const [requirement, setRequirement] = useState<RequirementWithApps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      try {
        const all = await gccApi.getInterests();
        const found = all.find((item: Interest) => item.id === id) || null;
        if (!found) {
          if (!cancelled) {
            setError('Proposal not found');
          }
          return;
        }
        if (!cancelled) {
          setInterest(found);
        }
        const req = await gccApi.getRequirement(found.requirement_id);
        if (!cancelled) {
          setRequirement(req as RequirementWithApps);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load proposal');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-6 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-muted-foreground">Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (error || !interest || !requirement) {
    return (
      <div className="min-h-screen pt-6 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            to="/gcc/interests"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to received interests
          </Link>
          <p className="text-destructive">{error || 'Unable to load proposal details.'}</p>
        </div>
      </div>
    );
  }

  const proposal =
    requirement.applications?.find((app) => app.startup_name === interest.startup_name) ||
    requirement.applications?.[0];

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <Link
          to="/gcc/interests"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to received interests
        </Link>

        <div className="page-card p-6">
          <h1 className="text-2xl font-bold mb-1">
            Proposal from {interest.startup_company || interest.startup_name}
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            For requirement: <span className="font-medium">{interest.requirement_title}</span>
          </p>

          {proposal ? (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Startup contact:</span>{' '}
                <span>{proposal.startup_name}</span>
              </p>
              <p className="text-sm text-muted-foreground">{proposal.startup_email}</p>
              {proposal.message && (
                <p className="text-sm mt-3 whitespace-pre-wrap">
                  <span className="font-medium">Proposal message:</span>
                  {'\n'}
                  {proposal.message}
                </p>
              )}
              {proposal.attachment_path && (
                <a
                  href={`${import.meta.env.VITE_API_URL || '/api'}/uploads/${proposal.attachment_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-3 inline-block"
                >
                  📎 {proposal.attachment_original_name || 'Download attached document'}
                </a>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Status: {proposal.status} · Submitted {new Date(proposal.created_at).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Proposal details are not available, but the related requirement is shown below.
            </p>
          )}
        </div>

        <div className="page-card p-6">
          <p className="text-xs font-mono text-muted-foreground mb-1">
            {requirement.anonymous_id || requirement.id.slice(0, 8)}
          </p>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="chip chip-default">{requirement.category}</span>
            <span className="text-sm text-muted-foreground">{requirement.status}</span>
            {requirement.approval_status && requirement.approval_status !== 'APPROVED' && (
              <span
                className={
                  requirement.approval_status === 'PENDING_APPROVAL'
                    ? 'chip bg-amber-500/20 text-amber-700'
                    : requirement.approval_status === 'SENT_BACK'
                      ? 'chip bg-blue-500/20 text-blue-700'
                      : 'chip bg-destructive/20 text-destructive'
                }
              >
                {requirement.approval_status === 'PENDING_APPROVAL'
                  ? 'Pending approval'
                  : requirement.approval_status === 'SENT_BACK'
                    ? 'Sent back'
                    : 'Rejected'}
              </span>
            )}
          </div>
          <h2 className="text-xl font-semibold">{requirement.title}</h2>
          <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{requirement.description}</p>
          <div className="mt-4">
            <Button asChild variant="outline" size="sm">
              <Link to={`/gcc/requirements/${requirement.id}`}>Open full requirement</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

