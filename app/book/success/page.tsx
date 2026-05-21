import Link from 'next/link';
export const metadata = { title: 'Cita Confirmada · BarberBros' };
export default function SuccessPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  return (
    <main className="min-h-screen bg-[#0a0c0f] text-[#f0ede8] flex items-center justify-center">
      <div className="container-narrow text-center py-24">
        <div className="w-20 h-20 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
        </div>
        <span className="eyebrow block mb-4">Cita Confirmada</span>
        <h1 className="text-[clamp(2rem,5vw,4rem)] font-display mb-6">Tu reserva está lista</h1>
        <p className="text-[#f0ede8]/60 mb-12 max-w-md mx-auto">Recibirás un email con los detalles de tu cita. Te esperamos.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-[#c9a96e] text-[#0a0c0f] px-10 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#c9a96e]/90 transition-colors">Volver al Inicio</Link>
          <Link href="/reservations" className="border border-[#c9a96e]/30 text-[#f0ede8] px-10 py-4 rounded-full text-xs uppercase tracking-widest font-medium hover:border-[#c9a96e]/60 transition-colors">Mis Citas</Link>
        </div>
      </div>
    </main>
  );
}
