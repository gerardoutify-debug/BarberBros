import { useEffect, useRef } from 'react';

let gsapRegistered = false;

export const useScrollAnimation = () => {
  const killersRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const killers = killersRef.current;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      if (!gsapRegistered) {
        gsap.registerPlugin(ScrollTrigger);
        gsapRegistered = true;
      }

      // Hero parallax
      const heroTween = gsap.to('.hero-parallax', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true },
      });
      killers.push(() => { heroTween.scrollTrigger?.kill(); heroTween.kill(); });

      // Hero word reveal
      const wordTween = gsap.from('.word-inline', {
        y: '100%', opacity: 0, duration: 1.2, stagger: 0.08, ease: 'power4.out', delay: 0.3,
      });
      killers.push(() => wordTween.kill());

      const fadeTween = gsap.from('.hero-fade', { opacity: 0, y: 30, duration: 1, stagger: 0.15, delay: 1 });
      killers.push(() => fadeTween.kill());

      // Intro word scrub
      const introTween = gsap.from('.intro-word', {
        opacity: 0.15,
        stagger: 0.06,
        scrollTrigger: { trigger: '.intro-section', start: 'top 70%', end: 'center 40%', scrub: true },
      });
      killers.push(() => { introTween.scrollTrigger?.kill(); introTween.kill(); });

      // Service cards
      gsap.utils.toArray<HTMLElement>('.showcase-card').forEach((card) => {
        const t = gsap.from(card, {
          y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%' },
        });
        killers.push(() => { t.scrollTrigger?.kill(); t.kill(); });
      });

      // Stat counters
      gsap.utils.toArray<HTMLElement>('.stat-counter').forEach((el) => {
        const target = parseFloat(el.getAttribute('data-target') || '0');
        const t = gsap.fromTo(
          el,
          { textContent: 0 },
          {
            textContent: target, duration: 2.5, snap: { textContent: 1 }, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          }
        );
        killers.push(() => { t.scrollTrigger?.kill(); t.kill(); });
      });

      // Gallery clip reveal
      gsap.utils.toArray<HTMLElement>('.gallery-img').forEach((img) => {
        const t = gsap.fromTo(
          img,
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power3.inOut',
            scrollTrigger: { trigger: img, start: 'top 88%' } }
        );
        killers.push(() => { t.scrollTrigger?.kill(); t.kill(); });
      });

      // Section fade-up generic
      gsap.utils.toArray<HTMLElement>('.fade-up').forEach((el) => {
        const t = gsap.from(el, {
          y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        });
        killers.push(() => { t.scrollTrigger?.kill(); t.kill(); });
      });
    };

    init();

    return () => {
      killers.forEach((kill) => kill());
      killers.length = 0;
    };
  }, []);
};
