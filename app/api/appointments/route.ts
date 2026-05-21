import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendAppointmentEmail } from '@/lib/email/brevo';

const schema = z.object({
  service_id: z.string().uuid(),
  barber_id: z.string().uuid().optional(),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointment_time: z.string().regex(/^\d{2}:\d{2}$/),
  guest_full_name: z.string().min(3, 'Nombre mínimo 3 caracteres'),
  guest_email: z.string().email('Email inválido'),
  guest_phone: z.string().optional(),
  notes: z.string().max(500).optional(),
});

function generateCode() {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `BB-${year}-${rand}`;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten() }, { status: 422 });
  }

  const data = parsed.data;
  const supabase = createAdminClient();

  const { data: service } = await supabase
    .from('services')
    .select('id, name, price, duration_minutes, is_active')
    .eq('id', data.service_id)
    .single();

  if (!service || !service.is_active) {
    return NextResponse.json({ error: 'Servicio no disponible' }, { status: 409 });
  }

  const { count } = await supabase
    .from('appointments')
    .select('id', { count: 'exact', head: true })
    .eq('appointment_date', data.appointment_date)
    .eq('appointment_time', data.appointment_time)
    .eq('barber_id', data.barber_id || null)
    .not('status', 'in', '("cancelled","no_show")');

  if ((count || 0) > 0) {
    return NextResponse.json({ error: 'Este horario ya no está disponible' }, { status: 409 });
  }

  const appointment_code = generateCode();

  const { data: appointment, error: insertError } = await supabase
    .from('appointments')
    .insert({
      appointment_code,
      service_id: data.service_id,
      barber_id: data.barber_id || null,
      appointment_date: data.appointment_date,
      appointment_time: data.appointment_time,
      duration_minutes: service.duration_minutes,
      price: service.price,
      guest_full_name: data.guest_full_name,
      guest_email: data.guest_email,
      guest_phone: data.guest_phone || null,
      notes: data.notes || null,
      status: 'confirmed',
      payment_status: 'pending',
    })
    .select()
    .single();

  if (insertError || !appointment) {
    console.error('[appointments] Insert error:', insertError);
    return NextResponse.json({ error: 'Error al crear la cita' }, { status: 500 });
  }

  sendAppointmentEmail({ ...appointment, service_name: service.name }).catch(console.error);

  return NextResponse.json({ ok: true, appointment_code, id: appointment.id, price: service.price });
}
