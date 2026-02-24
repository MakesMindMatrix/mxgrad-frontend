import { motion } from 'framer-motion';

const ITEMS = [
  {
    title: 'Private Beta Rollout',
    desc: 'Carefully onboarding selected GCCs & startups.',
  },
  {
    title: 'Enterprise-Ready Infrastructure',
    desc: 'Secure, scalable, and compliance-focused.',
  },
  {
    title: 'AI-Powered Matching Engine',
    desc: 'Built to intelligently connect innovation demand & supply.',
  },
  {
    title: 'Founding Partners Onboarding',
    desc: 'Early collaboration discussions in progress.',
  },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
