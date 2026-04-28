import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { incubationApi, type IncubationInterestItem } from '@/lib/api';

export default function IncubationNotifications() {
  const [interests, setInterests] = useState<IncubationInterestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    incubationApi.getInterests().then(setInterests).catch(() => setInterests([])).finally(() => setLoading(false));
  }, []);

  const acceptedCount = interests.filter((interest) => interest.gcc_response === 'ACCEPTED').length;

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground mb-6">
          Updates on proposals submitted by your incubation center.
          {acceptedCount > 0 && <span className="ml-2 text-primary font-medium">{acceptedCount} accepted by GCCs</span>}
        </p>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : interests.length === 0 ? (
          <div className="page-card p-8 text-center text-muted-foreground">
            No notifications yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {interests.map((interest) => (
              <li key={interest.id} className="page-card p-4">
                <p className="text-sm text-foreground">
                  <strong>{interest.startup_company || interest.startup_name}</strong> submitted a proposal for{' '}
                  <strong>{interest.requirement_title || 'Requirement'}</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {interest.created_at ? new Date(interest.created_at).toLocaleString() : ''}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Status: {interest.status}
                  {interest.gcc_response === 'ACCEPTED' ? ' | GCC accepted' : ''}
                </p>
                <Link to="/incubation/proposals" className="text-sm text-primary hover:underline mt-2 inline-block">
                  View proposals
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
