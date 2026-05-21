'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Scissors, ArrowRight } from 'lucide-react';

export const BookingWidget = () => {
  const router = useRouter();
  const [date, setDate] = useState('');
  
  return (
    <div className='container-x relative z-30 hero-fade -mt-16'>
      <div className='bg-[#0f1215]/90 backdrop-blur-xl border border-[#c9a96e]/20 p-8 rounded-2xl shadow-2xl flex flex-col lg:flex-row items-center gap-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 w-full'>
          <div className='flex flex-col gap-3'>
            <label className='text-[10px] uppercase tracking-widest text-[#c9a96e] font-bold'>Fecha</label>
            <div className='relative'>
              <Calendar className='absolute left-0 top-1/2 -translate-y-1/2 text-[#c9a96e]/60' size={18} />
              <input type='date' className='bg-transparent border-none text-[#f0ede8] focus:ring-0 pl-8 w-full font-medium' onChange={e => setDate(e.target.value)} />
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <label className='text-[10px] uppercase tracking-widest text-[#c9a96e] font-bold'>Servicio</label>
            <div className='relative'>
              <Scissors className='absolute left-0 top-1/2 -translate-y-1/2 text-[#c9a96e]/60' size={18} />
              <select className='bg-transparent border-none text-[#f0ede8] focus:ring-0 pl-8 w-full font-medium appearance-none'>
                <option value='corte'>Corte Premium</option>
                <option value='barba'>Barba Spa</option>
              </select>
            </div>
          </div>
        </div>
        <button onClick={() => router.push('/book?date=' + date)} className='bg-[#c9a96e] text-[#0a0c0f] px-12 py-5 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[#c9a96e]/90 transition-all w-full lg:w-auto justify-center'>
          Ver Disponibilidad <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
