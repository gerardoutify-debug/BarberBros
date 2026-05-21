'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export const LoginForm = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/reservations';

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error: authError } = await supabase.auth.signInWithPassword(data);
    if (authError) { setError('Email o contraseña incorrectos'); setLoading(false); return; }
    router.push(redirect);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="text-[10px] uppercase tracking-widest text-[#c9a96e] font-bold block mb-2">Email</label>
        <input {...register('email')} type="email" autoComplete="email"
          className="w-full bg-[#0a0c0f] border border-[#c9a96e]/20 rounded-lg px-4 py-3 text-[#f0ede8] text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors" />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-[#c9a96e] font-bold block mb-2">Contraseña</label>
        <input {...register('password')} type="password" autoComplete="current-password"
          className="w-full bg-[#0a0c0f] border border-[#c9a96e]/20 rounded-lg px-4 py-3 text-[#f0ede8] text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors" />
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </div>
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full bg-[#c9a96e] text-[#0a0c0f] py-4 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-[#c9a96e]/90 transition-colors disabled:opacity-50">
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  );
};
