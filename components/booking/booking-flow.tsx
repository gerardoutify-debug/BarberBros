'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import type { AvailabilitySlot } from '@/lib/types/database';

const SERVICES = [
  { id: 'svc-corte', name: 'Corte Clasico', slug: 'corte-clasico', description: 'El corte de autor que define tu estilo.', category: 'corte', duration_minutes: 45, price: 50, thumbnail_url: 'https://picsum.photos/seed/barber-cut/600/800', is_active: true, created_at: '', updated_at: '' },
  { id: 'svc-barba', name: 'Ritual de Barba', slug: 'ritual-barba', description: 'Tratamiento premium de barba con navaja y aceites.', category: 'barba', duration_minutes: 30, price: 40, thumbnail_url: 'https://picsum.photos/seed/barber-beard/600/800', is_active: true, created_at: '', updated_at: '' },
  { id: 'svc-royal', name: 'Royal Grooming', slug: 'royal-grooming', description: 'Corte + Barba + Tratamiento capilar completo.', category: 'combo', duration_minutes: 90, price: 120, thumbnail_url: 'https://picsum.photos/seed/barber-royal/600/800', is_active: true, created_at: '', updated_at: '' },
] as const;

const guestSchema = z.object({
  guest_full_name: z.string().min(3, 'Nombre minimo 3 caracteres'),
  guest_email: z.string().email('Email invalido'),
  guest_phone: z.string().optional(),
  notes: z.string().max(500).optional(),
});
type GuestData = z.infer<typeof guestSchema>;

const STEPS = ['Servicio', 'Fecha y Hora', 'Confirmar'];

