
import { format, addDays, subDays, addHours, setHours, setMinutes } from "date-fns";

// Pacientes
export const patients = [
  {
    id: "pat_1",
    name: "Lucía Martínez",
    birthDate: "2018-04-12",
    age: 5,
    gender: "F",
    parentName: "María Martínez",
    parentPhone: "+34 612 345 678",
    parentEmail: "maria.martinez@example.com",
    diagnosis: "Retraso del desarrollo",
    notes: "Inició terapia en enero 2023",
    therapies: ["Terapia ocupacional", "Logopedia"],
    address: "Calle Mayor 23, Madrid",
    insurance: "Mapfre",
    insuranceId: "MP-23456789",
    lastVisit: "2023-05-25",
    nextVisit: "2023-06-15",
    media: []
  },
  {
    id: "pat_2",
    name: "Alejandro Gómez",
    birthDate: "2017-11-03",
    age: 6,
    gender: "M",
    parentName: "Carlos Gómez",
    parentPhone: "+34 623 456 789",
    parentEmail: "carlos.gomez@example.com",
    diagnosis: "TEA (Grado 1)",
    notes: "Sensibilidad a ruidos fuertes",
    therapies: ["Psicología", "Terapia ocupacional"],
    address: "Avenida Libertad 45, Madrid",
    insurance: "Adeslas",
    insuranceId: "AD-34567890",
    lastVisit: "2023-05-28",
    nextVisit: "2023-06-18",
    media: []
  },
  {
    id: "pat_3",
    name: "Sofía Ruiz",
    birthDate: "2019-02-15",
    age: 4,
    gender: "F",
    parentName: "Elena Ruiz",
    parentPhone: "+34 634 567 890",
    parentEmail: "elena.ruiz@example.com",
    diagnosis: "Retraso del habla",
    notes: "Ha mostrado mejoras significativas en el último mes",
    therapies: ["Logopedia"],
    address: "Calle Alcalá 112, Madrid",
    insurance: "Sanitas",
    insuranceId: "SN-45678901",
    lastVisit: "2023-05-30",
    nextVisit: "2023-06-13",
    media: []
  },
  {
    id: "pat_4",
    name: "Daniel López",
    birthDate: "2016-09-22",
    age: 7,
    gender: "M",
    parentName: "Ana López",
    parentPhone: "+34 645 678 901",
    parentEmail: "ana.lopez@example.com",
    diagnosis: "TDAH",
    notes: "Medicado con metilfenidato 10mg",
    therapies: ["Psicología", "Terapia ocupacional"],
    address: "Plaza España 3, Madrid",
    insurance: "DKV",
    insuranceId: "DK-56789012",
    lastVisit: "2023-05-27",
    nextVisit: "2023-06-17",
    media: []
  }
];

// Terapeutas
export const therapists = [
  { id: "th_1", name: "Ana García", specialty: "Terapeuta Ocupacional", email: "ana.garcia@escalando.es", phone: "+34 622 345 671", color: "#4f7cac" },
  { id: "th_2", name: "Carlos Rodríguez", specialty: "Psicólogo Infantil", email: "carlos.rodriguez@escalando.es", phone: "+34 633 456 782", color: "#f5a742" },
  { id: "th_3", name: "Laura Martínez", specialty: "Logopeda", email: "laura.martinez@escalando.es", phone: "+34 644 567 893", color: "#38b2ac" },
  { id: "th_4", name: "Sofía López", specialty: "Fisioterapeuta", email: "sofia.lopez@escalando.es", phone: "+34 655 678 904", color: "#e53e3e" }
];

// Tipos de sesiones
export const sessionTypes = [
  { id: "regular", name: "Sesión Regular", duration: 45 },
  { id: "evaluation", name: "Evaluación", duration: 60 },
  { id: "follow-up", name: "Seguimiento", duration: 30 },
  { id: "first-time", name: "Primera Consulta", duration: 75 }
];

// Generar horarios de centro
export const centerHours = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
];

