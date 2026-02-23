import { createContext, useContext, useState, type ReactNode } from 'react';
import { clsx } from 'clsx';

interface TabsContextValue {
  value: string;
  onValueChange: (v: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({ value, onValueChange, children, className }: { value: string; onValueChange: (v: string) => void; children: ReactNode; className?: string }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('inline-flex h-10 items-center justify-center rounded-lg border border-border bg-neutral-100 dark:bg-muted p-1', className)} role="tablist">
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  const isActive = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={clsx(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        isActive
          ? 'bg-background text-foreground shadow border border-border'
          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/10 hover:text-foreground',
        className
      )}
      onClick={() => ctx.onValueChange(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useContext(TabsContext);
  if (!ctx || ctx.value !== value) return null;
  return (
    <div role="tabpanel" className={clsx('mt-4 focus-visible:outline-none', className)}>
      {children}
    </div>
  );
}
