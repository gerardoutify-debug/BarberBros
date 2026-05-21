import { Suspense } from 'react';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = { title: 'Crear Cuenta · BarberBros' };

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#0a0c0f] text-[#f0ede8] flex items-center justify-center py-20">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-display text-[#c9a96e] block mb-2">BarberBros</Link>
          <p className="text-[#f0ede8]/50 text-sm">Crea tu cuenta</p>
        </div>
        <div className="bg-[#0f1215] border border-[#c9a96e]/15 rounded-2xl p-8">
          <Suspense fallback={null}>
            <RegisterForm />
          </Suspense>
          <p className="text-center text-sm text-[#f0ede8]/50 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#c9a96e] hover:underline">Ingresar</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
