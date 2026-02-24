import { useState, useRef, useEffect } from 'react';
import type { Requirement } from '@/lib/api';
import { requirementsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, X } from 'lucide-react';

const ACCEPT_DOCS = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg';
const MAX_MB = 10;

function todayYYYYMMDD(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export interface ExpressInterestInitialValues {
  message?: string;
  portfolio_link?: string;
  proposed_timeline_start?: string;
  proposed_timeline_end?: string;
  proposed_budget?: number | null;
}

interface Props {
  requirement: Requirement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: ExpressInterestInitialValues | null;
}

export default function ExpressInterestDialog({ requirement, open, onOpenChange, initialValues }: Props) {
  const [message, setMessage] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [proposedBudget, setProposedBudget] = useState('');
  const [timelineStart, setTimelineStart] = useState('');
  const [timelineEnd, setTimelineEnd] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && initialValues) {
      setMessage(initialValues.message ?? '');
      setPortfolioLink(initialValues.portfolio_link ?? '');
      setProposedBudget(initialValues.proposed_budget != null ? String(initialValues.proposed_budget) : '');
      setTimelineStart(initialValues.proposed_timeline_start ?? '');
      setTimelineEnd(initialValues.proposed_timeline_end ?? '');
    } else if (open && !initialValues) {
      setMessage('');
      setPortfolioLink('');
      setProposedBudget('');
      setTimelineStart('');
      setTimelineEnd('');
    }
  }, [open, initialValues]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_MB}MB`);
      return;
    }
    setError('');
    setAttachment(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirement) return;
    setError('');
    const today = todayYYYYMMDD();
    if (timelineStart && timelineStart < today) {
      setError('Timeline start must be today or a future date.');
      return;
    }
    if (timelineStart && timelineEnd && timelineEnd < timelineStart) {
      setError('Timeline end must be on or after the start date.');
      return;
    }
    setLoading(true);
    try {
      await requirementsApi.expressInterest(
        requirement.id,
        {
          message,
          portfolio_link: portfolioLink || undefined,
          proposed_budget: proposedBudget ? Number(proposedBudget) : undefined,
          proposed_timeline_start: timelineStart || undefined,
          proposed_timeline_end: timelineEnd || undefined,
        },
        attachment ?? undefined
      );
      setMessage('');
      setPortfolioLink('');
      setProposedBudget('');
      setTimelineStart('');
      setTimelineEnd('');
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  if (!requirement || !open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${open ? '' : 'pointer-events-none opacity-0'}`}
      style={{ transition: 'opacity 0.2s' }}
    >
      <div className="absolute inset-0 bg-black/60" onClick={() => onOpenChange(false)} />
      <div className="relative page-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">{initialValues ? 'Edit proposal' : 'Express interest'}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {requirement.anonymous_id || requirement.id.slice(0, 8)} — {requirement.title}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">{error}</div>}
          <div>
            <Label htmlFor="message">Proposal message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your approach and why you're a fit..."
              rows={4}
              required
            />
          </div>
          <div>
            <Label htmlFor="proposed_budget">Proposed budget ($ USD)</Label>
            <Input id="proposed_budget" type="number" placeholder="0" value={proposedBudget} onChange={(e) => setProposedBudget(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeline_start">Timeline start</Label>
              <Input
                id="timeline_start"
                type="date"
                min={todayYYYYMMDD()}
                value={timelineStart}
                onChange={(e) => setTimelineStart(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Today or a future date</p>
            </div>
            <div>
              <Label htmlFor="timeline_end">Timeline end</Label>
              <Input
                id="timeline_end"
                type="date"
                min={timelineStart || todayYYYYMMDD()}
                value={timelineEnd}
                onChange={(e) => setTimelineEnd(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">On or after start date</p>
            </div>
          </div>
          <div>
            <Label htmlFor="portfolio">Portfolio link</Label>
            <Input id="portfolio" type="url" value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <Label>Document attachment (optional)</Label>
            <p className="text-xs text-muted-foreground mb-2">PDF, Word, Excel, PPT, images or TXT. Max {MAX_MB}MB.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT_DOCS}
              onChange={handleFileChange}
              className="hidden"
              id="proposal-doc"
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
                {attachment ? attachment.name : 'Choose file'}
              </Button>
              {attachment && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => { setAttachment(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>{loading ? (initialValues ? 'Updating...' : 'Submitting...') : (initialValues ? 'Update proposal' : 'Submit')}</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
