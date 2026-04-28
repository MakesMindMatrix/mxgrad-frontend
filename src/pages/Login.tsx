import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { Building2, Lightbulb, FlaskConical, ArrowRight, Cpu } from 'lucide-react';

const PORTALS = [
  {
    role: 'GCC',
    path: '/login/gcc',
    registerPath: '/register/form?role=GCC',
    icon: Building2,
    label: 'Enterprise / GCC',
    tagline: 'Global Capability Center Portal',
    description: 'For Global Capability Centers looking to discover and collaborate with innovative startups and incubation partners.',
    color: 'from-blue-600 to-blue-800',
    accentColor: 'bg-blue-600',
    borderColor: 'border-blue-500/30 hover:border-blue-500',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    role: 'STARTUP',
    path: '/login/startup',
    registerPath: '/register/form?role=STARTUP',
    icon: Lightbulb,
    label: 'Startup',
    tagline: 'Startup Innovation Portal',
    description: 'For startups and technology innovators seeking to partner with enterprise GCCs and access curated opportunities.',
    color: 'from-violet-600 to-purple-800',
    accentColor: 'bg-violet-600',
    borderColor: 'border-violet-500/30 hover:border-violet-500',
    badgeColor: 'bg-violet-100 text-violet-700',
  },
  {
    role: 'INCUBATION',
    path: '/login/incubation',
    registerPath: '/register/form?role=INCUBATION',
    icon: FlaskConical,
    label: 'Incubation Center',
    tagline: 'Incubator & Accelerator Portal',
    description: 'For incubation centers and accelerators managing startup portfolios and facilitating enterprise collaborations.',
    color: 'from-emerald-600 to-teal-800',
    accentColor: 'bg-emerald-600',
    borderColor: 'border-emerald-500/30 hover:border-emerald-500',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
];

export default function Login() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
      else if (user.role === 'GCC') navigate('/gcc/dashboard', { replace: true });
      else if (user.role === 'STARTUP') navigate('/startup/dashboard', { replace: true });
      else if (user.role === 'INCUBATION') navigate('/incubation/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  if (authLoading || (isAuthenticated && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-home-navy">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-home-accent/20 flex items-center justify-center animate-pulse">
            <Cpu className="w-5 h-5 text-white/80" />
          </div>
          <p className="text-white/60 text-sm">Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-home-navy relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="login-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-grid)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-home-accent flex items-center justify-center">
              <span className="text-white font-black text-xs">TC</span>
            </div>
            <span className="text-white font-bold text-lg">TechCovate</span>
          </Link>
          <Link to="/register" className="text-white/70 hover:text-white text-sm font-medium transition">
            Create account →
          </Link>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-home-accent text-sm font-semibold tracking-widest uppercase mb-4">Welcome to TechCovate</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Select Your Portal
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              TechCovate serves different stakeholders. Choose your portal to sign in or create an account.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
            {PORTALS.map((portal, i) => {
              const Icon = portal.icon;
              return (
                <motion.div
                  key={portal.role}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  className={`relative rounded-2xl border bg-white/5 backdrop-blur-sm p-7 flex flex-col gap-5 transition-all duration-300 ${portal.borderColor} group cursor-default`}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${portal.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-white/50 text-xs font-semibold tracking-wider uppercase mb-1">{portal.tagline}</p>
                    <h2 className="text-white font-bold text-xl mb-3">{portal.label}</h2>
                    <p className="text-white/60 text-sm leading-relaxed">{portal.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2.5">
                    <Link
                      to={portal.path}
                      className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${portal.color} hover:opacity-90 transition shadow-lg`}
                    >
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to={portal.registerPath}
                      className="text-center text-white/50 hover:text-white/80 text-sm transition py-1"
                    >
                      New? Create account
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-white/30 text-xs text-center"
          >
            All portals are subject to admin verification. New registrations require approval before access.
          </motion.p>
        </main>
      </div>
    </div>
  );
}
