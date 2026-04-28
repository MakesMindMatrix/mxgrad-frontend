import { useEffect, useState, type FormEvent } from 'react';
import { incubationApi, type IncubationStartupDetail, type IncubationStartupListItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Eye, RefreshCw, ToggleLeft, ToggleRight, X } from 'lucide-react';

type ApprovalFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

const initialForm = {
  name: '',
  company_name: '',
  email: '',
  password: '',
  pan_number: '',
  company_website: '',
  description: '',
  gst_number: '',
  additional_email: '',
  mobile_primary: '',
  mobile_secondary: '',
};

function statusChipClass(status: 'APPROVED' | 'PENDING' | 'REJECTED') {
  if (status === 'APPROVED') return 'chip bg-green-500/15 text-green-700';
  if (status === 'PENDING') return 'chip bg-amber-500/15 text-amber-700';
  return 'chip bg-destructive/15 text-destructive';
}

function profileKeyToLabel(key: string) {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatProfileValue(value: unknown): string {
  if (value == null || value === '') return '-';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export default function IncubationStartups() {
  const [filter, setFilter] = useState<ApprovalFilter>('ALL');
  const [startups, setStartups] = useState<IncubationStartupListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [detailStartupId, setDetailStartupId] = useState<string | null>(null);
  const [detail, setDetail] = useState<IncubationStartupDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

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

  const handleToggleLogin = async (startup: IncubationStartupListItem) => {
    if (startup.approval_status !== 'APPROVED') return;
    setToggling(startup.id);
    try {
      const result = await incubationApi.toggleStartupLogin(startup.id, !startup.login_enabled);
      setStartups((prev) => prev.map((item) => (item.id === startup.id ? { ...item, login_enabled: result.login_enabled } : item)));
      setDetail((current) => {
        if (!current || current.user.id !== startup.id) return current;
        return {
          ...current,
          user: {
            ...current.user,
            login_enabled: result.login_enabled,
          },
        };
      });
    } catch {
      // Silent failure: user will see no change.
    } finally {
      setToggling(null);
    }
  };

  const handleOpenDetail = async (startupId: string) => {
    setDetailStartupId(startupId);
    setDetailLoading(true);
    setDetailError('');
    try {
      const response = await incubationApi.getStartup(startupId);
      setDetail(response);
    } catch (err: unknown) {
      setDetail(null);
      setDetailError(err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to load startup details');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setDetailStartupId(null);
    setDetail(null);
    setDetailError('');
  };

  const handleSubmit = async (event: FormEvent) => {
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
        pan_number: form.pan_number.trim().toUpperCase(),
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
              <p className="text-sm text-muted-foreground mt-1">The new startup stays pending until an admin approves it, and it is tagged under your incubation center from creation onward.</p>
            </div>

            {(message || error) && (
              <div className={`rounded-md p-3 text-sm ${error ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-700 dark:text-green-300'}`}>
                {error || message}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startup_name">Founder / account name *</Label>
                <Input id="startup_name" value={form.name} onChange={(event) => handleChange('name', event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startup_company_name">Startup company name</Label>
                <Input id="startup_company_name" value={form.company_name} onChange={(event) => handleChange('company_name', event.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startup_email">Login email *</Label>
                <Input id="startup_email" type="email" value={form.email} onChange={(event) => handleChange('email', event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startup_password">Temporary password *</Label>
                <Input id="startup_password" type="password" minLength={6} value={form.password} onChange={(event) => handleChange('password', event.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startup_pan">Company PAN Number *</Label>
              <Input
                id="startup_pan"
                value={form.pan_number}
                onChange={(event) => handleChange('pan_number', event.target.value.toUpperCase())}
                required
                maxLength={10}
                placeholder="e.g. AABCE1234F"
                className="tracking-widest uppercase"
              />
              <p className="text-xs text-muted-foreground">5 letters + 4 digits + 1 letter</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startup_description">Short description *</Label>
              <Textarea id="startup_description" rows={4} value={form.description} onChange={(event) => handleChange('description', event.target.value)} required />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startup_website">Company website</Label>
                <Input id="startup_website" type="url" value={form.company_website} onChange={(event) => handleChange('company_website', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startup_gst">GSTN <span className="text-muted-foreground">(optional)</span></Label>
                <Input id="startup_gst" value={form.gst_number} onChange={(event) => handleChange('gst_number', event.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="startup_additional_email">Additional email</Label>
                <Input id="startup_additional_email" type="email" value={form.additional_email} onChange={(event) => handleChange('additional_email', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startup_mobile_primary">Primary mobile</Label>
                <Input id="startup_mobile_primary" value={form.mobile_primary} onChange={(event) => handleChange('mobile_primary', event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startup_mobile_secondary">Secondary mobile</Label>
                <Input id="startup_mobile_secondary" value={form.mobile_secondary} onChange={(event) => handleChange('mobile_secondary', event.target.value)} />
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
                <p className="text-sm text-muted-foreground">Open any startup to review profile data, communications, requests, and approval state under your incubation center.</p>
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
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Building2 className="h-4 w-4 text-primary" />
                          <span className="font-medium">{startup.company_name || startup.name}</span>
                          <span className="chip bg-blue-500/15 text-blue-700">Managed by your center</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{startup.email}</p>
                        {startup.pan_number && (
                          <p className="text-xs text-muted-foreground mt-1 font-mono tracking-wider">PAN: {startup.pan_number}</p>
                        )}
                        {startup.solution_description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{startup.solution_description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Added {new Date(startup.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {Number(startup.interest_count ?? 0)} communication{Number(startup.interest_count ?? 0) === 1 ? '' : 's'} from this startup
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={statusChipClass(startup.approval_status)}>{startup.approval_status}</span>
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => handleOpenDetail(startup.id)}>
                          <Eye className="h-4 w-4" />
                          View details
                        </Button>
                        {startup.approval_status === 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => handleToggleLogin(startup)}
                            disabled={toggling === startup.id}
                            title={startup.login_enabled ? 'Disable login' : 'Enable login'}
                            className={`flex items-center gap-1.5 text-xs font-medium transition rounded px-2 py-1 ${
                              startup.login_enabled
                                ? 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-500/10'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                          >
                            {startup.login_enabled
                              ? <><ToggleRight className="h-4 w-4" /> Login on</>
                              : <><ToggleLeft className="h-4 w-4" /> Login off</>
                            }
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {detailStartupId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={closeDetail}
          role="dialog"
          aria-modal="true"
          aria-label="Managed startup details"
        >
          <div
            className="bg-page border border-border rounded-xl shadow-xl max-w-5xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-page">
              <div>
                <h2 className="text-lg font-semibold">Managed startup details</h2>
                <p className="text-sm text-muted-foreground">Profile, approval state, and communication history for this startup.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={closeDetail} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 space-y-5">
              {detailLoading ? (
                <p className="text-muted-foreground">Loading startup details...</p>
              ) : detailError ? (
                <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">{detailError}</div>
              ) : detail ? (
                <>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                    <p className="font-medium text-foreground">Incubation relationship</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This startup is attached to your incubation center. Admins also see this association before and after approval.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground mb-1">Startup</p>
                      <p className="font-semibold">{detail.user.company_name || detail.user.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{detail.user.email}</p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground mb-1">Approval status</p>
                      <span className={statusChipClass((detail.user.approval_status || 'PENDING') as 'APPROVED' | 'PENDING' | 'REJECTED')}>
                        {detail.user.approval_status || 'PENDING'}
                      </span>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground mb-1">Login access</p>
                      <p className="font-semibold">{detail.user.login_enabled ? 'Enabled' : 'Disabled'}</p>
                      <p className="text-xs text-muted-foreground mt-1">You control this for approved startups.</p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground mb-1">Communications</p>
                      <p className="font-semibold">{detail.interests.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">Requests and proposal records from this startup.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground mb-1">Website</p>
                      <p className="text-sm break-all">{detail.user.website || '-'}</p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground mb-1">Industry</p>
                      <p className="text-sm">{detail.user.industry || '-'}</p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground mb-1">Location</p>
                      <p className="text-sm">{detail.user.location || '-'}</p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground mb-1">Funding stage</p>
                      <p className="text-sm">{detail.user.funding || '-'}</p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground mb-1">Primary offering</p>
                      <p className="text-sm">{detail.user.primary_offering_type || '-'}</p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-xs text-muted-foreground mb-1">Added on</p>
                      <p className="text-sm">{detail.user.created_at ? new Date(detail.user.created_at).toLocaleString() : '-'}</p>
                    </div>
                  </div>

                  {detail.profile && (
                    <div className="border-t border-border pt-4">
                      <div className="mb-3">
                        <h3 className="font-semibold">Startup profile snapshot</h3>
                        <p className="text-sm text-muted-foreground">Everything currently stored on the startup profile is visible here for incubation review.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 max-h-72 overflow-y-auto pr-2">
                        {Object.entries(detail.profile)
                          .filter(([key]) => key !== 'id' && key !== 'user_id')
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([key, value]) => (
                            <div key={key} className="grid gap-1">
                              <div className="text-sm text-muted-foreground">{profileKeyToLabel(key)}</div>
                              <div className="text-sm text-foreground break-words">{formatProfileValue(value)}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-border pt-4">
                    <div className="mb-3">
                      <h3 className="font-semibold">Communications and requests</h3>
                      <p className="text-sm text-muted-foreground">All GCC-facing proposal activity from this startup is visible here.</p>
                    </div>
                    {detail.interests.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                        No communications or requests yet for this startup.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {detail.interests.map((interest) => (
                          <div key={interest.id} className="rounded-lg border border-border p-4">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-medium">{interest.requirement_title || 'Requirement'}</p>
                                  {interest.category && <span className="chip chip-default">{interest.category}</span>}
                                </div>
                                {interest.message && (
                                  <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{interest.message}</p>
                                )}
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                                  <span>Created {interest.created_at ? new Date(interest.created_at).toLocaleString() : '-'}</span>
                                  {interest.proposed_budget != null && <span>Budget: {interest.proposed_budget}</span>}
                                  {interest.portfolio_link && <span>Portfolio shared</span>}
                                  {interest.attachment_original_name && <span>Attachment: {interest.attachment_original_name}</span>}
                                </div>
                              </div>
                              <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
                                <span className="chip chip-default">{interest.status}</span>
                                {interest.gcc_response === 'ACCEPTED' && (
                                  <span className="chip bg-green-500/15 text-green-700">GCC accepted</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Could not load startup details.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
