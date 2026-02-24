import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
  Platform: [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'For Enterprises', href: '#for-enterprises' },
    { label: 'For Startups', href: '#for-startups' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Contact Us', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
};

export default function FooterSection() {
  return (
    <footer className="py-16 bg-home-text-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-white font-bold text-lg">
              GCC-Startup Connect
            </Link>
          </div>
          <div>
            <h4 className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.Platform.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-white/60 hover:text-white text-sm transition">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.Company.map(({ label, href }) => (
                <li key={label}>
                  {href.startsWith('/') ? (
                    <Link to={href} className="text-white/60 hover:text-white text-sm transition">
                      {label}
                    </Link>
                  ) : (
                    <a href={href} className="text-white/60 hover:text-white text-sm transition">
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.Legal.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-white/60 hover:text-white text-sm transition">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center space-y-2">
          <p className="text-white/50 text-sm">
            Powered by CL Infotech, Altruist Technologies, Ama Global and Vekan Technologies
          </p>
          <p className="text-white/50 text-sm">© GCC-Startup Connect</p>
        </div>
      </div>
    </footer>
  );
}
