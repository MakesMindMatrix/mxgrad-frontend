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

function todayYYYYMMDD(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const CONTROLLED_DISCLOSURE = `GCC-Startup Connect operates under a controlled disclosure framework.
Company identities are not disclosed to startups until an engagement offer has been formally accepted through the platform.

Users must not include any information that directly or indirectly identifies their organization within the requirement submission. GCC-Startup Connect shall not be liable for disclosures resulting from user-submitted content.`;

const NDA_AGREEMENT = `Confidentiality & NDA Agreement

By posting a requirement on GCC-Startup Connect, you acknowledge and agree to the following:

Anonymized Posting
Your requirement will be visible to startups without revealing your organization's identity.

Controlled Identity Disclosure
Your company identity will only be shared with a startup after:
• The startup expresses interest, and
• You explicitly approve that interest through the platform.

Confidential Information Handling
No proprietary, confidential, strategic, financial, technical, or personally identifiable information should be included in the public requirement description.

NDA Execution (If Required)
If you select "NDA Required":
• An NDA must be executed between your organization and the selected startup
• Confidential information may only be shared after the NDA is fully executed

User Responsibility
You are solely responsible for ensuring that the content submitted is appropriate for publication in an anonymized marketplace. GCC-Startup Connect is not liable for disclosures made by the user within the requirement text.`;

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
    const today = todayYYYYMMDD();
    if (form.timeline_start && form.timeline_start < today) {
      setError('Timeline start must be today or a future date.');
      return;
    }
    if (form.timeline_start && form.timeline_end && form.timeline_end < form.timeline_start) {
      setError('Timeline end must be on or after the start date.');
      return;
    }
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
      navigate(`/gcc/requirements/${created.id}`, { state: { message: 'Requirement submitted. It is pending admin approval and will be visible to startups once approved.' } });
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
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-100">
              <p className="font-semibold mb-1">Controlled disclosure</p>
              <p>
                Do not include any information that directly or indirectly identifies your organization. Company identities are disclosed only after an engagement is formally accepted. GCC-Startup Connect is not liable for disclosures in user-submitted content.
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
              <Input
                id="timeline_start"
                type="date"
                min={todayYYYYMMDD()}
                value={form.timeline_start}
                onChange={(e) => setForm((f) => ({ ...f, timeline_start: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">Today or a future date</p>
            </div>
            <div>
              <Label htmlFor="timeline_end">Timeline end</Label>
              <Input
                id="timeline_end"
                type="date"
                min={form.timeline_start || todayYYYYMMDD()}
                value={form.timeline_end}
                onChange={(e) => setForm((f) => ({ ...f, timeline_end: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">On or after start date</p>
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
              Confidentiality & NDA Agreement
            </div>
            <div className="text-sm text-muted-foreground whitespace-pre-line max-h-64 overflow-y-auto pr-2 space-y-4">
              <p className="font-medium text-foreground/90">{CONTROLLED_DISCLOSURE}</p>
              <p>{NDA_AGREEMENT}</p>
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
                I have read and agree to the Confidentiality & NDA Agreement above. I will not include identity or confidential information in the requirement and accept user responsibility as stated.
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
