import { useEffect, useRef } from 'react';

export const useScrollAnimation = () => {
  const registered = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let ScrollTrigger: any;
    let gsap: any;

    const initGSAP = async () => {
      if (registered.current) return;
      const gsapModule = await import('gsap');
      const ScrollTriggerModule = await import('gsap/ScrollTrigger');
      gsap = gsapModule.gsap;
      ScrollTrigger = ScrollTriggerModule.ScrollTrigger;
      
      gsap.registerPlugin(ScrollTrigger);
      registered.current = true;

      // Parallax Hero
      gsap.to('.hero-parallax', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // Word Reveal Hero
      gsap.from('.word-inline', {
        y: '100%',
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out',
        delay: 0.2
      });
      gsap.from('.hero-fade', { opacity: 0, y: 30, duration: 1, delay: 1 });

      // Intro scrub
      gsap.from('.intro-word', {
        opacity: 0.2,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.intro-section',
          start: 'top 70%',
          end: 'center 40%',
          scrub: true
        }
      });

      // Tilt + Scale on Showcase
      gsap.utils.toArray('.showcase-card').forEach((card: any) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: { trigger: card, start: 'top 85%' }
        });
      });

      // Counters
      gsap.utils.toArray('.stat-counter').forEach((counter: any) => {
        const target = parseFloat(counter.getAttribute('data-target') || '0');
        gsap.fromTo(counter, 
          { textContent: 0 },
          { 
            textContent: target, 
            duration: 2, 
            snap: { textContent: 1 }, 
            scrollTrigger: { trigger: counter, start: 'top 80%' } 
          }
        );
      });

      // Clip Path Reveal (Gallery)
      gsap.utils.toArray('.gallery-img').forEach((img: any) => {
        gsap.fromTo(img, 
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: img, start: 'top 85%' } }
        );
      });
    };

    initGSAP();

    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((t: any) => t.kill());
      }
    };
  }, []);
};
