import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gccApi } from '@/lib/api';
import type { Requirement } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

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

function formEquals(a: FormState, b: FormState): boolean {
  return (
    a.title === b.title &&
    a.description === b.description &&
    a.category === b.category &&
    a.priority === b.priority &&
    a.budget_min === b.budget_min &&
    a.budget_max === b.budget_max &&
    a.budget_currency === b.budget_currency &&
    a.timeline_start === b.timeline_start &&
    a.timeline_end === b.timeline_end &&
    a.industry_type === b.industry_type &&
    a.nda_required === b.nda_required &&
    a.tech_stack === b.tech_stack &&
    a.skills === b.skills
  );
}

const initialForm: FormState = {
  title: '',
  description: '',
  category: 'AI',
  priority: 'MEDIUM',
  budget_min: '',
  budget_max: '',
  budget_currency: 'USD',
  timeline_start: '',
  timeline_end: '',
  industry_type: '',
  nda_required: false,
  tech_stack: '',
  skills: '',
};

export default function GccRequirementEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState('');
  const [error, setError] = useState('');
  const [approvalStatus, setApprovalStatus] = useState<string>('');
  const initialFormRef = useRef<FormState>(initialForm);
  const [form, setForm] = useState<FormState>({ ...initialForm });
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const isDirty = !formEquals(form, initialFormRef.current);

  useEffect(() => {
    if (!id) {
      setLoadErr('Invalid requirement ID');
      return;
    }
    setLoadErr('');
    gccApi
      .getRequirement(id)
      .then((r: Requirement & { applications?: unknown[]; approval_status?: string }) => {
        setApprovalStatus(r.approval_status || '');
        const loaded: FormState = {
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
        initialFormRef.current = { ...loaded };
        setForm(loaded);
      })
      .catch(() => setLoadErr('Failed to load requirement'));
  }, [id]);

  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  const saveRequirement = async (): Promise<boolean> => {
    if (!id) return false;
    setError('');
    setLoading(true);
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
        resubmit: approvalStatus === 'SENT_BACK',
      };
      await gccApi.updateRequirement(id, payload);
      initialFormRef.current = { ...form };
      return true;
    } catch (err: unknown) {
      setError(err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to update');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await saveRequirement();
    if (ok && id) navigate(`/gcc/requirements/${id}`);
  };

  const goBack = () => {
    if (id) navigate(`/gcc/requirements/${id}`);
  };

  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isDirty) setShowLeaveConfirm(true);
    else goBack();
  };

  const handleCancelClick = () => {
    if (isDirty) setShowLeaveConfirm(true);
    else goBack();
  };

  const handleDiscard = () => {
    setShowLeaveConfirm(false);
    goBack();
  };

  const handleSaveAndLeave = async () => {
    const ok = await saveRequirement();
    if (ok) {
      setShowLeaveConfirm(false);
      goBack();
    }
  };

  if (loadErr) {
    return (
      <div className="min-h-screen pt-6 pb-16 container mx-auto px-4">
        <p className="text-destructive">{loadErr}</p>
        <Link to="/gcc/requirements" className="mt-4 inline-block">
          <Button variant="outline">Back to requirements</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <a href="#" onClick={handleBackClick} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to requirement
        </a>
        <h1 className="text-3xl font-bold mb-8">{approvalStatus === 'SENT_BACK' ? 'Edit and resubmit for approval' : 'Edit requirement'}</h1>

        <form onSubmit={handleSubmit} className="space-y-6 page-card p-6">
          {error && <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">{error}</div>}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select id="category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select id="priority" value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget_min">Budget min ($ USD)</Label>
              <Input id="budget_min" type="number" placeholder="0" value={form.budget_min} onChange={(e) => setForm((f) => ({ ...f, budget_min: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="budget_max">Budget max ($ USD)</Label>
              <Input id="budget_max" type="number" placeholder="0" value={form.budget_max} onChange={(e) => setForm((f) => ({ ...f, budget_max: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeline_start">Timeline start</Label>
              <Input id="timeline_start" type="date" value={form.timeline_start} onChange={(e) => setForm((f) => ({ ...f, timeline_start: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="timeline_end">Timeline end</Label>
              <Input id="timeline_end" type="date" value={form.timeline_end} onChange={(e) => setForm((f) => ({ ...f, timeline_end: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label htmlFor="industry_type">Industry</Label>
            <Input id="industry_type" value={form.industry_type} onChange={(e) => setForm((f) => ({ ...f, industry_type: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="tech_stack">Tech stack (comma-separated)</Label>
            <Input id="tech_stack" value={form.tech_stack} onChange={(e) => setForm((f) => ({ ...f, tech_stack: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input id="skills" value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="nda"
              checked={form.nda_required}
              onChange={(e) => setForm((f) => ({ ...f, nda_required: e.target.checked }))}
              className="rounded border-input"
            />
            <Label htmlFor="nda">NDA required</Label>
          </div>
          {showLeaveConfirm && (
            <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="text-sm font-medium flex-1">You have unsaved changes. Save or discard before leaving?</p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleDiscard} disabled={loading}>
                  Discard
                </Button>
                <Button type="button" size="sm" onClick={handleSaveAndLeave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isDirty ? 'Update' : approvalStatus === 'SENT_BACK' ? 'Resubmit for approval' : 'Save changes'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancelClick} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
