CREATE EXTENSION IF NOT EXISTS " uuid-ossp\;
CREATE EXTENSION IF NOT EXISTS \pg_trgm\;

CREATE TABLE IF NOT EXISTS room_categories (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 name TEXT NOT NULL,
 slug TEXT UNIQUE NOT NULL,
 description TEXT,
 base_price_per_night DECIMAL(10,2) NOT NULL,
 max_occupancy INTEGER NOT NULL,
 bed_type TEXT,
 size_sqm INTEGER,
 floor_level INTEGER,
 view_type TEXT,
 thumbnail_url TEXT,
 gallery_urls TEXT[],
 amenities JSONB DEFAULT '[]',
 is_active BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 category_id UUID REFERENCES room_categories(id),
 room_number TEXT UNIQUE NOT NULL,
 floor_number INTEGER,
 status TEXT CHECK (status IN ('available','occupied','maintenance','out_of_service')) DEFAULT 'available',
 notes TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seasonal_pricing (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 category_id UUID REFERENCES room_categories(id),
 name TEXT NOT NULL,
 start_date DATE NOT NULL,
 end_date DATE NOT NULL,
 price_per_night DECIMAL(10,2),
 multiplier DECIMAL(3,2),
 is_active BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
 id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 full_name TEXT,
 phone TEXT,
 nationality TEXT,
 document_type TEXT,
 document_number TEXT,
 preferences JSONB DEFAULT '{}',
 loyalty_points INTEGER DEFAULT 0,
 vip_tier TEXT CHECK (vip_tier IN ('standard','silver','gold','platinum')) DEFAULT 'standard',
 avatar_url TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservations (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 reservation_code TEXT UNIQUE,
 user_id UUID REFERENCES auth.users(id),
 room_id UUID REFERENCES rooms(id),
 category_id UUID REFERENCES room_categories(id),
 guest_full_name TEXT NOT NULL,
 guest_email TEXT NOT NULL,
 guest_phone TEXT,
 guest_document_number TEXT,
 check_in_date DATE NOT NULL,
 check_out_date DATE NOT NULL,
 check_in_time TIME DEFAULT '15:00',
 check_out_time TIME DEFAULT '11:00',
 adults INTEGER CHECK (adults >= 1),
 children INTEGER DEFAULT 0 CHECK (children >= 0),
 nights INTEGER GENERATED ALWAYS AS (check_out_date - check_in_date) STORED,
 price_per_night DECIMAL(10,2),
 subtotal DECIMAL(10,2),
 tax_rate DECIMAL(3,2) DEFAULT 0.18,
 tax_amount DECIMAL(10,2),
 total_amount DECIMAL(10,2),
 currency TEXT DEFAULT 'PEN',
 status TEXT CHECK (status IN ('pending','confirmed','checked_in','checked_out','cancelled','no_show')) DEFAULT 'pending',
 payment_status TEXT DEFAULT 'pending',
 payment_method TEXT,
 special_requests TEXT,
 internal_notes TEXT,
 extras JSONB DEFAULT '[]',
 source TEXT DEFAULT 'website',
 cancelled_at TIMESTAMPTZ,
 cancellation_reason TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),
 CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
);

CREATE TABLE IF NOT EXISTS amenities (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 name TEXT NOT NULL,
 icon TEXT,
 category TEXT,
 description TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hotel_config (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 key TEXT UNIQUE NOT NULL,
 value JSONB NOT NULL,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS room_blocks (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 room_id UUID REFERENCES rooms(id),
 start_date DATE NOT NULL,
 end_date DATE NOT NULL,
 reason TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 reservation_id UUID REFERENCES reservations(id),
 user_id UUID REFERENCES auth.users(id),
 rating INTEGER CHECK (rating BETWEEN 1 AND 5),
 comment TEXT,
 is_public BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_reservations_room ON reservations(room_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_code ON reservations(reservation_code);
CREATE INDEX IF NOT EXISTS idx_rooms_category ON rooms(category_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_seasonal_pricing_dates ON seasonal_pricing(start_date, end_date);

CREATE SEQUENCE IF NOT EXISTS reservation_code_seq START 1;

CREATE OR REPLACE FUNCTION generate_reservation_code()
RETURNS TRIGGER AS \$\$
BEGIN
 NEW.reservation_code := 'BB-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
 LPAD(NEXTVAL('reservation_code_seq')::TEXT, 5, '0');
 RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_reservation_code ON reservations;
CREATE TRIGGER set_reservation_code BEFORE INSERT ON reservations
 FOR EACH ROW EXECUTE FUNCTION generate_reservation_code();

CREATE OR REPLACE FUNCTION check_room_availability(
 p_room_id UUID, p_check_in DATE, p_check_out DATE,
 p_exclude_reservation_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS \$\$
DECLARE conflict_count INTEGER;
BEGIN
 SELECT COUNT(*) INTO conflict_count FROM reservations
 WHERE room_id = p_room_id
 AND status NOT IN ('cancelled','no_show')
 AND (p_exclude_reservation_id IS NULL OR id != p_exclude_reservation_id)
 AND check_in_date < p_check_out AND check_out_date > p_check_in;
 RETURN conflict_count = 0;
END;
\$\$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_room_price(
 p_category_id UUID, p_check_in DATE, p_check_out DATE
) RETURNS DECIMAL(10,2) AS \$\$
DECLARE base_price DECIMAL(10,2); seasonal_price DECIMAL(10,2);
BEGIN
 SELECT base_price_per_night INTO base_price FROM room_categories WHERE id = p_category_id;
 SELECT price_per_night INTO seasonal_price FROM seasonal_pricing
 WHERE category_id = p_category_id AND start_date <= p_check_in
 AND end_date >= p_check_out AND is_active = TRUE
 ORDER BY start_date DESC LIMIT 1;
 RETURN COALESCE(seasonal_price, base_price);
END;
\$\$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS \$\$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
\$\$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_room_categories_updated_at ON room_categories;
CREATE TRIGGER update_room_categories_updated_at BEFORE UPDATE ON room_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_rooms_updated_at ON rooms;
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS \$\$
BEGIN
 INSERT INTO profiles (id, full_name) VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
 RETURN NEW;
END;
\$\$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
 FOR EACH ROW EXECUTE FUNCTION handle_new_user();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select_own ON profiles;
CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS profiles_update_own ON profiles;
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS reservations_select_own ON reservations;
CREATE POLICY reservations_select_own ON reservations FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS reservations_insert_auth ON reservations;
CREATE POLICY reservations_insert_auth ON reservations FOR INSERT
 WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
DROP POLICY IF EXISTS reservations_update_own ON reservations;
CREATE POLICY reservations_update_own ON reservations FOR UPDATE
 USING (auth.uid() = user_id AND status = 'pending');

DROP POLICY IF EXISTS room_categories_select_public ON room_categories;
CREATE POLICY room_categories_select_public ON room_categories FOR SELECT USING (is_active = TRUE);
DROP POLICY IF EXISTS rooms_select_public ON rooms;
CREATE POLICY rooms_select_public ON rooms FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS amenities_select_public ON amenities;
CREATE POLICY amenities_select_public ON amenities FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS seasonal_pricing_select_public ON seasonal_pricing;
CREATE POLICY seasonal_pricing_select_public ON seasonal_pricing FOR SELECT USING (is_active = TRUE);
DROP POLICY IF EXISTS hotel_config_select_public ON hotel_config;
CREATE POLICY hotel_config_select_public ON hotel_config FOR SELECT USING (TRUE);
