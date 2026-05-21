'use client';
import Image from 'next/image';

const SPRAY = 'https://res.cloudinary.com/landing-page/image/upload/v1779375482/Sin_t%C3%ADtulo_-_21_de_mayo_de_2026_a_las_09.56.18_l1qatx.png';

export const Intro = () => {
  return (
    <section className="section-lg bg-[#0a0c0f] intro-section overflow-hidden">
      <div className="container-x">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* LEFT — Spray can */}
          <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-auto">
            <Image
              src={SPRAY}
              alt="BarberBros — Spray Premium"
              width={300}
              height={450}
              className="w-[200px] sm:w-[240px] lg:w-[280px] h-auto drop-shadow-[0_24px_56px_rgba(201,169,110,0.35)] select-none"
              quality={95}
            />
          </div>

          {/* RIGHT — Texto */}
          <div className="flex flex-col items-start text-left max-w-xl">
            <span className="eyebrow mb-6">Nuestra Filosofía</span>
            <h2 className="text-[clamp(1.75rem,3.8vw,3.2rem)] leading-[1.22] font-display mb-6">
              La barbería no es solo un corte,{' '}
              <em className="text-[#c9a96e] not-italic">es un ritual.</em>
            </h2>
            <p className="text-[#9a9490] text-base leading-relaxed mb-4">
              Redefinimos la masculinidad combinando técnicas clásicas con una atmósfera inmersiva de puro lujo. Cada visita es una experiencia diseñada al detalle.
            </p>
            <p className="text-[#9a9490] text-base leading-relaxed mb-10">
              Nuestros maestros barberos dominan el arte del grooming con precisión quirúrgica — desde el corte perfectamente ejecutado hasta el ritual de barba con navaja clásica.
            </p>
            <div className="flex items-center gap-6">
              <div className="h-px w-12 bg-[#c9a96e]/50" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#c9a96e]/70">Miraflores · Lima</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};