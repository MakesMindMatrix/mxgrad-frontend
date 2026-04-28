import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BULLETS = [
  'Build a detailed profile showcasing your team, product, and technology stack',
  'Browse approved GCC requirements filtered by category, industry, and budget',
  'Submit proposals with portfolio links, timelines, and supporting documents',
  'Track proposal status and manage your enterprise engagements in real-time',
];

export default function ForStartupsSection() {
  return (
    <section id="for-startups" className="relative py-24 bg-slate-100 scroll-mt-20">
      {/* Soft top gradient for continuity from previous section */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 relative rounded-2xl overflow-hidden aspect-[4/3] bg-white border border-home-text-dark/5 shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
              alt="Startup partnership"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <p className="text-home-accent text-xs font-semibold tracking-widest uppercase mb-3">For Startups</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-home-text-dark tracking-tight mb-6">
              Scale with Enterprise Partnerships
            </h2>
            <p className="text-lg text-home-text-dark/70 leading-relaxed mb-8">
              Connect with leading GCCs actively seeking innovative solutions. Showcase your capabilities and win structured, long-term engagements.
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
              to="/register/form?role=STARTUP"
              className="inline-flex px-6 py-3.5 rounded-lg font-semibold text-white bg-home-accent hover:opacity-95 transition shadow-sm hover:scale-[1.03]"
            >
              Register as Startup →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
