import { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = { title: 'Ingresar · BarberBros' };

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0a0c0f] text-[#f0ede8] flex items-center justify-center py-20">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-display text-[#c9a96e] block mb-2">BarberBros</Link>
          <p className="text-[#f0ede8]/50 text-sm">Ingresa a tu cuenta</p>
        </div>
        <div className="bg-[#0f1215] border border-[#c9a96e]/15 rounded-2xl p-8">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
          <p className="text-center text-sm text-[#f0ede8]/50 mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-[#c9a96e] hover:underline">Crear cuenta</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
