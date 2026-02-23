import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gccApi } from '@/lib/api';
import { Button } from '@/components/ui/button';

type Deal = {
  id: string;
  title: string;
  category: string;
  status: string;
  updated_at: string;
  accepted_count: number;
};

export default function GccDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gccApi.getActiveDeals().then(setDeals).catch(() => setDeals([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">Active Deals</h1>
        <p className="text-muted-foreground mb-6">Running projects and requirements with accepted interests.</p>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : deals.length === 0 ? (
          <div className="page-card p-8 text-center text-muted-foreground">
            No active deals yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {deals.map((d) => (
              <li key={d.id} className="page-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{d.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {d.status}
                    {d.accepted_count > 0 && ` · ${d.accepted_count} accepted`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(d.updated_at).toLocaleDateString()}</p>
                </div>
                <Link to={`/gcc/requirements/${d.id}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
