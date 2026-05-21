import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const WORKING_HOURS = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const service_id = searchParams.get('service_id');
  const barber_id = searchParams.get('barber_id');

  if (!date || !service_id) {
    return NextResponse.json({ error: 'Faltan parámetros: date y service_id son requeridos' }, { status: 400 });
  }

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    return NextResponse.json({ error: 'La fecha no puede ser en el pasado' }, { status: 400 });
  }

  const dayOfWeek = selectedDate.getDay();
  if (dayOfWeek === 1) {
    return NextResponse.json({ slots: [], message: 'Cerrado los lunes' });
  }

  const supabase = createAdminClient();

  const { data: service } = await supabase
    .from('services')
    .select('duration_minutes')
    .eq('id', service_id)
    .single();

  if (!service) {
    return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
  }

  let query = supabase
    .from('appointments')
    .select('appointment_time, duration_minutes')
    .eq('appointment_date', date)
    .not('status', 'in', '("cancelled","no_show")');

  if (barber_id) query = query.eq('barber_id', barber_id);

  const { data: booked } = await query;

  const slots = WORKING_HOURS.map((time) => {
    const [h, m] = time.split(':').map(Number);
    const slotStart = h * 60 + m;
    const slotEnd = slotStart + (service.duration_minutes || 30);

    const isBooked = (booked || []).some((apt) => {
      const [ah, am] = apt.appointment_time.split(':').map(Number);
      const aptStart = ah * 60 + am;
      const aptEnd = aptStart + (apt.duration_minutes || 30);
      return slotStart < aptEnd && slotEnd > aptStart;
    });

    const isSundayRestricted = dayOfWeek === 0 && slotStart >= 16 * 60;

    return { time, available: !isBooked && !isSundayRestricted };
  });

  return NextResponse.json({ slots, date, service_id });
}
