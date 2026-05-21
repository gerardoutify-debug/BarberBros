import { Suspense } from 'react';
import { BookingFlow } from '@/components/booking/booking-flow';

export const metadata = { title: 'Reservar Cita · BarberBros', description: 'Agenda tu cita en BarberBros' };

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#0a0c0f] text-[#f0ede8] pt-24 pb-20">
      <div className="container-x">
        <div className="text-center mb-12 fade-up">
          <span className="eyebrow block mb-4">Agenda tu Cita</span>
          <h1 className="text-[clamp(2rem,5vw,4rem)] font-display">
            Reserva tu <span className="italic text-[#c9a96e]">Experiencia</span>
          </h1>
        </div>
        <Suspense fallback={<div className="text-center py-20 text-[#f0ede8]/40">Cargando...</div>}>
          <BookingFlow />
        </Suspense>
      </div>
    </main>
  );
}
