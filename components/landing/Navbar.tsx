'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6', isScrolled ? 'bg-bg/80 backdrop-blur-md py-4 border-b border-primary/10' : 'bg-transparent')}>
      <div className="container-x flex items-center justify-between">
        <Link href="/" className="text-2xl font-display tracking-tight text-text">
          Barber<span className="text-primary font-light">Bros</span>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          {['Servicios', 'Barberos', 'Galería'].map((item) => (
            <Link key={item} href="#" className="text-xs uppercase tracking-widest text-text/80 hover:text-primary transition-colors font-medium">{item}</Link>
          ))}
          <Link href="/book" className="bg-primary text-bg/90 px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-primary/transition-all shadow-lg shadow-primary/20">
            Reservar Cita
          </Link>
        </div>
        <button className="md:hidden text-text" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};
