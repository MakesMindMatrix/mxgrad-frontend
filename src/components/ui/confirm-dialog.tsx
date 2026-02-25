import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  variant = 'default',
  onConfirm,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 bg-card border border-border rounded-xl shadow-lg p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? '...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
