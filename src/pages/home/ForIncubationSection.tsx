import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BULLETS = [
  'Register your incubation center and get verified by the TechCovate admin team',
  'Onboard your entire startup portfolio — each startup gets their own profile',
  'Admin reviews each startup before they appear on the platform',
  'Submit proposals on behalf of your startups and select the right match for each GCC requirement',
  'Track engagement and deals for all your portfolio companies in one dashboard',
];

export default function ForIncubationSection() {
  return (
    <section id="for-incubation" className="relative py-24 bg-white scroll-mt-20">
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-100/70 to-transparent pointer-events-none" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-emerald-50 border border-emerald-100 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                alt="Incubation Center"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold text-sm">IC</span>
                  </div>
                  <div>
                    <p className="font-semibold text-home-text-dark text-sm">Manage Your Portfolio</p>
                    <p className="text-home-text-dark/60 text-xs">Add startups, track approvals, connect to GCCs</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <p className="text-emerald-600 text-xs font-semibold tracking-widest uppercase mb-3">For Incubation Centers</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-home-text-dark tracking-tight mb-6">
              Amplify Your Startup Ecosystem's Impact
            </h2>
            <p className="text-lg text-home-text-dark/70 leading-relaxed mb-8">
              TechCovate gives incubation centers and accelerators a dedicated portal to manage their startup portfolio and unlock enterprise collaboration at scale.
            </p>
            <ul className="space-y-3.5 mb-10">
              {BULLETS.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-home-text-dark/85">
                  <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/register/form?role=INCUBATION"
              className="inline-flex px-6 py-3.5 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm hover:scale-[1.03]"
            >
              Register Your Center →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
