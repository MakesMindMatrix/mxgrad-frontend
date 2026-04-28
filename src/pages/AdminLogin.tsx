import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated && user?.role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  if (authLoading || (isAuthenticated && user?.role === 'ADMIN')) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const u = await login(email, password, '/auth/login/admin');
      if (u?.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('Access denied. Admin credentials required.');
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center px-4">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-slate-700/20 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-7 h-7 text-slate-300" />
            </div>
            <h1 className="text-white text-xl font-bold">Administration</h1>
            <p className="text-slate-500 text-sm mt-1">Restricted access portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 text-center">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-400 text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="admin@techcovate.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/[0.04] border-white/10 text-white placeholder:text-slate-600 focus:border-slate-500 rounded-xl h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-400 text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/[0.04] border-white/10 text-white placeholder:text-slate-600 focus:border-slate-500 rounded-xl h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm border border-white/10 transition mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Authenticating…
                </span>
              ) : 'Access Panel'}
            </Button>
          </form>

          <p className="text-center text-slate-700 text-xs mt-6">
            TechCovate · Administration
          </p>
        </div>
      </motion.div>
    </div>
  );
}
