import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'For Enterprises', href: '/#for-enterprises' },
  { label: 'For Startups', href: '/#for-startups' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Contact Us', href: '/contact' },
];

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);

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
        <Link
          to="/"
          className={scrolled ? 'text-home-text-dark font-bold text-lg' : 'text-white font-bold text-lg'}
        >
          GCC-Startup Connect
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            href.startsWith('/') ? (
              <Link
                key={label}
                to={href}
                className={scrolled ? 'text-home-text-dark/80 hover:text-home-text-dark text-sm font-medium' : 'text-white/90 hover:text-white text-sm font-medium'}
              >
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                className={scrolled ? 'text-home-text-dark/80 hover:text-home-text-dark text-sm font-medium' : 'text-white/90 hover:text-white text-sm font-medium'}
              >
                {label}
              </a>
            )
          ))}
          <Link
            to="/login"
            className={scrolled ? 'text-home-text-dark/90 hover:text-home-text-dark text-sm font-medium' : 'text-white/90 hover:text-white text-sm font-medium'}
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
        <div className="md:hidden flex items-center gap-2">
          <Link to="/login" className={scrolled ? 'text-home-text-dark text-sm font-medium' : 'text-white text-sm font-medium'}>
            Sign In
          </Link>
          <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-semibold bg-home-accent text-white">
            Get Started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
