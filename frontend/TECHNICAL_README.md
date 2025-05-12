
# Documentación Técnica de Escalando App

## Stack Tecnológico

### Frontend
- React 18.3.1
- TypeScript
- Vite (Build tool)
- TailwindCSS (Estilos)
- Shadcn/ui (Componentes UI)
- React Router DOM (Enrutamiento)
- Framer Motion (Animaciones)
- React Query (Manejo de estado y caché)
- React Hook Form (Manejo de formularios)
- Date-fns (Manejo de fechas)
- Lucide React (Íconos)
- Sonner (Notificaciones)

### Backend (Supabase)
- PostgreSQL (Base de datos)
- Row Level Security (RLS)
- Edge Functions (Serverless)
- Autenticación y Autorización
- Almacenamiento de archivos

## Estructura del Proyecto

```
src/
├── api/           # Funciones de API para interactuar con Supabase
├── components/    # Componentes reutilizables
│   ├── auth/     # Componentes de autenticación
│   ├── layout/   # Componentes de diseño
│   ├── patient/  # Componentes relacionados con pacientes
│   ├── profile/  # Componentes de perfil
│   ├── scheduler/# Componentes del programador
│   └── ui/       # Componentes de interfaz de usuario
├── context/      # Contextos de React
├── hooks/        # Hooks personalizados
├── integrations/ # Integraciones con servicios externos
├── lib/          # Utilidades y helpers
├── pages/        # Páginas de la aplicación
└── types/        # Definiciones de tipos TypeScript
```

## Base de Datos

### Tablas Principales
- `profiles`: Información de usuarios y profesionales
- `patients`: Información de pacientes
- `sessions`: Sesiones programadas
- `evaluations`: Evaluaciones de pacientes
- `notes`: Notas de sesiones

### Políticas de Seguridad (RLS)
- Cada tabla tiene políticas RLS configuradas
- Los usuarios solo pueden acceder a sus propios datos
- Los profesionales solo pueden ver sus pacientes asignados

## Autenticación y Autorización

### Flujo de Autenticación
1. Login con email/password
2. Manejo de sesiones con Supabase Auth
3. Contexto de autenticación en React

### Roles de Usuario
- `admin`: Acceso completo
- `professional`: Acceso a sus pacientes y sesiones
- `patient`: Acceso limitado a su información

## APIs y Edge Functions

### Endpoints Principales
- `/api/sessions`: Gestión de sesiones
- `/api/patients`: Gestión de pacientes
- `/api/evaluations`: Gestión de evaluaciones
- `/api/availability`: Gestión de disponibilidad

## Componentes Principales

### Layout
- `Layout.tsx`: Contenedor principal con navegación
- `Sidebar.tsx`: Barra lateral de navegación

### Scheduler
- `WeeklyGrid`: Vista semanal del calendario
- `MonthlyView`: Vista mensual del calendario
- `SessionDetailDialog`: Detalles de sesión

### Patients
- `PatientCard`: Tarjeta de información del paciente
- `PatientForm`: Formulario de registro/edición
- `EvaluationForm`: Formulario de evaluación

## Hooks Personalizados

- `useAuth`: Manejo de autenticación
- `useIsMobile`: Detección de dispositivos móviles
- `useToast`: Manejo de notificaciones

## Utilidades

- `formatDate`: Formateo de fechas
- `calculateAge`: Cálculo de edad
- `cn`: Utilidad para clases condicionales

## Guía de Estilos

### Colores
- Primary: Escalando (#4F46E5)
- Secondary: (#E5E7EB)
- Accent: (#10B981)
- Background: (#FFFFFF)
- Text: (#111827)

### Espaciado
- Basado en el sistema de espaciado de Tailwind
- Unidades: 0.25rem (4px) incrementos

### Tipografía
- Font Family: Inter
- Tamaños: Siguiendo la escala de Tailwind

## Mejores Prácticas

### Código
- Componentes funcionales con TypeScript
- Props tipadas explícitamente
- Uso de interfaces para tipos complejos
- Comentarios para lógica compleja

### Estado
- React Query para estado del servidor
- useState para estado local simple
- Context para estado global compartido

### Rendimiento
- Memoización de componentes costosos
- Optimización de re-renders
- Lazy loading de rutas

## Scripts

- `npm run dev`: Desarrollo local
- `npm run build`: Construcción para producción
- `npm run preview`: Vista previa de producción

