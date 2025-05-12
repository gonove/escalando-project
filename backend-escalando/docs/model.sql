-- =============== TABLAS DE USUARIOS Y AUTENTICACIÓN ===============

-- Tabla de Usuarios (integración con Cognito)
CREATE TABLE "user" (
  "id" UUID PRIMARY KEY, -- UUID generado por Cognito
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "cognito_sub" VARCHAR(255) UNIQUE, -- ID de Cognito para referencia
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Roles
CREATE TABLE "role" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL, -- 'admin', 'profesional', 'invitado'
  "description" TEXT
);

-- Relación Usuario-Rol
CREATE TABLE "user_role" (
  "user_id" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "role_id" INTEGER NOT NULL REFERENCES "role"("id") ON DELETE CASCADE,
  PRIMARY KEY ("user_id", "role_id")
);

-- =============== INFORMACIÓN DE PROFESIONALES ===============

-- Tabla de Profesionales
CREATE TABLE "professional" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL UNIQUE REFERENCES "user"("id") ON DELETE CASCADE,
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "phone" VARCHAR(20),
  "specialty" VARCHAR(100),
  "bio" TEXT,
  "address" TEXT,
  "city" VARCHAR(100),
  "state" VARCHAR(100),
  "country" VARCHAR(100),
  "status" VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'inactive'
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Especialidades
CREATE TABLE "specialty" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL UNIQUE,
  "description" TEXT
);

-- Relación Profesional-Especialidad (muchos a muchos)
CREATE TABLE "professional_specialty" (
  "professional_id" INTEGER NOT NULL REFERENCES "professional"("id") ON DELETE CASCADE,
  "specialty_id" INTEGER NOT NULL REFERENCES "specialty"("id") ON DELETE CASCADE,
  PRIMARY KEY ("professional_id", "specialty_id")
);

