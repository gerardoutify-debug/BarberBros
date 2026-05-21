'use client';
import Image from 'next/image';

const services = [
  { name: 'Corte Clasico', price: 50, img: 'barber-cut' },
  { name: 'Ritual de Barba', price: 40, img: 'barber-beard' },
  { name: 'Royal Grooming', price: 120, img: 'barber-royal' }
];

export const RoomsShowcase = () => {
  return (
    <section className='section bg-[#0f1215]'>
      <div className='container-x'>
        <div className='flex flex-col md:flex-row items-end justify-between mb-16 gap-8'>
          <div>
            <span className='eyebrow mb-4 block'>Nuestros Servicios</span>
            <h2 className='text-[clamp(2.25rem,5vw,4.5rem)] font-display'>Arte en cada <span className='italic text-[#c9a96e]'>Detalle</span></h2>
          </div>
          <a href='/rooms' className='text-xs uppercase tracking-widest border-b border-[#c9a96e] pb-2 hover:text-[#c9a96e] transition-colors'>Ver catalogo completo</a>
        </div>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {services.map((svc, i) => (
            <div key={svc.name} className='showcase-card group relative aspect-[3/4] overflow-hidden rounded-sm cursor-pointer'>
              <Image src={'https://picsum.photos/seed/' + svc.img + '/600/800'} alt={svc.name} fill className='object-cover group-hover:scale-110 transition-transform duration-700' />
              <div className='absolute inset-0 bg-gradient-to-t from-[#0a0c0f]/90 via-transparent to-transparent' />
              <div className='absolute bottom-0 left-0 p-8 w-full'>
                <div className='flex justify-between items-end'>
                  <div>
                    <span className='text-[#c9a96e] text-[10px] uppercase tracking-widest mb-2 block'>Desde S/ {svc.price}</span>
                    <h3 className='text-2xl font-display text-[#f0ede8]'>{svc.name}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
