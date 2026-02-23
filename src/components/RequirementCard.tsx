import type { Requirement } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Users, Shield } from 'lucide-react';

const CHIP_CLASS: Record<string, string> = {
  AI: 'chip-ai',
  DevOps: 'chip-devops',
  Cloud: 'chip-cloud',
  Data: 'chip-data',
  Security: 'chip-security',
};

interface Props {
  requirement: Requirement;
  onExpressInterest?: (req: Requirement) => void;
}

export default function RequirementCard({ requirement, onExpressInterest }: Props) {
  const chipClass = CHIP_CLASS[requirement.category] || 'chip-default';
  const budgetStr =
    requirement.budget_min != null || requirement.budget_max != null
      ? `${requirement.budget_currency || 'USD'} ${requirement.budget_min ?? '?'} - ${requirement.budget_max ?? '?'}`
      : 'Not specified';
  const timelineStr =
    requirement.timeline_start && requirement.timeline_end
      ? `${requirement.timeline_start} to ${requirement.timeline_end}`
      : requirement.timeline_start || 'Not specified';

  return (
    <div className="page-card-hover p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">{requirement.anonymous_id || requirement.id.slice(0, 8)}</span>
          <span className={`chip ${chipClass}`}>{requirement.category}</span>
        </div>
        {requirement.nda_required && (
          <span className="chip bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Shield className="h-3 w-3 mr-1 inline" /> NDA
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold leading-tight">{requirement.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{requirement.description}</p>

      {(requirement.tech_stack?.length || requirement.skills?.length) ? (
        <div className="flex flex-wrap gap-1.5">
          {(requirement.tech_stack || requirement.skills || []).slice(0, 5).map((t) => (
            <span key={t} className="chip chip-default text-[11px]">{t}</span>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5 text-green-500" />
          {budgetStr}
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          {timelineStr}
        </div>
        {requirement.created_at && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(requirement.created_at).toLocaleDateString()}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {Number(requirement.interest_count) || 0} interested
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <span className="text-xs text-muted-foreground">{requirement.industry_type || '—'}</span>
        {onExpressInterest && (
          <Button size="sm" onClick={() => onExpressInterest(requirement)}>
            Express interest
          </Button>
        )}
      </div>
    </div>
  );
}
