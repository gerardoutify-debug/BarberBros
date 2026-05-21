'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';

const amenities = [
  { title: 'Barra Libre Premium', desc: 'Whisky, bourbon y cervezas artesanales mientras esperas.', img: 'barber-bar' },
  { title: 'Toallas Calientes', desc: 'El ritual clasico de afeitado con aromaterapia.', img: 'barber-towel' },
  { title: 'Asientos Vintage', desc: 'Sillones Belmont restaurados para maximo confort.', img: 'barber-chair' }
];

export const Amenities = () => {
  const [active, setActive] = useState(0);

  return (
    <section className='section bg-[#0a0c0f]'>
      <div className='container-x grid lg:grid-cols-2 gap-16 items-center'>
        <div>
          <span className='eyebrow block mb-6'>Amenidades</span>
          <h2 className='text-[clamp(2.25rem,5vw,4.5rem)] font-display mb-12'>La Experiencia <br/>BarberBros</h2>
          <div className='flex flex-col gap-8'>
            {amenities.map((item, i) => (
              <div key={i} className='cursor-pointer' onMouseEnter={() => setActive(i)}>
                <h3 className={'text-2xl font-display mb-2 transition-colors ' + (active === i ? 'text-[#c9a96e]' : 'text-[#f0ede8]/50')}>{item.title}</h3>
                <p className={'text-[#f0ede8]/60 max-w-md transition-opacity ' + (active === i ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden')}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='relative aspect-square lg:aspect-[4/5] overflow-hidden rounded-sm'>
          <AnimatePresence mode='wait'>
            <motion.div key={active} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className='absolute inset-0'>
              <Image src={'https://picsum.photos/seed/' + amenities[active].img + '/800/1000'} alt={amenities[active].title} fill className='object-cover' />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
