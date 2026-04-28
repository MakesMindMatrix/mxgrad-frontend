import { motion } from 'framer-motion';
import { UserPlus, ShieldCheck, Search, Handshake, Building2, Lightbulb, FlaskConical } from 'lucide-react';

const STEPS = [
  {
    title: 'Register & Profile Setup',
    desc: 'GCCs, Startups, and Incubation Centers register with their details and submit for verification.',
    icon: UserPlus,
  },
  {
    title: 'Admin Verification',
    desc: 'Our admin team reviews each registration. Only verified entities gain platform access.',
    icon: ShieldCheck,
  },
  {
    title: 'Discover Opportunities',
    desc: 'GCCs post innovation requirements. Startups browse and apply. Incubators manage their portfolio.',
    icon: Search,
  },
  {
    title: 'Collaborate & Grow',
    desc: 'Approved proposals turn into active partnerships with structured milestones and tracking.',
    icon: Handshake,
  },
];

const WHO = [
  {
    icon: Building2,
    role: 'GCC / Enterprise',
    desc: 'Post innovation requirements, discover verified startups, and manage collaborations end-to-end through a dedicated dashboard.',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Lightbulb,
    role: 'Startup',
    desc: 'Explore curated GCC requirements, submit proposals with supporting material, and track your engagement status in real-time.',
    color: 'bg-violet-50 text-violet-600 border-violet-100',
    iconBg: 'bg-violet-100 text-violet-600',
  },
  {
    icon: FlaskConical,
    role: 'Incubation Center',
    desc: 'Manage your startup portfolio on TechCovate, onboard startups, and represent them in GCC collaboration opportunities.',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-20 bg-white scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-home-accent text-xs font-semibold tracking-widest uppercase mb-3">The Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-home-text-dark tracking-tight mb-4">
            How TechCovate Works
          </h2>
          <p className="text-lg text-home-text-dark/65 max-w-2xl mx-auto">
            A structured, verified pathway from registration to active enterprise-startup collaboration.
          </p>
        </motion.div>

        {/* Steps — Desktop alternating layout */}
        <div className="relative hidden md:block max-w-5xl mx-auto mb-16">
          <div
            className="absolute left-1/2 top-0 bottom-0 w-0 -translate-x-1/2 border-l-2 border-home-accent/30 pointer-events-none z-0"
            style={{ borderStyle: 'dotted' }}
            aria-hidden
          />
          <div className="relative flex flex-col gap-6">
            {STEPS.map((step, i) => {
              const isLeft = i % 2 === 0;
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="relative grid grid-cols-[1fr_auto_1fr] gap-6 items-center"
                >
                  <div className={isLeft ? 'flex justify-end' : ''}>
                    {isLeft && (
                      <motion.div
                        whileHover={{ y: -4, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                        className="w-full max-w-[340px] p-5 rounded-xl border border-home-text-dark/10 bg-white shadow-lg hover:border-home-accent/20 transition-all group"
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="w-11 h-11 rounded-xl bg-home-accent/10 flex items-center justify-center mb-3 text-home-accent group-hover:bg-home-accent/20 transition-colors">
                            <StepIcon className="w-5 h-5" />
                          </div>
                          <div className="text-home-accent text-xs font-bold tracking-wider uppercase mb-1">Step {i + 1}</div>
                          <h3 className="font-bold text-home-text-dark text-sm mb-1.5">{step.title}</h3>
                          <p className="text-home-text-dark/65 text-xs leading-relaxed">{step.desc}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div className="w-4 h-4 rounded-full bg-home-accent border-[3px] border-white shadow-md z-10 flex-shrink-0" aria-hidden />
                  <div className={!isLeft ? 'flex justify-start' : ''}>
                    {!isLeft && (
                      <motion.div
                        whileHover={{ y: -4, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                        className="w-full max-w-[340px] p-5 rounded-xl border border-home-text-dark/10 bg-white shadow-lg hover:border-home-accent/20 transition-all group"
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="w-11 h-11 rounded-xl bg-home-accent/10 flex items-center justify-center mb-3 text-home-accent group-hover:bg-home-accent/20 transition-colors">
                            <StepIcon className="w-5 h-5" />
                          </div>
                          <div className="text-home-accent text-xs font-bold tracking-wider uppercase mb-1">Step {i + 1}</div>
                          <h3 className="font-bold text-home-text-dark text-sm mb-1.5">{step.title}</h3>
                          <p className="text-home-text-dark/65 text-xs leading-relaxed">{step.desc}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Steps — Mobile */}
        <div className="md:hidden relative pl-6 mb-16">
          <div className="absolute left-[11px] top-6 bottom-6 border-l-2 border-home-accent/30" style={{ borderStyle: 'dotted' }} aria-hidden />
          {STEPS.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative flex gap-4 mb-6 last:mb-0"
              >
                <div className="absolute left-[11px] top-6 w-3 h-3 rounded-full bg-home-accent border-2 border-white shadow -translate-x-1/2 z-10" aria-hidden />
                <div className="flex-1 p-5 rounded-xl border border-home-text-dark/10 bg-white shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-home-accent/10 flex items-center justify-center flex-shrink-0 text-home-accent">
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-home-accent text-xs font-bold tracking-wider uppercase mb-0.5">Step {i + 1}</div>
                      <h3 className="font-bold text-home-text-dark mb-1">{step.title}</h3>
                      <p className="text-home-text-dark/65 text-sm">{step.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Who is it for */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl font-bold text-home-text-dark mb-2">Who Uses TechCovate?</h3>
          <p className="text-home-text-dark/60 text-sm">Three distinct stakeholders, one unified platform.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WHO.map((w, i) => {
            const Icon = w.icon;
            return (
              <motion.div
                key={w.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border p-6 ${w.color}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${w.iconBg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg mb-2">{w.role}</h4>
                <p className="text-sm leading-relaxed opacity-80">{w.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
