import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Lightbulb, FlaskConical, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

type Role = 'GCC' | 'STARTUP' | 'INCUBATION';

const OPTIONS: { role: Role; label: string; tagline: string; icon: React.ElementType; desc: string; gradient: string; border: string; tag: string }[] = [
  {
    role: 'GCC',
    label: 'Enterprise / GCC',
    tagline: 'Global Capability Centers & Corporate Innovation',
    icon: Building2,
    desc: 'Register your GCC to post innovation requirements, discover verified startups, and manage collaborative projects.',
    gradient: 'from-blue-500/20 to-blue-700/10',
    border: 'border-blue-500/20 hover:border-blue-500/60',
    tag: 'bg-blue-500/10 text-blue-400',
  },
  {
    role: 'STARTUP',
    label: 'Startup',
    tagline: 'Tech Startups & Innovation Companies',
    icon: Lightbulb,
    desc: 'Register your startup to browse GCC opportunities, submit proposals, and build lasting enterprise partnerships.',
    gradient: 'from-violet-500/20 to-purple-700/10',
    border: 'border-violet-500/20 hover:border-violet-500/60',
    tag: 'bg-violet-500/10 text-violet-400',
  },
  {
    role: 'INCUBATION',
    label: 'Incubation Center',
    tagline: 'Incubators, Accelerators & Startup Ecosystems',
    icon: FlaskConical,
    desc: 'Register your incubation center to manage your startup portfolio and connect them to GCC collaboration opportunities.',
    gradient: 'from-emerald-500/20 to-teal-700/10',
    border: 'border-emerald-500/20 hover:border-emerald-500/60',
    tag: 'bg-emerald-500/10 text-emerald-400',
  },
];

export default function Register() {
  const [selected, setSelected] = useState<Role | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-home-navy relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-home-accent/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="register-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#register-grid)" />
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
          <Link to="/login" className="text-white/60 hover:text-white text-sm font-medium transition">
            Already registered? Sign in →
          </Link>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <p className="text-home-accent text-xs font-semibold tracking-widest uppercase mb-3">Create Account</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
              Choose Your Account Type
            </h1>
            <p className="text-white/55 text-base max-w-lg mx-auto">
              Select the category that best describes your organization. All registrations are reviewed by our admin team before access is granted.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl w-full">
            {OPTIONS.map((opt, i) => {
              const Icon = opt.icon;
              const isSelected = selected === opt.role;
              return (
                <motion.button
                  key={opt.role}
                  type="button"
                  onClick={() => setSelected(opt.role)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className={`text-left rounded-2xl border bg-gradient-to-br ${opt.gradient} p-6 transition-all duration-200 ${opt.border} ${
                    isSelected ? 'ring-2 ring-white/30 scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mb-2 ${opt.tag}`}>
                    {opt.tagline}
                  </span>
                  <h3 className="text-white font-bold text-lg mb-2">{opt.label}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{opt.desc}</p>
                </motion.button>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <button
              type="button"
              onClick={() => { if (selected) navigate(`/register/form?role=${selected}`); }}
              disabled={!selected}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                selected
                  ? 'bg-home-accent text-white hover:opacity-90 shadow-lg hover:scale-[1.03] cursor-pointer'
                  : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
              }`}
            >
              Continue to Registration
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <p className="mt-6 text-white/25 text-xs text-center">
            Need help choosing? <Link to="/contact" className="text-white/40 hover:text-white/60 underline">Contact us</Link>
          </p>
        </main>
      </div>
    </div>
  );
}
