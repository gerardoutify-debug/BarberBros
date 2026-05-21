'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

const schema = z.object({
  full_name: z.string().min(3, 'Nombre mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export const RegisterForm = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name } },
    });
    if (authError) { setError(authError.message); setLoading(false); return; }
    router.push('/reservations');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="text-[10px] uppercase tracking-widest text-[#c9a96e] font-bold block mb-2">Nombre Completo</label>
        <input {...register('full_name')} type="text" autoComplete="name"
          className="w-full bg-[#0a0c0f] border border-[#c9a96e]/20 rounded-lg px-4 py-3 text-[#f0ede8] text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors" />
        {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name.message}</p>}
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-[#c9a96e] font-bold block mb-2">Email</label>
        <input {...register('email')} type="email" autoComplete="email"
          className="w-full bg-[#0a0c0f] border border-[#c9a96e]/20 rounded-lg px-4 py-3 text-[#f0ede8] text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors" />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-[#c9a96e] font-bold block mb-2">Contraseña</label>
        <input {...register('password')} type="password" autoComplete="new-password"
          className="w-full bg-[#0a0c0f] border border-[#c9a96e]/20 rounded-lg px-4 py-3 text-[#f0ede8] text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors" />
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </div>
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full bg-[#c9a96e] text-[#0a0c0f] py-4 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-[#c9a96e]/90 transition-colors disabled:opacity-50">
        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </button>
    </form>
  );
};
