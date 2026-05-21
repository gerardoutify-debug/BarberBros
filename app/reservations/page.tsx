import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Appointment } from '@/lib/types/database';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatDate, formatPEN } from '@/lib/utils';

export const metadata = { title: 'Mis Citas · BarberBros' };

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    no_show: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  };
  const labels: Record<string, string> = { confirmed: 'Confirmada', pending: 'Pendiente', completed: 'Completada', cancelled: 'Cancelada', no_show: 'No asistió' };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border font-medium ${map[status] || map.pending}`}>
      {labels[status] || status}
    </span>
  );
}

export default async function ReservationsPage() {
  const user = await getUser();
  if (!user) redirect('/login?redirect=/reservations');

  const supabase = createAdminClient();
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, service:services(name, thumbnail_url)')
    .eq('user_id', user.id)
    .order('appointment_date', { ascending: false });

  const apts = (appointments || []) as (Appointment & { service?: { name: string; thumbnail_url: string | null } })[];
  const upcoming = apts.filter(a => a.status === 'confirmed' && a.appointment_date >= new Date().toISOString().split('T')[0]);
  const past = apts.filter(a => a.status === 'completed' || a.appointment_date < new Date().toISOString().split('T')[0]);
  const cancelled = apts.filter(a => a.status === 'cancelled' || a.status === 'no_show');

  return (
    <main className="min-h-screen bg-[#0a0c0f] text-[#f0ede8] pt-24 pb-20">
      <div className="container-x">
        <div className="mb-12">
          <span className="eyebrow block mb-3">Mi Cuenta</span>
          <h1 className="text-[clamp(2rem,5vw,4rem)] font-display">Mis Citas</h1>
        </div>

        {apts.length === 0 ? (
          <div className="text-center py-24 border border-[#c9a96e]/10 rounded-2xl">
            <p className="text-[#f0ede8]/40 mb-6 text-lg font-display">No tienes citas aún</p>
            <Link href="/book" className="bg-[#c9a96e] text-[#0a0c0f] px-10 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#c9a96e]/90 transition-colors">
              Agendar mi primera cita
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {upcoming.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-widest text-[#c9a96e] font-bold mb-6 border-b border-[#c9a96e]/10 pb-4">Próximas</h2>
                <AppointmentList apts={upcoming} />
              </section>
            )}
            {past.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-widest text-[#f0ede8]/40 font-bold mb-6 border-b border-[#f0ede8]/5 pb-4">Historial</h2>
                <AppointmentList apts={past} />
              </section>
            )}
            {cancelled.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-widest text-red-400/60 font-bold mb-6 border-b border-red-400/5 pb-4">Canceladas</h2>
                <AppointmentList apts={cancelled} />
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function AppointmentList({ apts }: { apts: (Appointment & { service?: { name: string; thumbnail_url: string | null } })[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {apts.map((apt) => (
        <div key={apt.id} className="bg-[#0f1215] border border-[#c9a96e]/10 rounded-xl p-6 hover:border-[#c9a96e]/25 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-display text-lg text-[#f0ede8]">{apt.service?.name || 'Servicio'}</p>
              <p className="text-[#c9a96e] font-mono text-xs mt-1">{apt.appointment_code}</p>
            </div>
            <StatusBadge status={apt.status} />
          </div>
          <div className="space-y-2 text-sm text-[#f0ede8]/60 mb-5">
            <p>{formatDate(apt.appointment_date)}</p>
            <p>{apt.appointment_time} hrs</p>
          </div>
          <div className="flex items-center justify-between border-t border-[#c9a96e]/10 pt-4">
            <span className="text-[#c9a96e] font-bold text-lg">{formatPEN(apt.price)}</span>
            <Link href={`/book?code=${apt.appointment_code}`} className="text-xs uppercase tracking-widest text-[#f0ede8]/50 hover:text-[#c9a96e] transition-colors">
              Ver detalles →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
