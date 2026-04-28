import { useEffect, useState } from 'react';
import { adminApi, type AdminActivityInterest, type AdminActivityRequirement } from '@/lib/api';
import { Calendar, FileText, Send } from 'lucide-react';

export default function AdminActivities() {
  const [data, setData] = useState<{ requirements: AdminActivityRequirement[]; expressionsOfInterest: AdminActivityInterest[] } | null>(null);
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
          Recent requirements posted by GCCs and expressions of interest from startups, including those managed by incubation centers.
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
              data.requirements.map((requirement) => (
                <div key={requirement.id} className="page-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{requirement.title}</p>
                      <p className="text-sm text-muted-foreground">
                        by {requirement.gcc_name} ({requirement.gcc_email})
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="chip chip-default">{requirement.category}</span>
                        <span className="chip chip-default">{requirement.status}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(requirement.created_at).toLocaleString()}
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
              data.expressionsOfInterest.map((interest) => (
                <div key={interest.id} className="page-card p-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">Re: {interest.requirement_title}</p>
                      {interest.managed_by_name && (
                        <span className="chip bg-amber-500/15 text-amber-700">Incubation tagged</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      by {interest.startup_name} ({interest.startup_email})
                    </p>
                    {interest.managed_by_name && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Submitted through <span className="text-foreground font-medium">{interest.managed_by_name}</span>
                        {interest.managed_by_email ? <> ({interest.managed_by_email})</> : null}
                      </p>
                    )}
                    {interest.message && <p className="text-sm mt-2 line-clamp-2">{interest.message}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="chip chip-default">{interest.status}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(interest.created_at).toLocaleString()}
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
