
import { Professional, Patient, Session, Exercise } from "../types/models";

export const professionals: Professional[] = [
  {
    id: "prof1",
    name: "Dra. Ana Martínez",
    specialty: "Fisioterapia Pediátrica",
    email: "ana.martinez@terapiasoft.com",
    phone: "+54 11 2345-6789",
    avatar: "https://images.unsplash.com/photo-1614289371518-722f2615943d?q=80&w=200&auto=format&fit=crop",
    bio: "Especialista en fisioterapia pediátrica con más de 10 años de experiencia en tratamientos de estimulación temprana."
  },
  {
    id: "prof2",
    name: "Lic. Carlos Rodríguez",
    specialty: "Estimulación Temprana",
    email: "carlos.rodriguez@terapiasoft.com",
    phone: "+54 11 3456-7890",
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop",
    bio: "Licenciado especializado en técnicas de estimulación temprana para niños con desafíos de desarrollo."
  },
  {
    id: "prof3",
    name: "Lic. Laura Gómez",
    specialty: "Terapia Ocupacional",
    email: "laura.gomez@terapiasoft.com",
    phone: "+54 11 4567-8901",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    bio: "Especialista en terapia ocupacional infantil, enfocada en mejorar la autonomía y habilidades motoras."
  }
];

export const patients: Patient[] = [
  {
    id: "pat1",
    name: "Martín Suárez",
    dateOfBirth: "2019-05-12",
    parentName: "Claudia Suárez",
    contactNumber: "+54 11 5678-9012",
    email: "claudia.suarez@gmail.com",
    diagnosis: "Retraso en el desarrollo psicomotor",
    notes: "Presenta dificultades en coordinación motora fina y equilibrio.",
    professionalId: "prof1"
  },
  {
    id: "pat2",
    name: "Lucía García",
    dateOfBirth: "2020-02-24",
    parentName: "Roberto García",
    contactNumber: "+54 11 6789-0123",
    email: "roberto.garcia@hotmail.com",
    diagnosis: "Parálisis cerebral leve",
    notes: "Necesita trabajo en fortalecimiento muscular y control de movimiento.",
    professionalId: "prof1"
  },
  {
    id: "pat3",
    name: "Tomás Fernández",
    dateOfBirth: "2018-11-30",
    parentName: "Mariana Fernández",
    contactNumber: "+54 11 7890-1234",
    email: "mariana.fernandez@gmail.com",
    diagnosis: "Trastorno del espectro autista",
    notes: "Requiere estimulación sensorial y desarrollo de habilidades sociales.",
    professionalId: "prof2"
  },
  {
    id: "pat4",
    name: "Valentina Lopez",
    dateOfBirth: "2021-08-15",
    parentName: "Diego Lopez",
    contactNumber: "+54 11 8901-2345",
    email: "diego.lopez@gmail.com",
    diagnosis: "Desarrollo típico - seguimiento preventivo",
    notes: "Asiste a sesiones de estimulación temprana como medida preventiva.",
    professionalId: "prof2"
  },
  {
    id: "pat5",
    name: "Santiago Medina",
    dateOfBirth: "2019-03-07",
    parentName: "Patricia Medina",
    contactNumber: "+54 11 9012-3456",
    email: "patricia.medina@yahoo.com",
    diagnosis: "Hipotonía muscular",
    notes: "Necesita fortalecimiento muscular general y mejora de postura.",
    professionalId: "prof3"
  }
];

