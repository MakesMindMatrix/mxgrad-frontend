import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requirementsApi, type ExpressionOfInterest } from '@/lib/api';

export default function StartupNotifications() {
  const [interests, setInterests] = useState<ExpressionOfInterest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requirementsApi.myInterests().then(setInterests).catch(() => setInterests([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground mb-6">Your expressions of interest and related updates.</p>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : interests.length === 0 ? (
          <div className="page-card p-8 text-center text-muted-foreground">
            No notifications yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {interests.map((i, idx) => (
              <li key={i.id ?? idx} className="page-card p-4">
                <p className="font-medium text-foreground">Expression of interest: {i.requirement_title ?? 'Requirement'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {i.created_at ? new Date(i.created_at).toLocaleString() : ''}
                </p>
                <Link to="/startup/explore" className="text-sm text-primary hover:underline mt-2 inline-block">View requirements →</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
