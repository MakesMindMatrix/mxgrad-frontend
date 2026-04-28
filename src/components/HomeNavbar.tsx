import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'For Enterprises', href: '/#for-enterprises' },
  { label: 'For Startups', href: '/#for-startups' },
  { label: 'For Incubators', href: '/#for-incubation' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Contact Us', href: '/contact' },
];

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(11, 31, 58, 0.25)',
        boxShadow: scrolled ? '0 1px 3px 0 rgb(0 0 0 / 0.1)' : 'none',
      }}
      transition={{ duration: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 py-4"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${scrolled ? 'bg-home-accent text-white' : 'bg-white/20 text-white'}`}>
            TC
          </div>
          <span className={`font-bold text-lg ${scrolled ? 'text-home-text-dark' : 'text-white'}`}>
            TechCovate
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            href.startsWith('/') && !href.includes('#') ? (
              <Link
                key={label}
                to={href}
                className={`text-sm font-medium transition ${scrolled ? 'text-home-text-dark/80 hover:text-home-text-dark' : 'text-white/90 hover:text-white'}`}
              >
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                className={`text-sm font-medium transition ${scrolled ? 'text-home-text-dark/80 hover:text-home-text-dark' : 'text-white/90 hover:text-white'}`}
              >
                {label}
              </a>
            )
          ))}
          <Link
            to="/login"
            className={`text-sm font-medium transition ${scrolled ? 'text-home-text-dark/90 hover:text-home-text-dark' : 'text-white/90 hover:text-white'}`}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-home-accent text-white hover:opacity-95 transition shadow-sm hover:scale-[1.03]"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-2">
          <Link to="/login" className={`text-sm font-medium ${scrolled ? 'text-home-text-dark' : 'text-white'}`}>
            Sign In
          </Link>
          <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-semibold bg-home-accent text-white">
            Get Started
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(o => !o)}
            className={`p-1.5 rounded-md ${scrolled ? 'text-home-text-dark' : 'text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`md:hidden border-t ${scrolled ? 'bg-white border-gray-100' : 'bg-home-navy/95 border-white/10'} px-4 py-3 space-y-2`}>
          {NAV_LINKS.map(({ label, href }) => (
            href.startsWith('/') && !href.includes('#') ? (
              <Link key={label} to={href} onClick={() => setMobileOpen(false)}
                className={`block py-2 text-sm font-medium ${scrolled ? 'text-home-text-dark' : 'text-white/90'}`}>
                {label}
              </Link>
            ) : (
              <a key={label} href={href} onClick={() => setMobileOpen(false)}
                className={`block py-2 text-sm font-medium ${scrolled ? 'text-home-text-dark' : 'text-white/90'}`}>
                {label}
              </a>
            )
          ))}
        </div>
      )}
    </motion.header>
  );
}
