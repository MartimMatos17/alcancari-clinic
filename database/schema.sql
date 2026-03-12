-- USERS (terapeutas e admins)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'therapist',
  unit VARCHAR(100),
  specialty VARCHAR(100),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PATIENTS
CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  parent_name VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  services TEXT[],
  therapist_id INTEGER REFERENCES users(id),
  unit VARCHAR(100),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id),
  therapist_id INTEGER REFERENCES users(id),
  service VARCHAR(100),
  unit VARCHAR(100),
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 50,
  status VARCHAR(50) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- SESSION NOTES (sumários)
CREATE TABLE IF NOT EXISTS session_notes (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id),
  therapist_id INTEGER REFERENCES users(id),
  appointment_id INTEGER REFERENCES appointments(id),
  service VARCHAR(100),
  session_date DATE,
  session_time VARCHAR(10),
  objectives TEXT,
  content TEXT,
  evolution VARCHAR(50),
  next_session TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT,
  unit VARCHAR(100),
  status VARCHAR(50) DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT NOW()
);

-- APPOINTMENT REQUESTS (do site público)
CREATE TABLE IF NOT EXISTS appointment_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  service VARCHAR(100),
  unit VARCHAR(100),
  preferred_date DATE,
  preferred_time VARCHAR(10),
  age VARCHAR(50),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
