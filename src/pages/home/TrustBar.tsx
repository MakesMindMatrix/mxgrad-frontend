import { motion } from 'framer-motion';

const LOGOS = [
  { name: 'Enterprise 1', w: 120 },
  { name: 'Enterprise 2', w: 100 },
  { name: 'Enterprise 3', w: 140 },
  { name: 'Enterprise 4', w: 110 },
  { name: 'Enterprise 5', w: 130 },
];

export default function TrustBar() {
  return (
    <section id="trust-bar" className="py-16 bg-white scroll-mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-medium text-home-text-dark/60 uppercase tracking-wider mb-10"
        >
          As trusted by innovation teams at
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center items-center gap-12 sm:gap-16"
        >
          {LOGOS.map((logo, i) => (
            <div
              key={logo.name}
              className="h-8 grayscale opacity-70 hover:opacity-90 transition"
              style={{ width: logo.w }}
            >
              <div className="w-full h-full rounded bg-home-text-dark/20 flex items-center justify-center text-home-text-dark/50 text-xs font-medium">
                Logo
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
