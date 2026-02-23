import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const TRUST = ['Enterprise-ready', 'Verified network', 'AI-powered discovery'];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-home-navy">
      {/* Subtle animated gradient mesh */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-home-accent/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      {/* Slow moving abstract network lines */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'hero-grid-move 20s ease-in-out infinite' }}>
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
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
          >
            Accelerate Enterprise Innovation Through Strategic GCC–Startup Collaboration
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-xl"
          >
            Connect Global Capability Centers with verified deep-tech startups. Discover. Validate. Deploy innovation faster.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-white bg-home-accent hover:opacity-95 transition shadow-lg hover:scale-[1.03]"
            >
              For Enterprises
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-white border border-white/30 hover:bg-white/10 transition hover:scale-[1.03]"
            >
              For Startups
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-6 text-sm text-white/70"
          >
            {TRUST.map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="text-home-accent">✔</span> {item}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative hidden lg:flex justify-center items-center"
        >
<motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-full max-w-lg"
        >
          <div className="absolute -inset-2 bg-home-accent/20 rounded-2xl blur-2xl" />
          <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl aspect-[4/3] max-h-[420px]">
            <img
              src="/photos/hero.jpg"
              alt="GCC-Startup collaboration"
              className="w-full h-full object-cover"
            />
          </div>
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
          className="w-10 h-10 rounded-full border-2 border-white/40 flex items-center justify-center cursor-pointer hover:bg-white/10 hover:border-white/60 transition-colors"
        >
          <ChevronDown className="w-5 h-5 text-white/80" />
        </motion.button>
      </motion.div>
    </section>
  );
}
