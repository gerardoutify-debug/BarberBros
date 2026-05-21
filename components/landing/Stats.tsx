'use client';
export const Stats = () => {
  return (
    <section className='section-sm bg-[#0f1215] border-y border-[#c9a96e]/10'>
      <div className='container-x'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
          {[
            { label: 'Anos de Experiencia', value: '15' },
            { label: 'Barberos Elite', value: '8' },
            { label: 'Clientes Satisfechos', value: '12000' },
            { label: 'Premios Obtenidos', value: '4' }
          ].map((stat, i) => (
            <div key={i}>
              <div className='text-4xl md:text-5xl font-display text-[#c9a96e] mb-2 font-bold'><span className='stat-counter' data-target={stat.value}>0</span>+</div>
              <div className='text-[10px] uppercase tracking-widest text-[#f0ede8]/60'>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
