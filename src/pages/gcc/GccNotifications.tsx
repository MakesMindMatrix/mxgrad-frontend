import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gccApi } from '@/lib/api';

type Interest = {
  id: string;
  requirement_id: string;
  requirement_title: string;
  startup_name: string;
  startup_company?: string;
  interest_status: string;
  created_at: string;
};

export default function GccNotifications() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gccApi.getInterests().then(setInterests).catch(() => setInterests([])).finally(() => setLoading(false));
  }, []);

  const newCount = interests.filter((i) => i.interest_status === 'PENDING').length;

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground mb-6">
          New expressions of interest on your requirements.
          {newCount > 0 && <span className="ml-2 text-primary font-medium">{newCount} new</span>}
        </p>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : interests.length === 0 ? (
          <div className="page-card p-8 text-center text-muted-foreground">
            No notifications yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {interests.map((i) => (
              <li key={i.id} className="page-card p-4">
                <p className="text-sm text-foreground">
                  <strong>{i.startup_company || i.startup_name}</strong> expressed interest in{' '}
                  <strong>{i.requirement_title}</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(i.created_at).toLocaleString()}</p>
                <Link to={`/gcc/requirements/${i.requirement_id}`} className="text-sm text-primary hover:underline mt-2 inline-block">
                  View requirement →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
