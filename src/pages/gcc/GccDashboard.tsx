import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { gccApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { FileText, Plus, ArrowRight } from 'lucide-react';

export default function GccDashboard() {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<{ id: string; title: string; interest_count?: number | string }[]>([]);

  useEffect(() => {
    gccApi.getRequirements().then(setRequirements).catch(() => setRequirements([]));
  }, []);

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">GCC Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, <span className="text-foreground">{user?.name}</span>
            </p>
          </div>
          <Link to="/gcc/requirements/new">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Post requirement
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/gcc/profile" className="page-card p-6 block hover:border-blue-400 transition-colors">
            <h3 className="font-semibold mb-2">Your profile</h3>
            <p className="text-sm text-muted-foreground mb-4">Edit company and contact details</p>
            <span className="text-sm text-primary flex items-center gap-1">
              Edit profile <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link to="/gcc/explore" className="page-card p-6 block hover:border-blue-400 transition-colors">
            <h3 className="font-semibold mb-2">Explore</h3>
            <p className="text-sm text-muted-foreground mb-4">Search for startups to partner with</p>
            <span className="text-sm text-primary flex items-center gap-1">
              Explore <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        <div className="mt-8 page-card p-6">
          <h2 className="font-semibold mb-4">Recent requirements</h2>
          {requirements.length === 0 ? (
            <p className="text-muted-foreground text-sm">No requirements yet. Post your first tech need.</p>
          ) : (
            <ul className="space-y-3">
              {requirements.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{r.title}</span>
                    {typeof r.interest_count === 'number' && r.interest_count > 0 && (
                      <span className="text-xs text-muted-foreground">({r.interest_count} interests)</span>
                    )}
                  </div>
                  <Link to={`/gcc/requirements/${r.id}`}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
