'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6', isScrolled ? 'bg-[#0a0c0f]/80 backdrop-blur-md py-4 border-b border-[#c9a96e]/10' : 'bg-transparent')}>
      <div className='container-x flex items-center justify-between'>
        <Link href='/' className={cn('text-2xl font-display tracking-tight transition-colors', isScrolled ? 'text-[#c9a96e]' : 'text-[#f0ede8]')}>
          BarberBros
        </Link>
        <div className='hidden md:flex items-center gap-10'>
          {['Servicios', 'Barberos', 'Galeria', 'Testimonios'].map((item) => (
            <Link key={item} href={'#' + item.toLowerCase()} className='text-xs uppercase tracking-widest text-[#f0ede8]/80 hover:text-[#c9a96e] transition-colors font-medium'>{item}</Link>
          ))}
          <Link href='/book' className='bg-[#c9a96e] text-[#0a0c0f] px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#c9a96e]/90 transition-all shadow-lg shadow-[#c9a96e]/20'>
            Reservar Cita
          </Link>
        </div>
      </div>
    </nav>
  );
};
