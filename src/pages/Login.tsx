import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthPageBackground from '@/components/AuthPageBackground';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // If already signed in, redirect to role-based dashboard (fixes admin seeing login again)
  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
      else if (user.role === 'GCC') navigate('/gcc/dashboard', { replace: true });
      else if (user.role === 'STARTUP') navigate('/startup/dashboard', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  if (authLoading || (isAuthenticated && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user?.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user?.role === 'GCC') {
        navigate('/gcc/dashboard', { replace: true });
      } else if (user?.role === 'STARTUP') {
        navigate('/startup/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Login failed';
      setError(msg);
      if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'PENDING_APPROVAL') {
        navigate('/pending-approval');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-page relative">
      <AuthPageBackground />
      <div className="w-full max-w-md page-card p-8 relative z-0 shadow-xl">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to GCC-Startup Connect</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
                id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
