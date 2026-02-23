import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-24 bg-home-navy">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto px-4 sm:px-6 text-center"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
          Ready to Redefine Enterprise Innovation?
        </h2>
        <p className="text-lg text-white/80 leading-relaxed mb-10">
          Join the platform connecting global capability centers with the next generation of deep-tech startups.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex px-8 py-3.5 rounded-lg font-semibold text-white bg-home-accent hover:opacity-95 transition shadow-lg hover:scale-[1.03]"
          >
            Get Started
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex px-8 py-3.5 rounded-lg font-semibold text-white border border-white/30 hover:bg-white/10 transition hover:scale-[1.03]"
          >
            Schedule Demo
          </a>
        </div>
      </motion.div>
    </section>
  );
}
