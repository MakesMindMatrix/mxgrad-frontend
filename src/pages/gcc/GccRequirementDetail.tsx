import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { gccApi } from '@/lib/api';
import type { Requirement } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { ArrowLeft, Pencil } from 'lucide-react';

const CATEGORIES = ['AI', 'DevOps', 'Cloud', 'Data', 'Security', 'Blockchain', 'IoT'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

type FormState = {
  title: string;
  description: string;
  category: string;
  priority: string;
  budget_min: string;
  budget_max: string;
  budget_currency: string;
  timeline_start: string;
  timeline_end: string;
  industry_type: string;
  nda_required: boolean;
  tech_stack: string;
  skills: string;
};

interface RequirementWithApps extends Requirement {
  applications?: { startup_name: string; startup_email: string; message?: string; status: string; created_at: string }[];
}

function reqToForm(r: RequirementWithApps): FormState {
  return {
    title: r.title ?? '',
    description: r.description ?? '',
    category: r.category ?? 'AI',
    priority: r.priority ?? 'MEDIUM',
    budget_min: r.budget_min != null ? String(r.budget_min) : '',
    budget_max: r.budget_max != null ? String(r.budget_max) : '',
    budget_currency: r.budget_currency ?? 'USD',
    timeline_start: r.timeline_start ?? '',
    timeline_end: r.timeline_end ?? '',
    industry_type: r.industry_type ?? '',
    nda_required: r.nda_required ?? false,
    tech_stack: Array.isArray(r.tech_stack) ? r.tech_stack.join(', ') : '',
    skills: Array.isArray(r.skills) ? r.skills.join(', ') : '',
  };
}

export default function GccRequirementDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [req, setReq] = useState<RequirementWithApps | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const successMessage = location.state && typeof location.state === 'object' && 'message' in location.state ? (location.state as { message?: string }).message : undefined;

  useEffect(() => {
    if (!id) {
      setLoadError('Invalid requirement ID');
      setLoading(false);
      return;
    }
    setLoadError('');
    setLoading(true);
    gccApi
      .getRequirement(id)
      .then((r) => {
        setReq(r);
        setLoadError('');
      })
      .catch(() => {
        setReq(null);
        setLoadError('Failed to load requirement');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const startEdit = () => {
    if (req) {
      setForm(reqToForm(req));
      setEditMode(true);
      setSaveError('');
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setForm(null);
    setSaveError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !form) return;
    setSaveError('');
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
        budget_min: form.budget_min ? Number(form.budget_min) : undefined,
        budget_max: form.budget_max ? Number(form.budget_max) : undefined,
        budget_currency: form.budget_currency,
        timeline_start: form.timeline_start || undefined,
        timeline_end: form.timeline_end || undefined,
        industry_type: form.industry_type || undefined,
        nda_required: form.nda_required,
        tech_stack: form.tech_stack ? form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
        skills: form.skills ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
        resubmit: req?.approval_status === 'SENT_BACK',
      };
      await gccApi.updateRequirement(id, payload);
      const updated = await gccApi.getRequirement(id);
      setReq(updated);
      setEditMode(false);
      setForm(null);
    } catch (err: unknown) {
      setSaveError(err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-6 flex items-center justify-center">Loading...</div>;
  if (loadError || !req) {
    return (
      <div className="min-h-screen pt-6 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/gcc/requirements" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to requirements
          </Link>
          <p className="text-destructive">{loadError || 'Requirement not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/gcc/requirements" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to requirements
        </Link>
        {successMessage && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-300 p-4 mb-6">
            {successMessage}
          </div>
        )}
        <div className="page-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">{req.anonymous_id || req.id.slice(0, 8)}</span>
            <span className="chip chip-default">{req.category}</span>
            <span className="text-sm text-muted-foreground">{req.status}</span>
            {req.approval_status && req.approval_status !== 'APPROVED' && (
              <span
                className={
                  req.approval_status === 'PENDING_APPROVAL'
                    ? 'chip bg-amber-500/20 text-amber-700'
                    : req.approval_status === 'SENT_BACK'
                      ? 'chip bg-blue-500/20 text-blue-700'
                      : 'chip bg-destructive/20 text-destructive'
                }
              >
                {req.approval_status === 'PENDING_APPROVAL'
                  ? 'Pending approval'
                  : req.approval_status === 'SENT_BACK'
                    ? 'Sent back'
                    : 'Rejected'}
              </span>
            )}
          </div>
          {(req.approval_status === 'SENT_BACK' || req.approval_status === 'REJECTED') && req.admin_remarks && (
            <div className="rounded-lg bg-muted/50 border border-border p-4 mb-4">
              <p className="text-sm font-medium text-foreground mb-1">Admin remarks</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{req.admin_remarks}</p>
              {req.admin_remarks_at && (
                <p className="text-xs text-muted-foreground mt-2">{new Date(req.admin_remarks_at).toLocaleString()}</p>
              )}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 min-w-[7rem]"
              onClick={startEdit}
            >
              <Pencil className="h-4 w-4" />
              {req.approval_status === 'SENT_BACK' ? 'Edit and resubmit for approval' : 'Edit'}
            </Button>
          </div>
          {!editMode || !form ? (
            <>
              <h1 className="text-2xl font-bold">{req.title}</h1>
              <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{req.description}</p>
            </>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {saveError && <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">{saveError}</div>}
              <div>
                <Label htmlFor="detail-title">Title *</Label>
                <Input id="detail-title" value={form.title} onChange={(e) => setForm((f) => f ? { ...f, title: e.target.value } : f)} required />
              </div>
              <div>
                <Label htmlFor="detail-description">Description *</Label>
                <Textarea
                  id="detail-description"
                  value={form.description}
                  onChange={(e) => setForm((f) => f ? { ...f, description: e.target.value } : f)}
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="detail-category">Category *</Label>
                  <Select id="detail-category" value={form.category} onChange={(e) => setForm((f) => f ? { ...f, category: e.target.value } : f)}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="detail-priority">Priority</Label>
                  <Select id="detail-priority" value={form.priority} onChange={(e) => setForm((f) => f ? { ...f, priority: e.target.value } : f)}>
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="detail-budget_min">Budget min ($ USD)</Label>
                  <Input id="detail-budget_min" type="number" placeholder="0" value={form.budget_min} onChange={(e) => setForm((f) => f ? { ...f, budget_min: e.target.value } : f)} />
                </div>
                <div>
                  <Label htmlFor="detail-budget_max">Budget max ($ USD)</Label>
                  <Input id="detail-budget_max" type="number" placeholder="0" value={form.budget_max} onChange={(e) => setForm((f) => f ? { ...f, budget_max: e.target.value } : f)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="detail-timeline_start">Timeline start</Label>
                  <Input id="detail-timeline_start" type="date" value={form.timeline_start} onChange={(e) => setForm((f) => f ? { ...f, timeline_start: e.target.value } : f)} />
                </div>
                <div>
                  <Label htmlFor="detail-timeline_end">Timeline end</Label>
                  <Input id="detail-timeline_end" type="date" value={form.timeline_end} onChange={(e) => setForm((f) => f ? { ...f, timeline_end: e.target.value } : f)} />
                </div>
              </div>
              <div>
                <Label htmlFor="detail-industry_type">Industry</Label>
                <Input id="detail-industry_type" value={form.industry_type} onChange={(e) => setForm((f) => f ? { ...f, industry_type: e.target.value } : f)} />
              </div>
              <div>
                <Label htmlFor="detail-tech_stack">Tech stack (comma-separated)</Label>
                <Input id="detail-tech_stack" value={form.tech_stack} onChange={(e) => setForm((f) => f ? { ...f, tech_stack: e.target.value } : f)} />
              </div>
              <div>
                <Label htmlFor="detail-skills">Skills (comma-separated)</Label>
                <Input id="detail-skills" value={form.skills} onChange={(e) => setForm((f) => f ? { ...f, skills: e.target.value } : f)} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="detail-nda"
                  checked={form.nda_required}
                  onChange={(e) => setForm((f) => f ? { ...f, nda_required: e.target.checked } : f)}
                  className="rounded border-input"
                />
                <Label htmlFor="detail-nda">NDA required</Label>
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : req.approval_status === 'SENT_BACK' ? 'Resubmit for approval' : 'Save changes'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

        <h2 className="font-semibold mb-4">Applications / Expressions of interest</h2>
        {req.applications && req.applications.length > 0 ? (
          <div className="space-y-4">
            {req.applications.map((app: { id?: string; startup_name: string; startup_email: string; message?: string; status: string; created_at: string; attachment_path?: string; attachment_original_name?: string }) => (
              <div key={app.id ?? `${app.startup_email}-${app.created_at}`} className="page-card p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{app.startup_name}</p>
                    <p className="text-sm text-muted-foreground">{app.startup_email}</p>
                    {app.message && <p className="text-sm mt-2">{app.message}</p>}
                    {app.attachment_path && (
                      <a
                        href={`${import.meta.env.VITE_API_URL || '/api'}/uploads/${app.attachment_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline mt-2 inline-block"
                      >
                        📎 {app.attachment_original_name || 'Download attachment'}
                      </a>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">{new Date(app.created_at).toLocaleString()}</p>
                  </div>
                  <span className="chip chip-default">{app.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No applications yet.</p>
        )}
      </div>
    </div>
  );
}
