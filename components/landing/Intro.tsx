'use client';
export const Intro = () => {
  const phrase = 'La barberia no es solo un corte, es un ritual. Redefinimos la masculinidad combinando tecnicas clasicas con una atmosfera inmersiva de puro lujo.';
  return (
    <section className='section-lg bg-[#0a0c0f] intro-section'>
      <div className='container-narrow text-center'>
        <span className='eyebrow block mb-8'>Nuestra Filosofia</span>
        <h2 className='text-[clamp(1.625rem,4vw,3.25rem)] leading-[1.25] font-display text-balance'>
          {phrase.split(' ').map((word, i) => (
            <span key={i} className='intro-word inline-block'>{word}&nbsp;</span>
          ))}
        </h2>
      </div>
    </section>
  );
};
