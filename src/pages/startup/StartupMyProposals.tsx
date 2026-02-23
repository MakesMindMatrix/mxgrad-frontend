import { Link } from 'react-router-dom';

export default function StartupMyProposals() {
  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">My Proposals</h1>
        <p className="text-muted-foreground mb-6">View and manage your proposals.</p>

        <div className="page-card p-8 text-center text-muted-foreground">
          No proposals yet.
          <div className="mt-4">
            <Link to="/startup/explore" className="text-primary hover:underline">Explore requirements</Link> to get started.
          </div>
        </div>
      </div>
    </div>
  );
}
