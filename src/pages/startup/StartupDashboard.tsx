import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { requirementsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { FileText, User, Send } from 'lucide-react';

export default function StartupDashboard() {
  const { user } = useAuth();
  const [interests, setInterests] = useState<{ id: string; requirement_title?: string; status: string }[]>([]);

  useEffect(() => {
    requirementsApi.myInterests().then(setInterests).catch(() => setInterests([]));
  }, []);

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Startup Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, <span className="text-foreground">{user?.name}</span>
            </p>
          </div>
          <Link to="/startup/explore">
            <Button size="sm" className="gap-2">
              <Send className="h-4 w-4" />
              Browse requirements
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link to="/startup/profile" className="page-card p-6 block hover:border-blue-400 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Your profile</h3>
            </div>
            <p className="text-sm text-muted-foreground">Complete your tabbed startup profile</p>
          </Link>
          <Link to="/startup/explore" className="page-card p-6 block hover:border-blue-400 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Explore requirements</h3>
            </div>
            <p className="text-sm text-muted-foreground">Find GCC tech needs and express interest</p>
          </Link>
        </div>

        <div className="mt-8 page-card p-6">
          <h2 className="font-semibold mb-4">Your expressions of interest</h2>
          {interests.length === 0 ? (
            <p className="text-muted-foreground text-sm">None yet. Browse requirements and express interest.</p>
          ) : (
            <ul className="space-y-3">
              {interests.map((i) => (
                <li key={i.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span>{i.requirement_title || 'Requirement'}</span>
                  <span className="chip chip-default">{i.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
