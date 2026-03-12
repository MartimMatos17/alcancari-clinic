-- ============================================================
-- ALCANÇARI CLINIC - Database Schema
-- PostgreSQL
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS & AUTH
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'therapist', 'receptionist', 'parent')),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- THERAPISTS (extends users)
-- ============================================================
CREATE TABLE therapists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  specialty VARCHAR(255) NOT NULL, -- e.g. "Fisioterapia", "Psicologia"
  bio TEXT,
  cédula VARCHAR(50), -- Professional registration number
  unit VARCHAR(50) CHECK (unit IN ('leça_palmeira', 'são_mamede', 'both')),
  color VARCHAR(7) DEFAULT '#3B82F6', -- Calendar color
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- CHILDREN / PATIENTS
-- ============================================================
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(20),
  notes TEXT,
  parent_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- SERVICES
-- ============================================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  duration_minutes INT DEFAULT 50,
  price DECIMAL(10,2),
  icon VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO services (name, slug, description, duration_minutes) VALUES
  ('Fisioterapia', 'fisioterapia', 'Avaliação e intervenção fisioterapêutica em crianças.', 50),
  ('Acupuntura', 'acupuntura', 'Técnicas de acupuntura adaptadas para crianças e famílias.', 50),
  ('Psicologia', 'psicologia', 'Apoio psicológico individualizado para crianças e famílias.', 50),
  ('Terapia da Fala', 'terapia-fala', 'Avaliação e intervenção em comunicação e linguagem.', 50),
  ('Terapia Ocupacional', 'terapia-ocupacional', 'Promoção da autonomia e participação nas atividades de vida diária.', 50),
  ('Floortime', 'floortime', 'Abordagem de desenvolvimento baseada na relação e no jogo.', 50),
  ('Integração Sensorial', 'integracao-sensorial', 'Avaliação e intervenção em processamento sensorial.', 50),
  ('Intervenção em Grupo', 'intervencao-grupo', 'Sessões terapêuticas em formato grupal.', 60),
  ('Formação', 'formacao', 'Formações para profissionais e famílias.', 120);

-- ============================================================
-- APPOINTMENTS / MARCAÇÕES
-- ============================================================
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES therapists(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  notes TEXT,
  unit VARCHAR(50) CHECK (unit IN ('leça_palmeira', 'são_mamede')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- SUMÁRIOS / SESSION NOTES
-- ============================================================
CREATE TABLE session_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES therapists(id),
  patient_id UUID REFERENCES patients(id),
  content TEXT NOT NULL,
  objectives TEXT,
  evolution TEXT,
  next_steps TEXT,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- CALENDAR EVENTS (for therapist calendar)
-- ============================================================
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  therapist_id UUID REFERENCES therapists(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  event_type VARCHAR(50) DEFAULT 'appointment' CHECK (event_type IN ('appointment', 'block', 'vacation', 'meeting', 'other')),
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT, -- RRULE format
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- BLOG
-- ============================================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  tags TEXT[] DEFAULT '{}',
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- MEDIA / IMAGES
-- ============================================================
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  url TEXT NOT NULL,
  mime_type VARCHAR(100),
  size_bytes INT,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_appointments_therapist ON appointments(therapist_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_start ON appointments(start_time);
CREATE INDEX idx_session_notes_patient ON session_notes(patient_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published, published_at);
CREATE INDEX idx_calendar_events_therapist ON calendar_events(therapist_id, start_time);
