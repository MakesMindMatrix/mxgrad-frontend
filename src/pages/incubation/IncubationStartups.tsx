import { useEffect, useState } from 'react';
import { incubationApi, type IncubationStartupListItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, RefreshCw } from 'lucide-react';

type ApprovalFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

const initialForm = {
  name: '',
  company_name: '',
  email: '',
  password: '',
  company_website: '',
  description: '',
  gst_number: '',
  additional_email: '',
  mobile_primary: '',
  mobile_secondary: '',
};

export default function IncubationStartups() {
  const [filter, setFilter] = useState<ApprovalFilter>('ALL');
  const [startups, setStartups] = useState<IncubationStartupListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);

  const loadStartups = async (nextFilter: ApprovalFilter = filter) => {
    setLoading(true);
    try {
      const list = await incubationApi.listStartups(nextFilter === 'ALL' ? undefined : { approval_status: nextFilter });
      setStartups(list);
    } catch {
      setStartups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStartups(filter);
  }, [filter]);

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');
    try {
      await incubationApi.createStartup({
        name: form.name.trim(),
        company_name: form.company_name.trim() || undefined,
        email: form.email.trim(),
        password: form.password,
        company_website: form.company_website.trim() || undefined,
        description: form.description.trim(),
        gst_number: form.gst_number.trim() || undefined,
        additional_email: form.additional_email.trim() || undefined,
        mobile_primary: form.mobile_primary.trim() || undefined,
        mobile_secondary: form.mobile_secondary.trim() || undefined,
      });
      setForm(initialForm);
      setMessage('Startup created successfully and sent for admin approval.');
      setFilter('ALL');
      await loadStartups('ALL');
    } catch (err: unknown) {
      setError(err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to create startup');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Managed Startups</h1>
            <p className="text-muted-foreground">Create startup accounts under your incubation center and track their approval status.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => loadStartups()} disabled={loading} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="page-card p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Add new startup</h2>
              <p className="text-sm text-muted-foreground mt-1">The new startup will remain pending until an admin approves it.</p>
            </div>

            {(message || error) && (
              <div className={`rounded-md p-3 text-sm ${error ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-700 dark:text-green-300'}`}>
                {error || message}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startup_name">Founder / account name *</Label>
                <Input id="startup_name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startup_company_name">Startup company name</Label>
                <Input id="startup_company_name" value={form.company_name} onChange={(e) => handleChange('company_name', e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startup_email">Login email *</Label>
                <Input id="startup_email" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startup_password">Temporary password *</Label>
                <Input id="startup_password" type="password" minLength={6} value={form.password} onChange={(e) => handleChange('password', e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startup_description">Short description *</Label>
              <Textarea id="startup_description" rows={4} value={form.description} onChange={(e) => handleChange('description', e.target.value)} required />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startup_website">Company website</Label>
                <Input id="startup_website" type="url" value={form.company_website} onChange={(e) => handleChange('company_website', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startup_gst">GSTN</Label>
                <Input id="startup_gst" value={form.gst_number} onChange={(e) => handleChange('gst_number', e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="startup_additional_email">Additional email</Label>
                <Input id="startup_additional_email" type="email" value={form.additional_email} onChange={(e) => handleChange('additional_email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startup_mobile_primary">Primary mobile</Label>
                <Input id="startup_mobile_primary" value={form.mobile_primary} onChange={(e) => handleChange('mobile_primary', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startup_mobile_secondary">Secondary mobile</Label>
                <Input id="startup_mobile_secondary" value={form.mobile_secondary} onChange={(e) => handleChange('mobile_secondary', e.target.value)} />
              </div>
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating startup...' : 'Create startup'}
            </Button>
          </form>

          <div className="page-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold">Startup list</h2>
                <p className="text-sm text-muted-foreground">Only approved startups can be used when submitting GCC proposals.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as ApprovalFilter[]).map((item) => (
                  <Button
                    key={item}
                    variant={filter === item ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>

            {loading ? (
              <p className="text-muted-foreground">Loading startups...</p>
            ) : startups.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                No startups found for this filter.
              </div>
            ) : (
              <div className="space-y-3">
                {startups.map((startup) => (
                  <div key={startup.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Building2 className="h-4 w-4 text-primary" />
                          <span className="font-medium">{startup.company_name || startup.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{startup.email}</p>
                        {startup.solution_description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{startup.solution_description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Added {new Date(startup.created_at).toLocaleDateString()}
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
