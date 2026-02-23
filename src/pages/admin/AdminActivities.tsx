import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { FileText, Send, Calendar } from 'lucide-react';

interface ActivityReq {
  id: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
  gcc_name: string;
  gcc_email: string;
}

interface ActivityEoi {
  id: string;
  message: string;
  status: string;
  created_at: string;
  requirement_title: string;
  startup_name: string;
  startup_email: string;
}

export default function AdminActivities() {
  const [data, setData] = useState<{ requirements: ActivityReq[]; expressionsOfInterest: ActivityEoi[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'requirements' | 'interests'>('requirements');

  useEffect(() => {
    setLoading(true);
    adminApi.getActivities().then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen pt-6 pb-16 flex items-center justify-center">Loading...</div>;
  if (!data) return <div className="min-h-screen pt-6 pb-16">Failed to load activities.</div>;

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">User Activities</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Recent requirements posted by GCCs and expressions of interest from startups.
        </p>

        <div className="flex gap-2 mb-6 border-b border-border pb-2">
          <button
            type="button"
            onClick={() => setTab('requirements')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              tab === 'requirements' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <FileText className="h-4 w-4" />
            Requirements posted ({data.requirements.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('interests')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              tab === 'interests' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Send className="h-4 w-4" />
            Expressions of interest ({data.expressionsOfInterest.length})
          </button>
        </div>

        {tab === 'requirements' && (
          <div className="space-y-3">
            {data.requirements.length === 0 ? (
              <p className="text-muted-foreground">No requirements posted yet.</p>
            ) : (
              data.requirements.map((r) => (
                <div key={r.id} className="page-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{r.title}</p>
                      <p className="text-sm text-muted-foreground">
                        by {r.gcc_name} ({r.gcc_email})
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="chip chip-default">{r.category}</span>
                        <span className="chip chip-default">{r.status}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(r.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'interests' && (
          <div className="space-y-3">
            {data.expressionsOfInterest.length === 0 ? (
              <p className="text-muted-foreground">No expressions of interest yet.</p>
            ) : (
              data.expressionsOfInterest.map((e) => (
                <div key={e.id} className="page-card p-4">
                  <div>
                    <p className="font-medium">Re: {e.requirement_title}</p>
                    <p className="text-sm text-muted-foreground">
                      by {e.startup_name} ({e.startup_email})
                    </p>
                    {e.message && <p className="text-sm mt-2 line-clamp-2">{e.message}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="chip chip-default">{e.status}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(e.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
