'use client';
export const FinalCTA = () => {
  return (
    <section className='section-lg relative overflow-hidden bg-[#c9a96e]'>
      <div className='container-narrow text-center relative z-10'>
        <h2 className='text-[clamp(2.5rem,6vw,5rem)] font-display text-[#0a0c0f] mb-8 leading-[1.05]'>Eleva tu Estilo Hoy.</h2>
        <p className='text-[#0a0c0f]/80 text-lg mb-10 max-w-lg mx-auto'>No dejes tu imagen al azar. Reserva tu espacio y vive la experiencia BarberBros.</p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <a href='/book' className='bg-[#0a0c0f] text-[#c9a96e] px-10 py-5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#0a0c0f]/90 transition-colors'>Agendar Cita</a>
          <a href='/contact' className='border border-[#0a0c0f]/20 text-[#0a0c0f] px-10 py-5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#0a0c0f]/5 transition-colors'>Contactanos</a>
        </div>
      </div>
    </section>
  );
};
