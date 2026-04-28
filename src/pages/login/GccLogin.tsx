import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GccLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated && user?.role === 'GCC') navigate('/gcc/dashboard', { replace: true });
    else if (isAuthenticated && user?.role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
  }, [isAuthenticated, user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const u = await login(email, password, '/auth/login/gcc');
      if (u?.role === 'GCC') navigate('/gcc/dashboard', { replace: true });
      else navigate('/login', { replace: true });
    } catch (err: unknown) {
      const e = err as { message?: string; code?: string };
      setError(e.message || 'Login failed');
      if (e.code === 'PENDING_APPROVAL') navigate('/pending-approval');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-home-navy to-slate-900 relative overflow-hidden flex items-center justify-center px-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-800/10 blur-[100px] pointer-events-none" />

      <div className="absolute top-4 left-4">
        <Link to="/login" className="flex items-center gap-1.5 text-white/50 hover:text-white/90 text-sm font-medium transition">
          <ArrowLeft className="w-4 h-4" />
          All portals
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase">Enterprise Portal</p>
              <h1 className="text-white text-xl font-bold">GCC Sign In</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm p-3.5">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70 text-sm">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-blue-500 rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/70 text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-blue-500 rounded-xl h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 text-white font-semibold text-sm shadow-lg"
            >
              {loading ? 'Signing in…' : 'Sign In to GCC Portal'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-2">
            <p className="text-white/50 text-sm">
              New GCC?{' '}
              <Link to="/register/form?role=GCC" className="text-blue-400 hover:text-blue-300 font-medium transition">
                Register your organization
              </Link>
            </p>
            <p className="text-white/30 text-xs">
              Registration requires admin approval before access is granted.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-white/30 hover:text-white/60 text-xs transition">
            TechCovate · Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
