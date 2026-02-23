/** Subtle background graphics for login and register — works in light and dark theme */
export default function AuthPageBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {/* Soft gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/[0.07] blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/[0.05] blur-[80px]" />
      <div className="absolute top-1/2 left-1/2 w-[320px] h-[320px] rounded-full bg-primary/[0.04] blur-[70px] -translate-x-1/2 -translate-y-1/2" />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial fade so card area stays clean */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 85% 70% at 50% 50%, transparent 35%, hsl(var(--background)) 95%)',
        }}
      />
    </div>
  );
}
