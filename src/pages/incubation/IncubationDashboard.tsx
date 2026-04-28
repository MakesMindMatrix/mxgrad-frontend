import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { incubationApi, type IncubationInterestItem, type IncubationStartupListItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Clock3, Plus, ShieldCheck, Users } from 'lucide-react';

export default function IncubationDashboard() {
  const { user } = useAuth();
  const [startups, setStartups] = useState<IncubationStartupListItem[]>([]);
  const [proposals, setProposals] = useState<IncubationInterestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([incubationApi.listStartups(), incubationApi.getInterests()])
      .then(([startupList, proposalList]) => {
        setStartups(startupList);
        setProposals(proposalList);
      })
      .catch(() => {
        setStartups([]);
        setProposals([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const approvedStartups = startups.filter((startup) => startup.approval_status === 'APPROVED').length;
  const pendingStartups = startups.filter((startup) => startup.approval_status === 'PENDING').length;
  const pendingCommunications = proposals.filter((proposal) => proposal.status === 'PENDING').length;
  const gccAccepted = proposals.filter((proposal) => proposal.gcc_response === 'ACCEPTED').length;
  const recentActivities = useMemo(() => proposals.slice(0, 5), [proposals]);
  const pendingQueue = useMemo(
    () => startups.filter((startup) => startup.approval_status === 'PENDING').slice(0, 5),
    [startups]
  );

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Incubation Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, <span className="text-foreground">{user?.name}</span>
            </p>
          </div>
          <Link to="/incubation/startups">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add startup
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="page-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">{startups.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Managed startups</p>
          </div>
          <div className="page-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">{approvedStartups}</span>
            </div>
            <p className="text-sm text-muted-foreground">Approved startups</p>
          </div>
          <div className="page-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <Clock3 className="h-8 w-8 text-amber-600" />
              <span className="text-2xl font-bold">{pendingCommunications}</span>
            </div>
            <p className="text-sm text-muted-foreground">Pending startup communications</p>
          </div>
          <div className="page-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">{gccAccepted}</span>
            </div>
            <p className="text-sm text-muted-foreground">Accepted by GCCs</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <div className="page-card p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h2 className="font-semibold">Admin approval queue</h2>
                <p className="text-sm text-muted-foreground">Managed startups waiting for admin approval.</p>
              </div>
              <span className="chip bg-amber-500/15 text-amber-700">{pendingStartups} pending</span>
            </div>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : pendingQueue.length === 0 ? (
              <p className="text-sm text-muted-foreground">No managed startups are currently waiting for approval.</p>
            ) : (
              <div className="space-y-3">
                {pendingQueue.map((startup) => (
                  <div key={startup.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{startup.company_name || startup.name}</p>
                        <p className="text-sm text-muted-foreground">{startup.email}</p>
                      </div>
                      <span className="chip bg-amber-500/15 text-amber-700">PENDING</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="page-card p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h2 className="font-semibold">Managed startup activity</h2>
                <p className="text-sm text-muted-foreground">Recent requests, communications, and proposal movement from your startups.</p>
              </div>
              <span className="chip bg-blue-500/15 text-blue-700">{proposals.length} total</span>
            </div>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : recentActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No startup communications yet. Activity will appear here when your startups respond to GCC requirements.</p>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((proposal) => (
                  <div key={proposal.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{proposal.requirement_title || 'Requirement'}</p>
                        <p className="text-sm text-muted-foreground">
                          {proposal.startup_company || proposal.startup_name || 'Managed startup'}
                        </p>
                        {proposal.message && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{proposal.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="chip chip-default">{proposal.status}</span>
                        {proposal.gcc_response === 'ACCEPTED' && (
                          <span className="chip bg-green-500/15 text-green-700">GCC accepted</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/incubation/startups" className="page-card p-6 block hover:border-blue-400 transition-colors">
            <h3 className="font-semibold mb-2">Managed startups</h3>
            <p className="text-sm text-muted-foreground mb-4">Create startup accounts, open their records, and monitor every request and approval.</p>
            <span className="text-sm text-primary flex items-center gap-1">
              Open startup manager <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link to="/incubation/explore" className="page-card p-6 block hover:border-blue-400 transition-colors">
            <h3 className="font-semibold mb-2">Explore GCC requirements</h3>
            <p className="text-sm text-muted-foreground mb-4">Submit proposals on behalf of approved startups from your center.</p>
            <span className="text-sm text-primary flex items-center gap-1">
              Browse requirements <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link to="/incubation/profile" className="page-card p-6 block hover:border-blue-400 transition-colors">
            <h3 className="font-semibold mb-2">Incubation profile</h3>
            <p className="text-sm text-muted-foreground mb-4">Keep your incubation center details and contacts current.</p>
            <span className="text-sm text-primary flex items-center gap-1">
              Update profile <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        <div className="mt-8 page-card p-6">
          <h2 className="font-semibold mb-4">Recently added startups</h2>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : startups.length === 0 ? (
            <p className="text-muted-foreground text-sm">No startups added yet. Add your first managed startup to get started.</p>
          ) : (
            <ul className="space-y-3">
              {startups.slice(0, 5).map((startup) => (
                <li key={startup.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="font-medium">{startup.company_name || startup.name}</p>
                    <p className="text-sm text-muted-foreground">{startup.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Number(startup.interest_count ?? 0)} communication{Number(startup.interest_count ?? 0) === 1 ? '' : 's'}
                    </p>
                  </div>
                  <span
                    className={
                      startup.approval_status === 'APPROVED'
                        ? 'chip bg-green-500/15 text-green-700'
                        : startup.approval_status === 'PENDING'
                          ? 'chip bg-amber-500/15 text-amber-700'
                          : 'chip bg-destructive/15 text-destructive'
                    }
                  >
                    {startup.approval_status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
