'use client';
import Image from 'next/image';

export const Hero = () => {
  const title = 'Donde el Estilo Toca el Lujo';
  return (
    <section className='hero-section relative h-[100svh] w-full overflow-hidden flex items-center justify-center'>
      <div className='absolute -inset-y-[15%] inset-x-0 z-0 hero-parallax'>
        <Image src='https://picsum.photos/seed/barber-hero/1920/1080' alt='Hero' fill className='object-cover brightness-50' priority />
        <div className='absolute inset-0 bg-gradient-to-b from-[#0a0c0f]/40 via-transparent to-[#0a0c0f]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.15)_0%,transparent_60%)]' />
      </div>
      <div className='container-x relative z-10 text-center'>
        <span className='eyebrow block mb-6 hero-fade'>Bienvenidos a BarberBros</span>
        <h1 className='text-[clamp(2.25rem,6.2vw,5.75rem)] leading-[1.08] font-display mb-10 max-w-4xl mx-auto'>
          {title.split(' ').map((word, i) => (
            <span key={i} className='inline-block overflow-hidden align-bottom'>
              <span className='inline-block word-inline'>{word}&nbsp;</span>
            </span>
          ))}
        </h1>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-6 hero-fade'>
          <a href='/book' className='bg-[#c9a96e] text-[#0a0c0f] px-10 py-5 rounded-full text-xs uppercase tracking-widest font-bold hover:scale-105 transition-transform'>Reservar Ahora</a>
        </div>
      </div>
    </section>
  );
};
