'use client';
import { motion } from 'motion/react';
import Image from 'next/image';

export const Hero = () => {
  return (
    <section className="hero-section relative h-[100svh] w-full overflow-hidden flex items-center justify-center">
      <div className="hero-bg absolute inset-0 z-0">
        <Image src="https://picsum.photos/seed/barber-hero/1920/1080" alt="BarberBros Hero" fill className="object-cover brightness-50" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg" />
      </div>
      <div className="container-x relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
          <span className="eyebrow block mb-6">Experiencia Premium</span>
          <h1 className="text-[clamp(2.5rem,8vw,6rem)] leading-[1.05] font-display mb-10 max-w-4xl mx-auto">
            Donde el Estilo <br /> <span className="italic text-primary">Toca el Lujo</span>
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="bg-primary text-bg px-10 py-5 rounded-full text-xs uppercase tracking-widest font-bold hover:scale-105 transition-transform">
              Ver Servicios
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
