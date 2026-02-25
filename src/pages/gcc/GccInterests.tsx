import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gccApi } from '@/lib/api';
import { Button } from '@/components/ui/button';

type Interest = {
  id: string;
  requirement_id: string;
  requirement_title: string;
  startup_name: string;
  startup_company?: string;
  interest_status: string;
  gcc_response?: string | null;
  created_at: string;
};

export default function GccInterests() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gccApi.getInterests().then(setInterests).catch(() => setInterests([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">Received Interests</h1>
        <p className="text-muted-foreground mb-6">Company name and requirement title for each expression of interest.</p>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : interests.length === 0 ? (
          <div className="page-card p-8 text-center text-muted-foreground">
            No interests received yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {interests.map((i) => (
              <li key={i.id} className="page-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{i.startup_company || i.startup_name}</p>
                  <p className="text-sm text-muted-foreground">{i.requirement_title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {i.gcc_response === 'ACCEPTED' ? 'Accepted by you' : 'Pending your response'} · {new Date(i.created_at).toLocaleString()}
                  </p>
                </div>
                <Link to={`/gcc/interests/${i.id}`}>
                  <Button variant="outline" size="sm">View proposal</Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
