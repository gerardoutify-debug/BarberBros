'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const testimonials = [
  { text: 'El mejor corte que he tenido.', author: 'Carlos M.' },
  { text: 'Un ritual de relajacion.', author: 'Luis F.' }
];

export const Testimonials = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIdx((p) => (p + 1) % testimonials.length), 5500);
    return () => clearInterval(timer);
  }, []);
  return (
    <section className='section-lg bg-[#0f1215]'>
      <div className='container-narrow text-center'>
        <p className='text-4xl font-display'>{testimonials[idx].text}</p>
        <p className='text-[#c9a96e] mt-4'>{testimonials[idx].author}</p>
      </div>
    </section>
  );
};
