import { useEffect, useState } from 'react';
import { requirementsApi, incubationApi, type IncubationStartupListItem, type Requirement } from '@/lib/api';
import RequirementCard from '@/components/RequirementCard';
import ExpressInterestDialog from '@/components/ExpressInterestDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const CATEGORIES = ['All', 'AI', 'DevOps', 'Cloud', 'Data', 'Security', 'Blockchain', 'IoT'];
const SEARCH_DEBOUNCE_MS = 280;

export default function IncubationExplore() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [approvedStartups, setApprovedStartups] = useState<IncubationStartupListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selected, setSelected] = useState<Requirement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    incubationApi.listStartups({ approval_status: 'APPROVED' }).then(setApprovedStartups).catch(() => setApprovedStartups([]));
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => setSearch(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    const params: { category?: string; search?: string } = {};
    if (category && category !== 'All') params.category = category;
    if (search.trim()) params.search = search.trim();
    setLoading(true);
    requirementsApi
      .list(params)
      .then(setRequirements)
      .catch(() => setRequirements([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  const handleExpressInterest = (requirement: Requirement) => {
    setSelected(requirement);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 pt-6">
      <div className="container mx-auto px-4 flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Explore GCC Requirements</h1>
          <p className="text-muted-foreground">
            Browse approved GCC requirements and submit proposals on behalf of one of your approved startups.
          </p>
        </div>

        {approvedStartups.length === 0 && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800 mb-6">
            You need at least one approved startup before you can submit a proposal. Add a startup and wait for admin approval first.
          </div>
        )}

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
            {CATEGORIES.map((item) => (
              <Button
                key={item}
                variant={category === item ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border flex-shrink-0" />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 pb-16">
          {loading ? (
            <p className="text-muted-foreground py-8">Loading requirements...</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requirements.map((requirement) => (
                  <RequirementCard
                    key={requirement.id}
                    requirement={requirement}
                    onExpressInterest={approvedStartups.length > 0 ? handleExpressInterest : undefined}
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
      </div>

      <ExpressInterestDialog
        requirement={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        startupOptions={approvedStartups}
      />
    </div>
  );
}
