'use client';
export const Location = () => {
  return (
    <section className='section bg-[#0a0c0f]'>
      <div className='container-x grid lg:grid-cols-2 gap-12 items-center'>
        <div className='relative aspect-video lg:aspect-square bg-[#0f1215] rounded-sm overflow-hidden'>
          <div className='absolute inset-0 flex items-center justify-center text-[#f0ede8]/20 font-display text-2xl'>Mapa Interactivo</div>
        </div>
        <div className='lg:pl-12'>
          <span className='eyebrow block mb-4'>Encuentranos</span>
          <h2 className='text-[clamp(2.25rem,5vw,4.5rem)] font-display mb-8'>En el Corazon de la Ciudad</h2>
          <p className='text-[#f0ede8]/70 mb-8 max-w-md'>Ubicados en la zona mas exclusiva, con estacionamiento privado y valet parking para tu comodidad.</p>
          <div className='space-y-4 text-sm'>
            <div className='flex justify-between border-b border-[#c9a96e]/10 pb-4'>
              <span className='text-[#f0ede8]/50'>Direccion</span>
              <span className='text-right'>Av. Principal 123, Distrito Luxury<br/>Lima, Peru</span>
            </div>
            <div className='flex justify-between border-b border-[#c9a96e]/10 pb-4'>
              <span className='text-[#f0ede8]/50'>Horarios</span>
              <span className='text-right'>Mar - Sab: 10am - 9pm<br/>Dom: 10am - 4pm</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
