import { useEffect, useState } from 'react';
import { gccApi, type StartupListItem } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Building2, Globe, MapPin, Users } from 'lucide-react';

const INDUSTRIES = ['All', 'AI', 'FinTech', 'HealthTech', 'EdTech', 'SaaS', 'IoT', 'Blockchain', 'Other'];
const SEARCH_DEBOUNCE_MS = 280;

export default function GccExplore() {
  const [startups, setStartups] = useState<StartupListItem[]>([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [industry, setIndustry] = useState('All');
  const [loading, setLoading] = useState(true);

  // Real-time search: debounce the value used for API so we fetch as user types (no Enter needed)
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setLoading(true);
    const params: { search?: string; industry?: string } = {};
    if (search.trim()) params.search = search.trim();
    if (industry && industry !== 'All') params.industry = industry;
    gccApi.listStartups(params).then(setStartups).catch(() => setStartups([])).finally(() => setLoading(false));
  }, [search, industry]);

  return (
    <div className="flex flex-col flex-1 min-h-0 pt-6">
      <div className="container mx-auto px-4 flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Explore</h1>
          <p className="text-muted-foreground">
            Search for startups to partner with. Browse approved startups and their capabilities before posting a requirement.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              autoComplete="off"
              placeholder="Search startups by name, company, or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((c) => (
              <Button
                key={c}
                variant={industry === c ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIndustry(c)}
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
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startups.map((s) => (
                <div key={s.id} className="page-card p-6 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{s.company_name || s.name}</h3>
                      {s.company_name && <p className="text-xs text-muted-foreground truncate">{s.name}</p>}
                    </div>
                  </div>
                  {s.industry && (
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span className="chip chip-default text-xs">{s.industry}</span>
                    </p>
                  )}
                  {s.solution_description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{s.solution_description}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-auto pt-2">
                    {s.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {s.location}
                      </span>
                    )}
                    {s.team_size != null && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {s.team_size} team
                      </span>
                    )}
                    {s.website && (
                      <a href={s.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                        <Globe className="h-3 w-3" /> Website
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && startups.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No startups found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
