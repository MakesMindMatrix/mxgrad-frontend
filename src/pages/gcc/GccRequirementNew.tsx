import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gccApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { AlertTriangle, FileText } from 'lucide-react';

const CATEGORIES = ['AI', 'DevOps', 'Cloud', 'Data', 'Security', 'Blockchain', 'IoT'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const NDA_AGREEMENT = `By posting a requirement on GCC-Startup Connect, you acknowledge and agree:

1. You will NOT include your company name, brand, or any information that could identify your organization in the requirement title or description. Requirements may be shared with startups before an NDA is in place.

2. Confidential information must only be shared after a mutual NDA has been executed. Do not disclose proprietary, confidential, or personally identifiable information in the requirement text.

3. You are responsible for ensuring that the requirement description is suitable for sharing on an open marketplace. GCC-Startup Connect is not liable for any disclosure you make in the requirement.

4. If you indicate "NDA required" for this requirement, you agree to execute an NDA with selected startups before sharing any confidential details.`;

export default function GccRequirementNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ndaAgreed, setNdaAgreed] = useState(false);
  const [form, setForm] = useState({
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ndaAgreed) {
      setError('You must read and accept the NDA agreement to post a requirement.');
      return;
    }
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
      };
      const created = await gccApi.createRequirement(payload);
      navigate(`/gcc/requirements/${created.id}`);
    } catch (err: unknown) {
      setError(err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-6 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Post a tech requirement</h1>

        <form onSubmit={handleSubmit} className="space-y-6 page-card p-6">
          {error && (
            <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">{error}</div>
          )}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-1">Identity disclaimer</p>
              <p>
                Do not include your company name, brand, or any information that could identify your organization in the requirement description. Requirements may be shared with startups before an NDA is in place. Only share confidential details after a mutual NDA has been executed.
              </p>
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
              placeholder="Describe the requirement in generic terms. Do not disclose your identity or confidential information."
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
              <Label htmlFor="budget_min">Budget min</Label>
              <Input id="budget_min" type="number" value={form.budget_min} onChange={(e) => setForm((f) => ({ ...f, budget_min: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="budget_max">Budget max</Label>
              <Input id="budget_max" type="number" value={form.budget_max} onChange={(e) => setForm((f) => ({ ...f, budget_max: e.target.value }))} />
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
            <Input id="tech_stack" value={form.tech_stack} onChange={(e) => setForm((f) => ({ ...f, tech_stack: e.target.value }))} placeholder="e.g. Python, React, AWS" />
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
            <Label htmlFor="nda">NDA required for this requirement</Label>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2 font-medium">
              <FileText className="h-4 w-4" />
              NDA agreement
            </div>
            <div className="text-sm text-muted-foreground whitespace-pre-line max-h-48 overflow-y-auto pr-2">
              {NDA_AGREEMENT}
            </div>
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="nda_agreed"
                checked={ndaAgreed}
                onChange={(e) => setNdaAgreed(e.target.checked)}
                className="rounded border-input mt-1"
              />
              <Label htmlFor="nda_agreed" className="cursor-pointer font-normal">
                I have read and agree to the NDA agreement above. I will not declare my organization&apos;s identity or confidential information in the requirement description.
              </Label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || !ndaAgreed}>
              {loading ? 'Creating...' : 'Create requirement'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/gcc/requirements')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
