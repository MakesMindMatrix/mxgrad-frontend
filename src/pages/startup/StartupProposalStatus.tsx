import { Link } from 'react-router-dom';

export default function StartupProposalStatus() {
  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">Proposal Status</h1>
        <p className="text-muted-foreground mb-6">Track the status of your proposals.</p>

        <div className="page-card p-8 text-center text-muted-foreground">
          No proposal status to show yet.
          <div className="mt-4">
            <Link to="/startup/proposals" className="text-primary hover:underline">My Proposals</Link>
            {' · '}
            <Link to="/startup/explore" className="text-primary hover:underline">Explore</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
