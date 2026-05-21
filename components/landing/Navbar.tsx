'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Barberos', href: '#barberos' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Testimonios', href: '#testimonios' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled ? 'bg-[#0a0c0f]/85 backdrop-blur-md py-4 border-b border-[#c9a96e]/10 shadow-lg shadow-black/30' : 'bg-transparent py-6'
      )}
    >
      <div className="container-x flex items-center justify-between">
        <Link
          href="/"
          className={cn('text-2xl font-display tracking-tight transition-colors duration-300', isScrolled ? 'text-[#c9a96e]' : 'text-[#f0ede8]')}
          onClick={() => setIsOpen(false)}
        >
          BarberBros
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-xs uppercase tracking-widest text-[#f0ede8]/70 hover:text-[#c9a96e] transition-colors font-medium"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="bg-[#c9a96e] text-[#0a0c0f] px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#c9a96e]/90 transition-all shadow-lg shadow-[#c9a96e]/20"
          >
            Reservar Cita
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="md:hidden text-[#f0ede8] p-2 -mr-2"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-0 z-40 bg-[#0a0c0f]/98 backdrop-blur-lg flex flex-col">
          <div className="container-x flex items-center justify-between py-6">
            <Link href="/" className="text-2xl font-display text-[#c9a96e]" onClick={() => setIsOpen(false)}>
              BarberBros
            </Link>
            <button onClick={() => setIsOpen(false)} className="text-[#f0ede8] p-2 -mr-2" aria-label="Cerrar menú">
              <X size={24} />
            </button>
          </div>
          <nav className="container-x flex flex-col gap-8 pt-12">
            {NAV_LINKS.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-[clamp(1.75rem,7vw,2.5rem)] font-display text-[#f0ede8]/80 hover:text-[#c9a96e] transition-colors"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/book"
              onClick={() => setIsOpen(false)}
              className="mt-8 self-start bg-[#c9a96e] text-[#0a0c0f] px-10 py-4 rounded-full text-xs uppercase tracking-widest font-bold"
            >
              Reservar Cita
            </Link>
          </nav>
        </div>
      )}
    </nav>
  );
};
