import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Brand } from '@/frontend/components/Brand';

type Props = {
  onStartSimulator: () => void;
};

const NAV_LINKS = [
  { label: 'Accueil', href: '#hero' },
  { label: 'Qui sommes-nous ?', href: '#about' },
  { label: 'Ce que nous proposons', href: '#solutions' },
  { label: 'Nos engagements', href: '#engagements' },
  { label: 'Comment ça marche', href: '#process' },
];

export function Navbar({ onStartSimulator }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/60 shadow-md backdrop-blur-xl'
          : 'bg-transparent backdrop-blur-0'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className={scrolled ? 'text-brand-900' : 'text-white'}
        >
          <Brand
            iconClass={scrolled ? 'text-eco-500' : 'text-eco-400'}
            className={scrolled ? 'text-brand-900' : 'text-white'}
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? 'text-slate-600 hover:text-brand-700'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={onStartSimulator}
            className="btn-primary px-6 py-2.5 text-sm"
          >
            Tester mon éligibilité <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className={`lg:hidden ${scrolled ? 'text-brand-900' : 'text-white'}`}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div className="mx-4 mb-3 rounded-2xl bg-white p-4 shadow-card animate-fade-up">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-eco-50 hover:text-brand-700"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onStartSimulator();
                }}
                className="btn-primary mt-2 w-full px-6 py-3 text-sm"
              >
                Tester mon éligibilité <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
