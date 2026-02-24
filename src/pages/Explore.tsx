import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requirementsApi, adminApi } from '@/lib/api';
import type { Requirement } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import RequirementCard from '@/components/RequirementCard';
import ExpressInterestDialog from '@/components/ExpressInterestDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const CATEGORIES = ['All', 'AI', 'DevOps', 'Cloud', 'Data', 'Security', 'Blockchain', 'IoT'];

export default function Explore() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isAdminView = user?.role === 'ADMIN';

  // Logged-in GCC/Startup should use their role-specific explore pages
  useEffect(() => {
    if (user?.role === 'GCC') {
      navigate('/gcc/explore', { replace: true });
      return;
    }
    if (user?.role === 'STARTUP') {
      navigate('/startup/explore', { replace: true });
      return;
    }
  }, [user?.role, navigate]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Requirement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 280);
    return () => clearTimeout(t);
  }, [searchInput]);
  useEffect(() => {
    const params: { category?: string; search?: string } = {};
    if (category && category !== 'All') params.category = category;
    if (search.trim()) params.search = search.trim();
    setLoading(true);
    const fetchList = isAdminView
      ? () => adminApi.getExploreRequirements(params)
      : () => requirementsApi.list(params);
    fetchList()
      .then(setRequirements)
      .catch(() => setRequirements([]))
      .finally(() => setLoading(false));
  }, [category, search, isAdminView]);

  const handleExpressInterest = (req: Requirement) => {
    setSelected(req);
    setDialogOpen(true);
  };

  // While redirecting (GCC/Startup), show nothing or a loader
  if (user?.role === 'GCC' || user?.role === 'STARTUP') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore</h1>
          <p className="text-muted-foreground">
            {isAdminView
              ? 'Browse tech requirements from GCCs. Status and interest counts are shown.'
              : 'Browse tech requirements from GCCs. Log in as a startup to express interest.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              autoComplete="off"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Button
                key={c}
                variant={category === c ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground py-8">Loading requirements...</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requirements.map((r) => (
                <RequirementCard
                  key={r.id}
                  requirement={r}
                  onExpressInterest={!isAdminView && isAuthenticated ? handleExpressInterest : undefined}
                  adminView={isAdminView}
                />
              ))}
            </div>
            {requirements.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                No requirements found.
              </div>
            )}
          </>
        )}
      </div>

      {!isAdminView && (
        <ExpressInterestDialog
          requirement={selected}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
}
