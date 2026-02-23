import { useState } from 'react';
import type { Requirement } from '@/lib/api';
import { requirementsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  requirement: Requirement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExpressInterestDialog({ requirement, open, onOpenChange }: Props) {
  const [message, setMessage] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [timelineStart, setTimelineStart] = useState('');
  const [timelineEnd, setTimelineEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirement) return;
    setError('');
    setLoading(true);
    try {
      await requirementsApi.expressInterest(requirement.id, {
        message,
        portfolio_link: portfolioLink || undefined,
        proposed_timeline_start: timelineStart || undefined,
        proposed_timeline_end: timelineEnd || undefined,
      });
      setMessage('');
      setPortfolioLink('');
      setTimelineStart('');
      setTimelineEnd('');
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
        <h2 className="text-xl font-semibold mb-2">Express interest</h2>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeline_start">Timeline start</Label>
              <Input id="timeline_start" type="date" value={timelineStart} onChange={(e) => setTimelineStart(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="timeline_end">Timeline end</Label>
              <Input id="timeline_end" type="date" value={timelineEnd} onChange={(e) => setTimelineEnd(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="portfolio">Portfolio link</Label>
            <Input id="portfolio" type="url" value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
