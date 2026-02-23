import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BULLETS = [
  'Post Strategic Requirements',
  'Discover Top Innovation Partners',
  'Accelerate Innovation Cycles',
];

export default function ForEnterprisesSection() {
  return (
    <section id="for-enterprises" className="relative py-24 bg-white scroll-mt-20">
      {/* Subtle gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent via-slate-50/60 to-slate-100 pointer-events-none" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-home-text-dark tracking-tight mb-6">
              Empower Your Global Capability Center
            </h2>
            <p className="text-lg text-home-text-dark/70 leading-relaxed mb-8">
              Access a curated network of verified deep-tech startups ready to solve complex business challenges.
            </p>
            <ul className="space-y-4 mb-10">
              {BULLETS.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-home-text-dark/90">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-home-accent/10 text-home-accent flex items-center justify-center text-sm font-semibold">✔</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="inline-flex px-6 py-3.5 rounded-lg font-semibold text-white bg-home-accent hover:opacity-95 transition shadow-sm hover:scale-[1.03]"
            >
              Get Started as Enterprise
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-home-neutral border border-home-text-dark/5 shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
              alt="Enterprise innovation"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
