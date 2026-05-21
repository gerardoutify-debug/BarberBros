-- BarberBros - Schema inicial

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Servicios de barberia
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'corte' CHECK (category IN ('corte','barba','tratamiento','combo')),
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price DECIMAL(10,2) NOT NULL,
  thumbnail_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Barberos del equipo
CREATE TABLE barbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  specialties TEXT[],
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Perfiles de usuario (extiende auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  document_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Citas (reservas de barberia)
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  service_id UUID REFERENCES services(id) NOT NULL,
  barber_id UUID REFERENCES barbers(id),
  guest_full_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending','confirmed','completed','cancelled','no_show')),
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Config de la barberia
CREATE TABLE shop_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- Indices
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_barber ON appointments(barber_id);
CREATE INDEX idx_appointments_user ON appointments(user_id);
CREATE INDEX idx_appointments_status ON appointments(status);

-- updated_at automatico
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $func$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$func$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_services BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_appointments BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-crear profile al registrarse
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $func$
BEGIN
  INSERT INTO profiles (id, full_name) VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS
ALTER TABLE profiles, appointments, services, barbers, shop_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY services_public ON services FOR SELECT USING (is_active = TRUE);
CREATE POLICY barbers_public ON barbers FOR SELECT USING (is_active = TRUE);
CREATE POLICY shop_config_public ON shop_config FOR SELECT USING (TRUE);

CREATE POLICY profiles_own_select ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_own_update ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY appointments_own_select ON appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY appointments_insert ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
