'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const SPRAY = 'https://res.cloudinary.com/landing-page/image/upload/v1779375482/Sin_t%C3%ADtulo_-_21_de_mayo_de_2026_a_las_09.56.18_l1qatx.png';
const PARTICLES = 8;
let _gr = false;

export const Hero = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const scrollWrap  = useRef<HTMLDivElement>(null);
  const floatWrap   = useRef<HTMLDivElement>(null);
  const glowRef     = useRef<HTMLDivElement>(null);
  const eyebrowRef  = useRef<HTMLSpanElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const metaRef     = useRef<HTMLDivElement>(null);
  const lineL       = useRef<HTMLDivElement>(null);
  const lineR       = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const particleBox = useRef<HTMLDivElement>(null);
  const killers     = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ks = killers.current;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (!_gr) { gsap.registerPlugin(ScrollTrigger); _gr = true; }

      /* ─── initial states ─────────────────────────────── */
      gsap.set(floatWrap.current,  { opacity: 0, scale: 0.72, y: 50 });
      gsap.set(glowRef.current,    { scale: 0.4, opacity: 0 });
      gsap.set(eyebrowRef.current, { opacity: 0, y: 18 });
      gsap.set(metaRef.current,    { opacity: 0, y: 16 });
      gsap.set(ctaRef.current,     { opacity: 0, y: 28 });
      gsap.set([lineL.current, lineR.current], { scaleX: 0 });

      const wis = titleRef.current?.querySelectorAll<HTMLElement>('.wi');
      if (wis?.length) gsap.set(wis, { y: '108%', opacity: 0 });

      const dots = particleBox.current?.querySelectorAll<HTMLElement>('.pt');
      if (dots?.length) gsap.set(dots, { opacity: 0, scale: 0 });

      /* ─── entry timeline ─────────────────────────────── */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl
        .to(glowRef.current,   { scale: 1, opacity: 1, duration: 1.8, ease: 'power2.out' }, 0)
        .to(floatWrap.current, { opacity: 1, scale: 1, y: 0, duration: 1.15, ease: 'power4.out' }, 0.1)
        .to(eyebrowRef.current,{ opacity: 1, y: 0, duration: 0.75 }, 0.55)
        .to(wis ?? [], { y: '0%', opacity: 1, stagger: 0.09, duration: 0.8, ease: 'power3.out' }, 0.7)
        .to([lineL.current, lineR.current], { scaleX: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08 }, 1.0)
        .to(metaRef.current,   { opacity: 1, y: 0, duration: 0.7 }, 1.05)
        .to(ctaRef.current,    { opacity: 1, y: 0, duration: 0.7 }, 1.18)
        .to(dots ?? [], { opacity: 1, scale: 1, stagger: 0.12, duration: 0.6, ease: 'back.out(2)' }, 1.1);

      ks.push(() => tl.kill());

      /* ─── float loop ─────────────────────────────────── */
      const fl = gsap.to(floatWrap.current, {
        y: -26, rotation: 2.2, duration: 3.1,
        ease: 'sine.inOut', yoyo: true, repeat: -1,
      });
      ks.push(() => fl.kill());

      /* ─── glow pulse ─────────────────────────────────── */
      const gl = gsap.to(glowRef.current, {
        scale: 1.22, opacity: 0.55, duration: 3.2,
        ease: 'sine.inOut', yoyo: true, repeat: -1,
      });
      ks.push(() => gl.kill());

      /* ─── particle orbits ────────────────────────────── */
      dots?.forEach((dot, i) => {
        const angle  = (i / PARTICLES) * Math.PI * 2;
        const r      = 155 + (i % 3) * 28;
        const ox     = Math.cos(angle) * r;
        const oy     = Math.sin(angle) * r;
        gsap.set(dot, { x: ox, y: oy });

        const orbit = gsap.to(dot, {
          rotation: 360, duration: 11 + i * 1.6,
          ease: 'none', repeat: -1,
          transformOrigin: `${-ox}px ${-oy}px`,
        });
        const twink = gsap.to(dot, {
          opacity: 0.08, duration: 1.2 + Math.random(),
          ease: 'sine.inOut', yoyo: true, repeat: -1,
          delay: Math.random() * 2,
        });
        ks.push(() => { orbit.kill(); twink.kill(); });
      });

      /* ─── scroll parallax ────────────────────────────── */
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top', end: 'bottom top', scrub: 1.3,
        onUpdate: ({ progress: p }) => {
          gsap.set(scrollWrap.current,  { y: p * -140 });
          gsap.set(eyebrowRef.current,  { y: p * -50,  opacity: Math.max(0, 1 - p * 2.2) });
          gsap.set(titleRef.current,    { y: p * -30,  opacity: Math.max(0, 1 - p * 2.2) });
          gsap.set(metaRef.current,     { y: p * -20,  opacity: Math.max(0, 1 - p * 2.5) });
          gsap.set(ctaRef.current,      { y: p * 40,   opacity: Math.max(0, 1 - p * 2.5) });
        },
      });
      ks.push(() => st.kill());
    };

    init();
    return () => { ks.forEach(k => k()); ks.length = 0; };
  }, []);

  const words = ['Arte', 'en', 'Cada', 'Detalle'];

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center bg-[#0a0c0f]"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage: 'linear-gradient(rgba(240,237,232,.9) 1px,transparent 1px),linear-gradient(90deg,rgba(240,237,232,.9) 1px,transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />

      {/* Vertical side labels */}
      <div className="absolute top-1/2 left-6 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#c9a96e]/30" />
        <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e]/35 font-medium">Est. 2024</span>
      </div>
      <div className="absolute top-1/2 right-6 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#c9a96e]/30" />
        <span style={{ writingMode: 'vertical-rl' }}
          className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e]/35 font-medium">Lima · Perú</span>
      </div>

      {/* Eyebrow */}
      <span ref={eyebrowRef} className="eyebrow relative z-10 mb-7 md:mb-10">
        Premium Grooming Experience
      </span>

      {/* Spray — scroll wrapper → float wrapper */}
      <div ref={scrollWrap} className="relative z-10 flex flex-col items-center">

        {/* Particles ring */}
        <div ref={particleBox} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {Array.from({ length: PARTICLES }).map((_, i) => (
            <div
              key={i}
              className="pt absolute w-1.5 h-1.5 rounded-full bg-[#c9a96e]"
              style={{ boxShadow: '0 0 8px 2px rgba(201,169,110,0.6)' }}
            />
          ))}
        </div>

        {/* Glow */}
        <div ref={glowRef} className="absolute pointer-events-none" style={{
          width: 480, height: 480,
          left: '50%', top: '50%',
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(ellipse 55% 70% at 50% 50%, rgba(201,169,110,0.22) 0%, rgba(201,169,110,0.06) 55%, transparent 80%)',
        }} />

        {/* Float */}
        <div ref={floatWrap} style={{ willChange: 'transform' }}>
          <Image
            src={SPRAY}
            alt="BarberBros — Spray Premium"
            width={320}
            height={480}
            className="w-[210px] sm:w-[260px] md:w-[310px] lg:w-[340px] h-auto
                       drop-shadow-[0_28px_64px_rgba(201,169,110,0.45)]
                       select-none pointer-events-none"
            priority
            quality={95}
          />
        </div>

        {/* Title */}
        <h1 ref={titleRef} className="mt-5 text-center text-[clamp(2.2rem,5.8vw,5.2rem)] font-display leading-[1.1] relative z-10">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom mx-[0.12em]">
              <span className="wi inline-block">{w}</span>
            </span>
          ))}
        </h1>

        {/* Gold line divider + location */}
        <div ref={metaRef} className="flex items-center gap-5 mt-5 w-full max-w-xs sm:max-w-sm px-4">
          <div ref={lineL} className="flex-1 h-px bg-[#c9a96e]/35 origin-left" />
          <span className="text-[9px] tracking-[0.38em] uppercase text-[#c9a96e]/60 whitespace-nowrap">Miraflores · Lima</span>
          <div ref={lineR} className="flex-1 h-px bg-[#c9a96e]/35 origin-right" />
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <Link
            href="/book"
            className="bg-[#c9a96e] text-[#0a0c0f] px-10 py-[14px] text-[10px] uppercase tracking-widest font-bold
                       hover:bg-[#d4b87a] hover:scale-105 transition-all duration-300 shadow-lg shadow-[#c9a96e]/20"
          >
            Reservar Ahora
          </Link>
          <Link
            href="#servicios"
            className="border border-[#f0ede8]/20 text-[#f0ede8]/60 px-10 py-[14px] text-[10px] uppercase tracking-widest font-medium
                       hover:border-[#c9a96e]/50 hover:text-[#c9a96e] transition-all duration-300"
          >
            Ver Servicios
          </Link>
        </div>
      </div>

      {/* Scroll line */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-[6px]">
        <div className="w-px h-11 bg-gradient-to-b from-[#c9a96e]/60 to-transparent" style={{ animation: 'heroScrollPulse 2s ease-in-out infinite' }} />
        <span className="text-[8px] uppercase tracking-[0.45em] text-[#c9a96e]/45">Scroll</span>
      </div>

      <style>{`
        @keyframes heroScrollPulse {
          0%,100% { opacity:.4; transform: scaleY(1); }
          50% { opacity:1; transform: scaleY(1.15); }
        }
      `}</style>
    </section>
  );
};