export const exercises: Exercise[] = [
  {
    id: "ex1",
    name: "Ejercicios de agarre",
    description: "Práctica de agarre de objetos pequeños para mejorar motricidad fina",
    duration: "10 minutos",
    frequency: "Diario",
    instructions: "Utilizar juguetes pequeños y seguros como cubos o piezas grandes de rompecabezas."
  },
  {
    id: "ex2",
    name: "Equilibrio sobre pelota",
    description: "Ejercicios de equilibrio sobre pelota terapéutica",
    duration: "15 minutos",
    frequency: "3 veces por semana",
    instructions: "Sentar al niño sobre la pelota, sosteniendo su tronco, y realizar movimientos suaves hacia los lados."
  },
  {
    id: "ex3",
    name: "Estimulación sensorial",
    description: "Exposición a diferentes texturas y sensaciones",
    duration: "20 minutos",
    frequency: "Diario",
    instructions: "Utilizar telas de diferentes texturas, térmicas frías y calientes, y diferentes materiales."
  },
  {
    id: "ex4",
    name: "Gateo asistido",
    description: "Facilitación de movimientos de gateo",
    duration: "10 minutos",
    frequency: "2 veces por día",
    instructions: "Colocar al niño en posición de gateo y ayudar manualmente a realizar el movimiento alternado."
  },
  {
    id: "ex5",
    name: "Seguimiento visual",
    description: "Ejercicios para mejorar seguimiento visual de objetos",
    duration: "5 minutos",
    frequency: "3 veces por día",
    instructions: "Mover un objeto llamativo lentamente en el campo visual del niño, horizontal y verticalmente."
  }
];

export const sessions: Session[] = [
  {
    id: "ses1",
    date: "2023-06-15",
    patientId: "pat1",
    professionalId: "prof1",
    notes: "Primera evaluación. Presenta retraso en coordinación y equilibrio.",
    progress: "Se establece línea base para tratamiento.",
    exercises: [exercises[0], exercises[1]],
    recommendations: "Continuar con sesiones semanales y realizar ejercicios en casa."
  },
  {
    id: "ses2",
    date: "2023-06-22",
    patientId: "pat1",
    professionalId: "prof1",
    notes: "Se observa mejor respuesta en ejercicios de agarre.",
    progress: "Ligera mejora en coordinación de mano derecha.",
    exercises: [exercises[0], exercises[4]],
    recommendations: "Reforzar ejercicios de agarre con objetos de diferentes tamaños."
  },
  {
    id: "ses3",
    date: "2023-06-29",
    patientId: "pat1",
    professionalId: "prof1",
    notes: "Continúa progreso en motricidad fina, comienza trabajo de equilibrio.",
    progress: "Avance notable en precisión de agarre con mano derecha.",
    exercises: [exercises[0], exercises[1], exercises[4]],
    recommendations: "Incrementar dificultad de ejercicios de equilibrio gradualmente."
  },
  {
    id: "ses4",
    date: "2023-07-03",
    patientId: "pat2",
    professionalId: "prof1",
    notes: "Evaluación inicial. Presenta espasticidad en extremidades inferiores.",
    progress: "Se establece plan de tratamiento enfocado en reducir espasticidad.",
    exercises: [exercises[1], exercises[3]],
    recommendations: "Realizar estiramientos suaves diariamente."
  },
  {
    id: "ses5",
    date: "2023-07-05",
    patientId: "pat3",
    professionalId: "prof2",
    notes: "Evaluación sensorial. Muestra hipersensibilidad táctil.",
    progress: "Se identifican patrones de respuesta ante diferentes estímulos.",
    exercises: [exercises[2]],
    recommendations: "Introducir gradualmente diferentes texturas en actividades diarias."
  }
];

// Helper function to get patients by professional ID
export const getPatientsByProfessional = (professionalId: string): Patient[] => {
  return patients.filter(patient => patient.professionalId === professionalId);
};

// Helper function to get sessions by patient ID
export const getSessionsByPatient = (patientId: string): Session[] => {
  return sessions.filter(session => session.patientId === patientId);
};

// Helper function to get a professional by ID
export const getProfessionalById = (id: string): Professional | undefined => {
  return professionals.find(prof => prof.id === id);
};

// Helper function to get a patient by ID
export const getPatientById = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

// Helper function to get a session by ID
export const getSessionById = (id: string): Session | undefined => {
  return sessions.find(session => session.id === id);
};