// Función para generar sesiones aleatorias
const generateRandomSessions = (count: number) => {
  const sessions = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const isPast = Math.random() > 0.6;
    const daysOffset = isPast ? -(Math.floor(Math.random() * 30)) : Math.floor(Math.random() * 30);
    const sessionDate = addDays(today, daysOffset);
    
    // No generar sesiones en fin de semana (6: sábado, 0: domingo)
    const dayOfWeek = sessionDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      i--; // Intentar de nuevo
      continue;
    }
    
    const hourIndex = Math.floor(Math.random() * centerHours.length);
    const patientIndex = Math.floor(Math.random() * patients.length);
    const therapistIndex = Math.floor(Math.random() * therapists.length);
    const sessionTypeIndex = Math.floor(Math.random() * sessionTypes.length);
    
    const sessionType = sessionTypes[sessionTypeIndex];
    const billingStatus = isPast ? (Math.random() > 0.3 ? "completed" : "pending") : "pending";
    const reportStatus = isPast ? (Math.random() > 0.3 ? "completed" : "pending") : "pending";
    
    const session = {
      id: `ses_${i + 100}`,
      patientId: patients[patientIndex].id,
      therapistId: therapists[therapistIndex].id,
      date: sessionDate,
      time: centerHours[hourIndex],
      duration: sessionType.duration,
      type: sessionType.id,
      billingStatus: billingStatus,
      reportStatus: reportStatus,
      notes: isPast ? "El paciente ha mostrado buena evolución." : "",
      billingDocuments: billingStatus === "completed" ? [{
        id: `doc_${i}`,
        sessionId: `ses_${i + 100}`,
        fileName: `factura_${format(sessionDate, 'MM_yyyy')}.pdf`,
        fileUrl: "#",
        uploadDate: format(addDays(sessionDate, 1), 'yyyy-MM-dd'),
        type: "invoice"
      }] : []
    };
    
    sessions.push(session);
  }
  
  return sessions;
};

// Sesiones programadas
export const scheduledSessions = generateRandomSessions(50);

// Informes recientes
export const recentReports = [
  {
    id: "rep_1",
    patientId: "pat_1",
    therapistId: "th_1",
    title: "Informe de evaluación inicial",
    date: subDays(new Date(), 5),
    type: "evaluation",
    status: "completed",
    sharedWith: ["maria.martinez@example.com"]
  },
  {
    id: "rep_2",
    patientId: "pat_2",
    therapistId: "th_2",
    title: "Informe trimestral",
    date: subDays(new Date(), 10),
    type: "progress",
    status: "completed",
    sharedWith: ["carlos.gomez@example.com"]
  },
  {
    id: "rep_3",
    patientId: "pat_3",
    therapistId: "th_3",
    title: "Informe logopédico",
    date: subDays(new Date(), 15),
    type: "specialist",
    status: "completed",
    sharedWith: ["elena.ruiz@example.com"]
  },
  {
    id: "rep_4",
    patientId: "pat_4",
    therapistId: "th_2",
    title: "Valoración psicológica",
    date: subDays(new Date(), 20),
    type: "evaluation",
    status: "completed",
    sharedWith: ["ana.lopez@example.com"]
  }
];

// Tareas pendientes
export const pendingTasks = [
  {
    id: "task_1",
    title: "Completar informe para Lucía",
    patientId: "pat_1",
    assignedTo: "th_1",
    dueDate: addDays(new Date(), 2),
    priority: "high",
    status: "pending"
  },
  {
    id: "task_2",
    title: "Llamar a los padres de Alejandro",
    patientId: "pat_2",
    assignedTo: "th_2",
    dueDate: addDays(new Date(), 1),
    priority: "medium",
    status: "pending"
  },
  {
    id: "task_3",
    title: "Actualizar plan terapéutico de Sofía",
    patientId: "pat_3",
    assignedTo: "th_3",
    dueDate: addDays(new Date(), 3),
    priority: "low",
    status: "pending"
  },
  {
    id: "task_4",
    title: "Revisar progreso de Daniel",
    patientId: "pat_4",
    assignedTo: "th_4",
    dueDate: addDays(new Date(), 2),
    priority: "medium",
    status: "pending"
  }
];

// Estadísticas para dashboard
export const statistics = {
  patientsTotal: 42,
  patientsActive: 35,
  sessionsThisMonth: 124,
  sessionsLastMonth: 118,
  revenueThisMonth: 5680,
  revenueLastMonth: 5240,
  pendingReports: 8,
  upcomingEvaluations: 5
};
