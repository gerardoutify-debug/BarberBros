import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPEN = (amount: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date));

export const todayISO = () => new Date().toISOString().split('T')[0];

export const addDaysISO = (date: string, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};
