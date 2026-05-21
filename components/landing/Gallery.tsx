'use client';
import Image from 'next/image';

export const Gallery = () => {
  return (
    <section className='section bg-[#0a0c0f]'>
      <div className='container-x'>
        <div className='text-center mb-16'>
          <span className='eyebrow mb-4 block'>Portafolio</span>
          <h2 className='text-[clamp(2.25rem,5vw,4.5rem)] font-display'>Nuestro Arte</h2>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={'gallery-img relative overflow-hidden rounded-sm ' + (i === 1 || i === 4 ? 'col-span-2 md:col-span-2 aspect-video md:aspect-[21/9]' : 'aspect-square')}>
              <Image src={'https://picsum.photos/seed/gallery-' + i + '/1000/1000'} alt='Gallery' fill className='object-cover hover:scale-105 transition-transform duration-700' />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
