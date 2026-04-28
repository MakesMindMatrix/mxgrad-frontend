import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AuthPageBackground from '@/components/AuthPageBackground';

export default function Register() {
  const [role, setRole] = useState<'GCC' | 'STARTUP' | 'INCUBATION' | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (role) navigate(`/register/form?role=${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-16 bg-page relative">
      <AuthPageBackground />
      <div className="w-full max-w-lg relative z-0">
        <div className="page-card p-8 shadow-xl">
          <h1 className="text-xl font-bold text-foreground mb-2">Create account</h1>
          <p className="text-muted-foreground text-sm mt-1 mb-6">Select your registration category.</p>

          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('STARTUP')}
              className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                role === 'STARTUP'
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <span className="font-medium text-sm">Startup Entity</span>
              <span className="text-muted-foreground text-xs">Emerging technology companies and scale-ups</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('GCC')}
              className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                role === 'GCC'
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <span className="font-medium text-sm">GCC Entity</span>
              <span className="text-muted-foreground text-xs">Global Capability Centers and corporate innovation units.</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('INCUBATION')}
              className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                role === 'INCUBATION'
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <span className="font-medium text-sm">Incubation Center</span>
              <span className="text-muted-foreground text-xs">Incubators and accelerators managing multiple startup accounts.</span>
            </button>
          </div>

          <Button
            type="button"
            onClick={handleContinue}
            disabled={!role}
            className="w-full rounded-lg h-11 font-semibold mb-6"
          >
            Continue
          </Button>

          <div className="pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
