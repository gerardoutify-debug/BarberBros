'use client';
export const Footer = () => {
  return (
    <footer className='bg-[#0a0c0f] pt-24 pb-12 border-t border-[#c9a96e]/10'>
      <div className='container-x'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 mb-16'>
          <div>
            <div className='text-3xl font-display mb-6'>BarberBros</div>
            <p className='text-[#f0ede8]/50 text-sm max-w-xs'>Redefiniendo el cuidado masculino con maestria clasica y lujo contemporaneo.</p>
          </div>
          <div>
            <h4 className='text-xs uppercase tracking-widest text-[#c9a96e] mb-6 font-bold'>Navegacion</h4>
            <ul className='space-y-4 text-sm text-[#f0ede8]/70'>
              <li><a href='/rooms' className='hover:text-[#c9a96e] transition-colors'>Servicios</a></li>
              <li><a href='/about' className='hover:text-[#c9a96e] transition-colors'>Nosotros</a></li>
              <li><a href='/book' className='hover:text-[#c9a96e] transition-colors'>Reservas</a></li>
            </ul>
          </div>
          <div>
            <h4 className='text-xs uppercase tracking-widest text-[#c9a96e] mb-6 font-bold'>Contacto</h4>
            <ul className='space-y-4 text-sm text-[#f0ede8]/70'>
              <li>reservas@barberbros.com</li>
              <li>+51 999 888 777</li>
              <li>Av. Principal 123, Lima</li>
            </ul>
          </div>
        </div>
        <div className='border-t border-[#f0ede8]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#f0ede8]/40 uppercase tracking-widest'>
          <p>© 2026 BarberBros. Todos los derechos reservados.</p>
          <div className='flex gap-6'>
            <a href='#' className='hover:text-[#c9a96e]'>Terminos</a>
            <a href='#' className='hover:text-[#c9a96e]'>Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