-- Tabla de Documentos del Profesional (títulos, certificaciones)
CREATE TABLE "professional_document" (
  "id" SERIAL PRIMARY KEY,
  "professional_id" INTEGER NOT NULL REFERENCES "professional"("id") ON DELETE CASCADE,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "file_path" VARCHAR(255) NOT NULL, -- Ruta en S3
  "file_type" VARCHAR(50), -- 'title', 'certification', 'other'
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============== INFORMACIÓN DE PACIENTES ===============

-- Tabla de Pacientes
CREATE TABLE "patient" (
  "id" SERIAL PRIMARY KEY,
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "birth_date" DATE,
  "diagnosis" TEXT,
  "notes" TEXT,
  "address" TEXT,
  "city" VARCHAR(100),
  "state" VARCHAR(100),
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Contactos del Paciente (padres, contacto de emergencia)
CREATE TABLE "patient_contact" (
  "id" SERIAL PRIMARY KEY,
  "patient_id" INTEGER NOT NULL REFERENCES "patient"("id") ON DELETE CASCADE,
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "relationship" VARCHAR(50) NOT NULL, -- 'parent', 'guardian', 'emergency'
  "phone" VARCHAR(20) NOT NULL,
  "email" VARCHAR(255),
  "is_primary" BOOLEAN DEFAULT FALSE
);

-- Relación Profesional-Paciente (muchos a muchos)
CREATE TABLE "professional_patient" (
  "professional_id" INTEGER NOT NULL REFERENCES "professional"("id") ON DELETE CASCADE,
  "patient_id" INTEGER NOT NULL REFERENCES "patient"("id") ON DELETE CASCADE,
  "is_primary" BOOLEAN DEFAULT FALSE, -- Indica si es el profesional principal
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("professional_id", "patient_id")
);

-- Tabla de Evaluación Inicial
CREATE TABLE "initial_evaluation" (
  "id" SERIAL PRIMARY KEY,
  "patient_id" INTEGER NOT NULL REFERENCES "patient"("id") ON DELETE CASCADE,
  "professional_id" INTEGER NOT NULL REFERENCES "professional"("id"),
  "evaluation_date" DATE NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para el contenido estructurado de la evaluación inicial
CREATE TABLE "initial_evaluation_section" (
  "id" SERIAL PRIMARY KEY,
  "evaluation_id" INTEGER NOT NULL REFERENCES "initial_evaluation"("id") ON DELETE CASCADE,
  "section_type" VARCHAR(50) NOT NULL, -- 'patient_history', 'family_info', 'medical_history', 'development_status',
                                       -- 'initial_observations', 'preliminary_diagnosis', 'recommended_approach'
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para documentos adjuntos a la evaluación inicial
CREATE TABLE "initial_evaluation_document" (
  "id" SERIAL PRIMARY KEY,
  "evaluation_id" INTEGER NOT NULL REFERENCES "initial_evaluation"("id") ON DELETE CASCADE,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "file_path" VARCHAR(255) NOT NULL, -- Ruta en S3
  "file_type" VARCHAR(50) NOT NULL, -- 'image', 'pdf', 'document'
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============== GESTIÓN DE HORARIOS Y SESIONES ===============

-- Tabla de Horarios Disponibles de Profesionales
CREATE TABLE "professional_schedule" (
  "id" SERIAL PRIMARY KEY,
  "professional_id" INTEGER NOT NULL REFERENCES "professional"("id") ON DELETE CASCADE,
  "day_of_week" INTEGER NOT NULL, -- 1 (Lunes) a 7 (Domingo)
  "start_time" TIME NOT NULL,
  "end_time" TIME NOT NULL,
  "is_active" BOOLEAN DEFAULT TRUE
);

-- Tabla de Sesiones
CREATE TABLE "session" (
  "id" SERIAL PRIMARY KEY,
  "professional_id" INTEGER NOT NULL REFERENCES "professional"("id"),
  "patient_id" INTEGER NOT NULL REFERENCES "patient"("id"),
  "start_datetime" TIMESTAMP NOT NULL,
  "end_datetime" TIMESTAMP NOT NULL,
  "status" VARCHAR(20) NOT NULL, -- 'scheduled', 'completed', 'cancelled', 'no-show'
  "notes" TEXT, -- Notas sobre la sesión
  "session_type" VARCHAR(50), -- Tipo de sesión (fisioterapia, neuropsicología, etc.)
  "is_recurring" BOOLEAN DEFAULT FALSE,
  "recurrence_pattern_id" INTEGER, -- Referencia a recurrence_pattern si es recurrente
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Patrones de Recurrencia
CREATE TABLE "recurrence_pattern" (
  "id" SERIAL PRIMARY KEY,
  "frequency" VARCHAR(20) NOT NULL, -- 'weekly', 'biweekly', 'monthly'
  "day_of_week" INTEGER, -- Para recurrencia semanal/bisemanal
  "day_of_month" INTEGER, -- Para recurrencia mensual
  "end_date" DATE, -- Fecha de finalización de la recurrencia
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Documentos de la Sesión (fotos, videos, etc.)
CREATE TABLE "session_document" (
  "id" SERIAL PRIMARY KEY,
  "session_id" INTEGER NOT NULL REFERENCES "session"("id") ON DELETE CASCADE,
  "title" VARCHAR(255),
  "description" TEXT,
  "file_path" VARCHAR(255) NOT NULL, -- Ruta en S3
  "file_type" VARCHAR(50) NOT NULL, -- 'image', 'video', 'document', 'invoice'
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============== INFORMES ===============

-- Tabla de Informes
CREATE TABLE "report" (
  "id" SERIAL PRIMARY KEY,
  "patient_id" INTEGER NOT NULL REFERENCES "patient"("id") ON DELETE CASCADE,
  "professional_id" INTEGER NOT NULL REFERENCES "professional"("id"),
  "title" VARCHAR(255) NOT NULL,
  "content" TEXT NOT NULL,
  "report_type" VARCHAR(50) NOT NULL, -- 'school', 'doctor', 'parent', 'other'
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Documentos del Informe
CREATE TABLE "report_document" (
  "id" SERIAL PRIMARY KEY,
  "report_id" INTEGER NOT NULL REFERENCES "report"("id") ON DELETE CASCADE,
  "title" VARCHAR(255),
  "description" TEXT,
  "file_path" VARCHAR(255) NOT NULL, -- Ruta en S3
  "file_type" VARCHAR(50) NOT NULL, -- 'image', 'pdf', 'document'
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============== NOTIFICACIONES ===============

-- Tabla de Notificaciones
CREATE TABLE "notification" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "title" VARCHAR(255) NOT NULL,
  "content" TEXT NOT NULL,
  "is_read" BOOLEAN DEFAULT FALSE,
  "notification_type" VARCHAR(50), -- 'session_reminder', 'report_created', etc.
  "reference_id" INTEGER, -- ID de referencia (sesión, informe, etc.)
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============== FACTURACIÓN ===============

-- Tabla de Facturas
CREATE TABLE "invoice" (
  "id" SERIAL PRIMARY KEY,
  "session_id" INTEGER NOT NULL REFERENCES "session"("id") ON DELETE CASCADE,
  "amount" DECIMAL(10, 2) NOT NULL,
  "status" VARCHAR(20) NOT NULL, -- 'paid', 'pending', 'cancelled'
  "payment_date" DATE,
  "payment_method" VARCHAR(50),
  "notes" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_professional_user ON professional(user_id);
CREATE INDEX idx_session_professional ON session(professional_id);
CREATE INDEX idx_session_patient ON session(patient_id);
CREATE INDEX idx_session_datetime ON session(start_datetime, end_datetime);
CREATE INDEX idx_patient_name ON patient(first_name, last_name);
CREATE INDEX idx_professional_name ON professional(first_name, last_name);
CREATE INDEX idx_report_patient ON report(patient_id);
CREATE INDEX idx_invoice_session ON invoice(session_id);