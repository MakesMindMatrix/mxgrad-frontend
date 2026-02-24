import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-24 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto px-4 sm:px-6 text-center"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-home-text-dark tracking-tight mb-6">
          Ready to Redefine Enterprise Innovation?
        </h2>
        <p className="text-lg text-home-text-dark/70 leading-relaxed mb-10">
          Join the platform connecting global capability centers with the next generation of deep-tech startups.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex px-8 py-3.5 rounded-lg font-semibold text-white bg-home-accent hover:opacity-95 transition shadow-lg hover:scale-[1.03]"
          >
            Get Started
          </Link>
          <Link
            to="/contact"
            className="inline-flex px-8 py-3.5 rounded-lg font-semibold text-home-text-dark border border-home-text-dark/30 hover:bg-home-text-dark/5 transition hover:scale-[1.03]"
          >
            Schedule Demo
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
