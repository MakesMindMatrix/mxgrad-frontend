import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { Link } from 'react-router-dom';
import { FolderKanban, User, Calendar, MessageCircle } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
  gcc_name: string;
  gcc_email: string;
  interest_count: string | number;
}

export default function AdminActiveProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminApi.getActiveProjects().then((r) => setProjects(r as Project[])).catch(() => setProjects([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">Active Projects</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Requirements that are open or in progress, with interest counts from startups.
        </p>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : projects.length === 0 ? (
          <div className="page-card p-12 text-center text-muted-foreground">
            No active projects.
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="page-card p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <User className="h-3.5 w-3.5" />
                      {p.gcc_name} ({p.gcc_email})
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="chip chip-default">{p.category}</span>
                      <span className="chip chip-default">{p.status}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {Number(p.interest_count) || 0} interest(s)
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Updated {new Date(p.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Link to="/admin/explore" className="text-sm text-primary hover:underline shrink-0">
                    View on Explore →
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
