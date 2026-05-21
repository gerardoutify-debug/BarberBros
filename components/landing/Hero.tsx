'use client';
import Image from 'next/image';

const CLOUDINARY_HERO = 'https://res.cloudinary.com/landing-page/image/upload/v1779373844/Wide_shot_banner_image_for_202605210925_esz1sp.jpg';

export const Hero = () => {
  const title = 'Donde el Estilo Toca el Lujo';
  return (
    <section className="hero-section relative h-[100svh] w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0 hero-parallax">
        <Image
          src={CLOUDINARY_HERO}
          alt="BarberBros - Barbería de lujo en Lima"
          fill
          className="object-cover object-center"
          priority
          quality={90}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c0f]/55 via-[#0a0c0f]/30 to-[#0a0c0f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.12)_0%,transparent_65%)]" />
      </div>
      <div className="container-x relative z-10 text-center">
        <span className="eyebrow block mb-6 hero-fade">Bienvenidos a BarberBros</span>
        <h1 className="text-[clamp(2.5rem,6.5vw,6rem)] leading-[1.08] font-display mb-10 max-w-4xl mx-auto">
          {title.split(' ').map((word, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <span className="inline-block word-inline">{word}&nbsp;</span>
            </span>
          ))}
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 hero-fade">
          <a href="/book" className="bg-[#c9a96e] text-[#0a0c0f] px-10 py-5 text-xs uppercase tracking-widest font-bold hover:bg-[#d4b87a] hover:scale-105 transition-all duration-300 shadow-lg shadow-[#c9a96e]/25">
            Reservar Ahora
          </a>
          <a href="#servicios" className="border border-[#f0ede8]/30 text-[#f0ede8] px-10 py-5 text-xs uppercase tracking-widest font-medium hover:border-[#c9a96e] hover:text-[#c9a96e] transition-all duration-300">
            Ver Servicios
          </a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#f0ede8]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#f0ede8] to-transparent" />
      </div>
    </section>
  );
};