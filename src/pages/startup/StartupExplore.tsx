import { useEffect, useState } from 'react';
import { requirementsApi } from '@/lib/api';
import type { Requirement } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import RequirementCard from '@/components/RequirementCard';
import ExpressInterestDialog from '@/components/ExpressInterestDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const CATEGORIES = ['All', 'AI', 'DevOps', 'Cloud', 'Data', 'Security', 'Blockchain', 'IoT'];
const SEARCH_DEBOUNCE_MS = 280;

export default function StartupExplore() {
  const { user } = useAuth();
  const isStartup = user?.role === 'STARTUP';
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selected, setSelected] = useState<Requirement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Real-time search: debounce the value used for API so we fetch as user types (no Enter needed)
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    const params: { category?: string; search?: string } = {};
    if (category && category !== 'All') params.category = category;
    if (search.trim()) params.search = search.trim();
    requirementsApi.list(params).then(setRequirements).catch(() => setRequirements([]));
  }, [category, search]);

  const handleExpressInterest = (req: Requirement) => {
    setSelected(req);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 pt-6">
      <div className="container mx-auto px-4 flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Explore</h1>
          <p className="text-muted-foreground">
            Search for requirements posted by GCCs. Express interest on opportunities that match your capabilities.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              autoComplete="off"
              placeholder="Search requirements..."
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
      </div>

      <div className="border-t border-border flex-shrink-0" />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 pb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requirements.map((r) => (
              <RequirementCard
                key={r.id}
                requirement={r}
                onExpressInterest={isStartup ? handleExpressInterest : undefined}
              />
            ))}
          </div>

          {requirements.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No requirements found.
            </div>
          )}
        </div>
      </div>

      <ExpressInterestDialog
        requirement={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
