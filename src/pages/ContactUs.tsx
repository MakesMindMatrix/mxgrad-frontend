import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeNavbar from '@/components/HomeNavbar';
import { Phone, Mail, MapPin } from 'lucide-react';

const CONTACT = {
  landline: '080-49748471',
  email: 'contact@mindmatrix.io',
  address: [
    'CL Infotech Pvt. Ltd.',
    '4th Floor, Kiran Arcade, #651, 13th Cross, 27th Main,',
    'Sector 1, HSR Layout,',
    'Bengaluru – 560102',
    'Karnataka, India.',
  ],
};

const POWERED_BY = 'Powered by CL Infotech, Altruist Technologies, Ama Global and Vekan Technologies';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-home-neutral font-sans">
      <HomeNavbar />

      {/* Hero strip – same vibe as home */}
      <section className="relative pt-28 pb-16 overflow-hidden bg-home-navy">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-home-accent/20 blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-white/80 max-w-2xl"
          >
            Get in touch with the GCC-Startup Connect team. We’re here to help with partnerships, demos, and platform support.
          </motion.p>
        </div>
      </section>

      {/* Contact details – relatable to home sections */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            <a
              href={`tel:${CONTACT.landline.replace(/-/g, '')}`}
              className="group flex flex-col p-6 rounded-2xl border border-home-text-dark/10 bg-home-neutral/50 hover:border-home-accent/40 hover:shadow-lg hover:shadow-home-accent/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-home-accent/10 text-home-accent flex items-center justify-center mb-4 group-hover:bg-home-accent group-hover:text-white transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-home-text-dark/60 mb-1">Landline</span>
              <span className="text-lg font-semibold text-home-text-dark">{CONTACT.landline}</span>
            </a>

            <a
              href={`mailto:${CONTACT.email}`}
              className="group flex flex-col p-6 rounded-2xl border border-home-text-dark/10 bg-home-neutral/50 hover:border-home-accent/40 hover:shadow-lg hover:shadow-home-accent/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-home-accent/10 text-home-accent flex items-center justify-center mb-4 group-hover:bg-home-accent group-hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-home-text-dark/60 mb-1">Email</span>
              <span className="text-lg font-semibold text-home-text-dark break-all">{CONTACT.email}</span>
            </a>

            <div className="sm:col-span-2 lg:col-span-1 flex flex-col p-6 rounded-2xl border border-home-text-dark/10 bg-home-neutral/50">
              <div className="w-12 h-12 rounded-xl bg-home-accent/10 text-home-accent flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-home-text-dark/60 mb-2">Address</span>
              <address className="text-home-text-dark/90 text-sm leading-relaxed not-italic">
                {CONTACT.address.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < CONTACT.address.length - 1 && <br />}
                  </span>
                ))}
              </address>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 text-center"
          >
            <Link
              to="/register"
              className="inline-flex px-8 py-3.5 rounded-lg font-semibold text-white bg-home-accent hover:opacity-95 transition shadow-lg hover:scale-[1.02]"
            >
              Get Started
            </Link>
            <span className="mx-3 text-home-text-dark/50">or</span>
            <Link
              to="/"
              className="inline-flex px-8 py-3.5 rounded-lg font-semibold text-home-text-dark border border-home-text-dark/30 hover:bg-home-text-dark/5 transition"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Powered by – same as home footer */}
      <footer className="py-10 bg-home-text-dark border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-white/50 text-sm">
            {POWERED_BY}
          </p>
          <p className="text-white/50 text-sm mt-1">© GCC-Startup Connect</p>
          <div className="mt-4">
            <Link to="/" className="text-white/60 hover:text-white text-sm transition">
              GCC-Startup Connect
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
