import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

const TRUST = ['Enterprise-verified network', 'Admin-curated approvals', 'Structured collaboration'];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-home-navy">
      {/* Ambient gradients */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-home-accent/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full bg-emerald-600/10 blur-[80px]" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(37,99,235,0.12),transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-home-accent animate-pulse" />
            <span className="text-white/80 text-xs font-semibold tracking-wider uppercase">India's GCC · Startup · Incubation Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
          >
            Where Global Enterprises Meet{' '}
            <span className="text-home-accent">Startup Innovation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg sm:text-xl text-white/75 leading-relaxed mb-8 max-w-xl"
          >
            TechCovate bridges Global Capability Centers, innovative startups, and incubation ecosystems — enabling structured, verified, and meaningful collaboration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-home-accent hover:opacity-95 transition shadow-lg hover:scale-[1.03]"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white border border-white/25 hover:bg-white/10 transition hover:scale-[1.03]"
            >
              How It Works
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-6 text-sm text-white/60"
          >
            {TRUST.map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="text-home-accent font-bold">✓</span> {item}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right panel — role cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="hidden lg:flex flex-col gap-4"
        >
          {[
            { label: 'Enterprise / GCC', desc: 'Post innovation requirements & discover startups', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', dot: 'bg-blue-400', path: '/login/gcc' },
            { label: 'Startup', desc: 'Explore curated requirements & submit proposals', color: 'from-violet-500/20 to-purple-600/10', border: 'border-violet-500/30', dot: 'bg-violet-400', path: '/login/startup' },
            { label: 'Incubation Center', desc: 'Manage your startup portfolio & connect to GCCs', color: 'from-emerald-500/20 to-teal-600/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400', path: '/login/incubation' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`flex items-center gap-4 rounded-xl border ${card.border} bg-gradient-to-r ${card.color} backdrop-blur-sm p-4 group cursor-pointer hover:border-opacity-60 transition-all`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${card.dot} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{card.label}</p>
                <p className="text-white/55 text-xs mt-0.5">{card.desc}</p>
              </div>
              <Link to={card.path} className="text-white/40 group-hover:text-white/80 transition text-xs font-medium flex items-center gap-1">
                Sign In <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="mt-2 p-4 rounded-xl border border-white/10 bg-white/[0.03]"
          >
            <p className="text-white/40 text-xs text-center">
              All users are verified by the TechCovate admin team before platform access is granted.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.button
          type="button"
          onClick={() => document.getElementById('for-enterprises')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to next section"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/10 hover:border-white/50 transition-colors"
        >
          <ChevronDown className="w-5 h-5 text-white/70" />
        </motion.button>
      </motion.div>
    </section>
  );
}
