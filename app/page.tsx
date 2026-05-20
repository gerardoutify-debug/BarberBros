'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import { motion } from 'motion/react';

export default function LandingPage() {
  useScrollAnimation();

  return (
    <main className="relative w-full">
      <Navbar />
      <Hero />
      
      <section className="section-lg bg-bg">
        <div className="container-narrow text-center">
          <motion.div className="word-reveal">
            <span className="eyebrow mb-6 block">Exclusividad y Detalle</span>
            <h2 className="text-[clamp(1.625rem,4vw,3.25rem)] leading-[1.25] font-display text-balance">
              "Refinados, inmersivos y personalizados. Creamos espacios donde el tiempo se detiene y el estilo se vuelve sentimiento."
            </h2>
          </motion.div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container-x">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div>
              <span className="eyebrow mb-4 block">Nuestros Servicios</span>
              <h2 className="text-4xl md:text-6xl font-display">Un Refugio para cada <span className="italic text-primary">Momento</span></h2>
            </div>
            <a href="/rooms" className="text-xs uppercase tracking-widest border-b border-primary pb-2 hover:text-primary transition-colors">Ver todos los servicios</a>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {['Corte Clásico', 'Barba Premium', 'Royal Grooming'].map((room, i) => (
              <div key={room} className="group relative aspect-[3/4] overflow-hidden rounded-sm">
                <img 
                  src={`https://picsum.photos/seed/barber-${i}/600/800`} 
                  alt={room} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="abfolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <span className="text-primary text-xs uppercase tracking-widest mb-2 block">Desde S/ 50</span>
                  <h3 className="text-2xl font-display">{room}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="section bg-bg border-t border-primary/10">
        <div className="container-x text-center">
          <div className="font-display text-2xl mb-8">BarberBros</div>
          <p className="text-text/60 text-sm">© 2026 BarberBros. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
