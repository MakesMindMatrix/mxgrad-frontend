import { motion } from 'framer-motion';
import { UserPlus, ShieldCheck, Search, Rocket } from 'lucide-react';

const STEPS = [
  { title: 'Create Your Profile', desc: 'Register as a GCC or Startup and build your profile.', icon: UserPlus },
  { title: 'Get Verified', desc: 'Our team reviews and verifies all profiles.', icon: ShieldCheck },
  { title: 'Discover & Connect', desc: 'GCCs post requirements, startups get discovered.', icon: Search },
  { title: 'Collaborate & Scale', desc: 'Form partnerships and execute innovative projects.', icon: Rocket },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-20 bg-white scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-home-text-dark tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg text-home-text-dark/70 max-w-xl mx-auto">
            A streamlined journey from discovery to deployment.
          </p>
        </motion.div>

        {/* Desktop/tablet: compact grid so the section fits on-screen */}
        <div className="hidden md:block">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  whileHover={{
                    y: -4,
                    scale: 1.01,
                    boxShadow: '0 18px 36px -18px rgba(11, 31, 58, 0.22), 0 0 0 1px rgba(37, 99, 235, 0.10)',
                  }}
                  className="relative rounded-2xl border border-home-text-dark/10 bg-white px-5 py-5 lg:px-4 lg:py-4 shadow-md hover:border-home-accent/20 transition-all duration-300 cursor-default group"
                >
                  <div className="absolute -top-3 left-4 rounded-full border border-home-text-dark/10 bg-white px-2 py-0.5 text-xs font-semibold text-home-text-dark/70">
                    Step {i + 1}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <div className="w-10 h-10 rounded-xl bg-home-accent/10 flex items-center justify-center mb-3 text-home-accent group-hover:bg-home-accent/20 transition-colors">
                      <step.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-home-text-dark mb-1.5">{step.title}</h3>
                    <p className="text-home-text-dark/70 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: vertical flow with dotted connector */}
        <div className="md:hidden relative pl-6">
          <div className="absolute left-[11px] top-6 bottom-6 w-0.5 border-l-2 border-home-accent/35" style={{ borderStyle: 'dotted' }} aria-hidden />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative flex gap-4 mb-6 last:mb-0"
            >
              <div className="absolute left-[11px] top-6 w-3 h-3 rounded-full bg-home-accent border-2 border-white shadow -translate-x-1/2 z-10" aria-hidden />
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="flex-1 p-5 rounded-xl border border-home-text-dark/10 bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-home-accent/10 flex items-center justify-center flex-shrink-0 text-home-accent">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-home-text-dark mb-1">{step.title}</h3>
                    <p className="text-home-text-dark/70 text-sm">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
