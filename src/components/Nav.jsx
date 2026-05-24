import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, ZapOff } from 'lucide-react';

const LOGO_SRC = `${import.meta.env.BASE_URL}images/logo.png`;

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop Decks' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/brackets', label: 'Brackets' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav({ animationsEnabled, setAnimationsEnabled }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#020817]/95 backdrop-blur-xl shadow-2xl shadow-black/50' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={LOGO_SRC}
              alt="Lotus Pro Decks"
              className="h-16 w-auto object-contain group-hover:opacity-90 transition-opacity drop-shadow-lg"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAnimationsEnabled(v => !v)}
              title={animationsEnabled ? 'Disable animations' : 'Enable animations'}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200
                border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5"
            >
              {animationsEnabled ? <Zap size={13} className="text-yellow-400" /> : <ZapOff size={13} />}
              <span className="hidden xl:block">{animationsEnabled ? 'Animations On' : 'Animations Off'}</span>
            </button>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-blue-600 to-purple-600 text-white
                hover:from-blue-500 hover:to-purple-500 transition-all duration-200
                shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              Shop Decks
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="relative w-72 h-full bg-[#0a0e1a] border-r border-white/10 flex flex-col p-6 pt-24">
              <div className="flex flex-col gap-1">
                {links.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      location.pathname === link.to
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-3">
                <Link to="/shop" className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold
                  bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  Shop Decks
                </Link>
                <button
                  onClick={() => setAnimationsEnabled(v => !v)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm
                    border border-white/10 text-gray-400 hover:text-white"
                >
                  {animationsEnabled ? <Zap size={14} className="text-yellow-400" /> : <ZapOff size={14} />}
                  {animationsEnabled ? 'Animations On' : 'Animations Off'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