export const BookingFlow = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<(typeof SERVICES)[number] | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<GuestData>({ resolver: zodResolver(guestSchema) });

  useEffect(() => {
    if (selectedService && selectedDate) {
      setLoadingSlots(true);
      setSelectedTime('');
      fetch('/api/availability?date=' + selectedDate + '&service_id=' + selectedService.id)
        .then(r => r.json())
        .then(data => setSlots(data.slots || []))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedService, selectedDate]);

  const minDate = new Date().toISOString().split('T')[0];

  const onSubmit = async (guestData: GuestData) => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    setSubmitting(true); setSubmitError('');
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_id: selectedService.id, appointment_date: selectedDate, appointment_time: selectedTime, ...guestData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear la cita');
      router.push('/book/success?code=' + data.appointment_code);
    } catch (e) {
      setSubmitError((e as Error).message);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
      <div>
        <div className="flex items-center mb-10 gap-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <button onClick={() => i < step && setStep(i)} disabled={i > step} className="flex items-center gap-2 shrink-0">
                <span className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors',
                  i < step ? 'bg-[#c9a96e] border-[#c9a96e] text-[#0a0c0f]' :
                  i === step ? 'border-[#c9a96e] text-[#c9a96e] bg-[#c9a96e]/10' :
                  'border-white/15 text-white/25'
                )}>{i < step ? '✓' : i + 1}</span>
                <span className={cn('text-xs uppercase tracking-widest hidden sm:block',
                  i === step ? 'text-[#c9a96e]' : i < step ? 'text-white/60' : 'text-white/25'
                )}>{s}</span>
              </button>
              {i < STEPS.length - 1 && <div className={cn('flex-1 h-px mx-3 min-w-4', i < step ? 'bg-[#c9a96e]/40' : 'bg-white/5')} />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div>
            <h2 className="text-2xl font-display mb-8">Elige tu Servicio</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((svc) => (
                <button key={svc.id} onClick={() => { setSelectedService(svc); setStep(1); }}
                  className={cn('relative aspect-[3/4] overflow-hidden rounded-xl text-left group transition-all',
                    selectedService?.id === svc.id ? 'ring-2 ring-[#c9a96e]' : 'hover:ring-1 hover:ring-[#c9a96e]/40')}>
                  <Image src={svc.thumbnail_url} alt={svc.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0f]/95 via-[#0a0c0f]/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-[#c9a96e] text-[10px] uppercase tracking-widest block mb-1">{svc.duration_minutes} min · S/ {svc.price}</span>
                    <h3 className="text-xl font-display text-white">{svc.name}</h3>
                    <p className="text-white/60 text-xs mt-2">{svc.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-display mb-8">Elige Fecha y Hora</h2>
            <div className="mb-8">
              <label className="text-[10px] uppercase tracking-widest text-[#c9a96e] font-bold block mb-3">Fecha</label>
              <input type="date" min={minDate} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[#0f1215] border border-[#c9a96e]/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors w-full max-w-xs" />
            </div>
            {selectedDate && (
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#c9a96e] font-bold block mb-4">Horarios Disponibles</label>
                {loadingSlots ? <p className="text-white/40 text-sm py-4">Verificando...</p> : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {slots.map((slot) => (
                      <button key={slot.time} disabled={!slot.available} onClick={() => setSelectedTime(slot.time)}
                        className={cn('py-2 px-3 rounded-lg text-xs font-mono border transition-all',
                          !slot.available ? 'border-white/5 text-white/15 cursor-not-allowed' :
                          selectedTime === slot.time ? 'bg-[#c9a96e] border-[#c9a96e] text-[#0a0c0f] font-bold' :
                          'border-[#c9a96e]/20 text-white/70 hover:border-[#c9a96e]/50')}>
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-4 mt-10">
              <button onClick={() => setStep(0)} className="border border-white/20 text-white/60 px-8 py-3 rounded-full text-xs uppercase tracking-widest">Atras</button>
              <button disabled={!selectedDate || !selectedTime} onClick={() => setStep(2)}
                className="bg-[#c9a96e] text-[#0a0c0f] px-10 py-3 rounded-full text-xs uppercase tracking-widest font-bold disabled:opacity-40">
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-2xl font-display mb-8">Tus Datos</h2>
            <div className="space-y-5 max-w-md">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#c9a96e] font-bold block mb-2">Nombre Completo *</label>
                <input {...register('guest_full_name')} type="text" className="w-full bg-[#0f1215] border border-[#c9a96e]/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors" />
                {errors.guest_full_name && <p className="text-red-400 text-xs mt-1">{errors.guest_full_name.message}</p>}
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#c9a96e] font-bold block mb-2">Email *</label>
                <input {...register('guest_email')} type="email" className="w-full bg-[#0f1215] border border-[#c9a96e]/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors" />
                {errors.guest_email && <p className="text-red-400 text-xs mt-1">{errors.guest_email.message}</p>}
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#c9a96e] font-bold block mb-2">Telefono</label>
                <input {...register('guest_phone')} type="tel" className="w-full bg-[#0f1215] border border-[#c9a96e]/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#c9a96e] font-bold block mb-2">Notas</label>
                <textarea {...register('notes')} rows={3} className="w-full bg-[#0f1215] border border-[#c9a96e]/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors resize-none" />
              </div>
            </div>
            {submitError && <p className="text-red-400 text-sm mt-4">{submitError}</p>}
            <div className="flex gap-4 mt-8">
              <button type="button" onClick={() => setStep(1)} className="border border-white/20 text-white/60 px-8 py-3 rounded-full text-xs uppercase tracking-widest">Atras</button>
              <button type="submit" disabled={submitting} className="bg-[#c9a96e] text-[#0a0c0f] px-10 py-3 rounded-full text-xs uppercase tracking-widest font-bold disabled:opacity-50">
                {submitting ? 'Confirmando...' : 'Confirmar Cita'}
              </button>
            </div>
          </form>
        )}
      </div>

      <aside className="sticky top-28">
        <div className="bg-[#0f1215] border border-[#c9a96e]/15 rounded-2xl p-6">
          <h3 className="text-xs uppercase tracking-widest text-[#c9a96e] font-bold mb-5">Resumen</h3>
          {selectedService ? (
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image src={selectedService.thumbnail_url} alt={selectedService.name} fill className="object-cover" />
              </div>
              <p className="font-display text-lg">{selectedService.name}</p>
              <p className="text-white/50 text-xs">{selectedService.duration_minutes} min</p>
              {selectedDate && (
                <div className="border-t border-[#c9a96e]/10 pt-4 text-sm space-y-2">
                  <div className="flex justify-between text-white/60"><span>Fecha</span><span>{selectedDate}</span></div>
                  {selectedTime && <div className="flex justify-between text-white/60"><span>Hora</span><span>{selectedTime}</span></div>}
                </div>
              )}
              <div className="border-t border-[#c9a96e]/15 pt-4 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-white/50">Total</span>
                <span className="text-2xl font-display text-[#c9a96e] font-bold">S/ {selectedService.price}</span>
              </div>
            </div>
          ) : <p className="text-white/30 text-sm">Selecciona un servicio.</p>}
        </div>
      </aside>
    </div>
  );
};