import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  applications?: { startup_name: string; startup_email: string; message?: string; status: string; created_at: string }[];
}

export default function GccRequirementDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [req, setReq] = useState<RequirementWithApps | null>(null);

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
        <div className="page-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-muted-foreground">{req.anonymous_id || req.id.slice(0, 8)}</span>
            <span className="chip chip-default">{req.category}</span>
            <span className="text-sm text-muted-foreground">{req.status}</span>
          </div>
          <h1 className="text-2xl font-bold">{req.title}</h1>
          <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{req.description}</p>
        </div>

        <h2 className="font-semibold mb-4">Applications / Expressions of interest</h2>
        {req.applications && req.applications.length > 0 ? (
          <div className="space-y-4">
            {req.applications.map((app: { startup_name: string; startup_email: string; message?: string; status: string; created_at: string }, i: number) => (
              <div key={i} className="page-card p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{app.startup_name}</p>
                    <p className="text-sm text-muted-foreground">{app.startup_email}</p>
                    {app.message && <p className="text-sm mt-2">{app.message}</p>}
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
