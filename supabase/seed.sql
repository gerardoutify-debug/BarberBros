-- Seed de servicios
INSERT INTO services (name, slug, description, category, duration_minutes, price, thumbnail_url) VALUES
  ('Corte Clasico', 'corte-clasico', 'El corte de autor que define tu estilo con precision artesanal.', 'corte', 45, 50.00, 'https://picsum.photos/seed/barber-cut/600/800'),
  ('Ritual de Barba', 'ritual-barba', 'Tratamiento premium de barba con navaja, aceites y toallas calientes.', 'barba', 30, 40.00, 'https://picsum.photos/seed/barber-beard/600/800'),
  ('Royal Grooming', 'royal-grooming', 'Corte + Barba + Tratamiento capilar. La experiencia completa BarberBros.', 'combo', 90, 120.00, 'https://picsum.photos/seed/barber-royal/600/800'),
  ('Tratamiento Capilar', 'tratamiento-capilar', 'Hidratacion profunda y revitalizacion del cuero cabelludo.', 'tratamiento', 45, 60.00, 'https://picsum.photos/seed/barber-treat/600/800'),
  ('Corte + Barba', 'corte-barba', 'La dupla perfecta para un look completo y pulido.', 'combo', 60, 80.00, 'https://picsum.photos/seed/barber-combo/600/800');

-- Seed de barberos
INSERT INTO barbers (name, slug, bio, specialties, avatar_url) VALUES
  ('Carlos Mendez', 'carlos-mendez', 'Maestro barbero con 12 anos de experiencia en tecnicas clasicas.', ARRAY['Cortes clasicos','Afeitado navaja','Fade'], 'https://picsum.photos/seed/barber-carlos/400/400'),
  ('Luis Torres', 'luis-torres', 'Especialista en estilos modernos y tratamientos capilares premium.', ARRAY['Estilos modernos','Degradados','Tratamientos'], 'https://picsum.photos/seed/barber-luis/400/400'),
  ('Miguel Rojas', 'miguel-rojas', 'Experto en barba y grooming masculino de alta gama.', ARRAY['Barba','Grooming','Skin care'], 'https://picsum.photos/seed/barber-miguel/400/400');

-- Config de la barberia
INSERT INTO shop_config (key, value) VALUES
  ('shop_info', '{"name": "BarberBros", "address": "Av. Principal 123, Miraflores", "city": "Lima, Peru", "phone": "+51 999 888 777", "email": "reservas@barberbros.com"}'),
  ('opening_hours', '{"monday": "Cerrado", "tuesday": "10:00 - 21:00", "wednesday": "10:00 - 21:00", "thursday": "10:00 - 21:00", "friday": "10:00 - 21:00", "saturday": "10:00 - 21:00", "sunday": "10:00 - 16:00"}');
