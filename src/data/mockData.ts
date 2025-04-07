
import {
  Professional, Patient, Session, Exercise, SessionEvaluation,
  MediaFile, BillingDocument, CollaboratorNote, DevelopmentalMilestone
} from "../types/models";

// Session Types
export const sessionTypes: Record<string, string> = {
  'regular': 'Sesión Regular',
  'evaluation': 'Evaluación',
  'follow-up': 'Seguimiento',
  'first-time': 'Primera Consulta'
};

// Professionals
export const professionals: Professional[] = [
  {
    id: "prof1",
    name: "Dra. Ana Martínez",
    specialty: "Fisioterapia Pediátrica",
    email: "ana.martinez@terapiasoft.com",
    phone: "+595 986 209 981",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
    bio: "Especialista en fisioterapia pediátrica con más de 10 años de experiencia en tratamientos de estimulación temprana."
  },
  {
    id: "prof2",
    name: "Lic. Rossana Rodríguez",
    specialty: "Estimulación Temprana",
    email: "carlos.rodriguez@terapiasoft.com",
    phone: "+595 986 209 981",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=200&auto=format&fit=crop",
    bio: "Licenciado especializado en técnicas de estimulación temprana para niños con desafíos de desarrollo."
  },
  {
    id: "prof3",
    name: "Lic. Laura Gómez",
    specialty: "Terapia Ocupacional",
    email: "laura.gomez@terapiasoft.com",
    phone: "+595 986 209 981",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    bio: "Especialista en terapia ocupacional infantil, enfocada en mejorar la autonomía y habilidades motoras."
  }
];

// Developmental Milestones
export const developmentalMilestones: DevelopmentalMilestone[] = [
  {
    id: "milestone1",
    patientId: "pat1",
    ageMonths: 3,
    date: "2020-01-01",
    milestone: "Comienza a caminar",
    category: "motor"
  },
  {
    id: "milestone2",
    patientId: "pat1",
    ageMonths: 6,
    date: "2020-06-01",
    milestone: "Comienza a hablar",
    category: "cognitive"
  },
  {
    id: "milestone3",
    patientId: "pat2",
    ageMonths: 4,
    date: "2020-06-24",
    milestone: "Comienza a sostener la cabeza",
    category: "motor"
  },
  {
    id: "milestone4",
    patientId: "pat2",
    ageMonths: 10,
    date: "2021-01-24",
    milestone: "Comienza a gatear",
    category: "motor"
  },
  {
    id: "milestone5",
    patientId: "pat3",
    ageMonths: 8,
    date: "2019-07-30",
    milestone: "Reconoce su nombre",
    category: "cognitive"
  },
  {
    id: "milestone6",
    patientId: "pat3",
    ageMonths: 18,
    date: "2020-05-30",
    milestone: "Comienza a formar frases simples",
    category: "language"
  },
  {
    id: "milestone7",
    patientId: "pat4",
    ageMonths: 6,
    date: "2022-02-15",
    milestone: "Comienza a sentarse sin apoyo",
    category: "motor"
  },
  {
    id: "milestone8",
    patientId: "pat4",
    ageMonths: 12,
    date: "2022-08-15",
    milestone: "Comienza a caminar",
    category: "motor"
  },
  {
    id: "milestone9",
    patientId: "pat5",
    ageMonths: 5,
    date: "2019-08-07",
    milestone: "Comienza a rodar",
    category: "motor"
  },
  {
    id: "milestone10",
    patientId: "pat5",
    ageMonths: 15,
    date: "2020-06-07",
    milestone: "Comienza a caminar con apoyo",
    category: "motor"
  },
  {
    id: "milestone11",
    patientId: "pat6",
    ageMonths: 9,
    date: "2021-07-10",
    milestone: "Balbucea palabras simples",
    category: "language"
  },
  {
    id: "milestone12",
    patientId: "pat6",
    ageMonths: 24,
    date: "2022-10-10",
    milestone: "Comienza a formar frases simples",
    category: "language"
  },
  {
    id: "milestone13",
    patientId: "pat7",
    ageMonths: 12,
    date: "2018-07-22",
    milestone: "Comienza a caminar",
    category: "motor"
  },
  {
    id: "milestone14",
    patientId: "pat7",
    ageMonths: 24,
    date: "2019-07-22",
    milestone: "Comienza a hablar frases simples",
    category: "language"
  },
  {
    id: "milestone15",
    patientId: "pat8",
    ageMonths: 10,
    date: "2020-10-05",
    milestone: "Balbucea palabras simples",
    category: "language"
  },
  {
    id: "milestone16",
    patientId: "pat8",
    ageMonths: 20,
    date: "2021-08-05",
    milestone: "Comienza a formar frases simples",
    category: "language"
  }
];

// Pacientes
export const patients: Patient[] = [
  {
    id: "pat1",
    name: "Martín Suárez",
    dateOfBirth: "2019-05-12",
    parentName: "Claudia Suárez",
    contactNumber: "+595 986 209 981",
    email: "claudia.suarez@gmail.com",
    diagnosis: "Retraso en el desarrollo psicomotor",
    notes: "Presenta dificultades en coordinación motora fina y equilibrio.",
    professionalId: "prof1",
    phone: "+595 986 209 981",
    age: 4,
    gender: "Masculino",
    status: "active",
    location: "Asuncion",
    developmentalMilestones: developmentalMilestones.filter(m => m.patientId === "pat1")
  },
  {
    id: "pat2",
    name: "Lucía García",
    dateOfBirth: "2020-02-24",
    parentName: "Roberto García",
    contactNumber: "+595 986 209 981",
    email: "roberto.garcia@hotmail.com",
    diagnosis: "Parálisis cerebral leve",
    notes: "Necesita trabajo en fortalecimiento muscular y control de movimiento.",
    professionalId: "prof1",
    phone: "+595 986 209 981",
    age: 3,
    gender: "Femenino",
    status: "active",
    location: "Asuncion",
    developmentalMilestones: developmentalMilestones.filter(m => m.patientId === "pat2")
  },
  {
    id: "pat3",
    name: "Tomás Fernández",
    dateOfBirth: "2018-11-30",
    parentName: "Mariana Fernández",
    contactNumber: "+595 986 209 981",
    email: "mariana.fernandez@gmail.com",
    diagnosis: "Trastorno del espectro autista",
    notes: "Requiere estimulación sensorial y desarrollo de habilidades sociales.",
    professionalId: "prof2",
    phone: "+595 986 209 981",
    age: 5,
    gender: "Masculino",
    status: "active",
    location: "Lambaré",
    developmentalMilestones: developmentalMilestones.filter(m => m.patientId === "pat3")
  },
  {
    id: "pat4",
    name: "Valentina Lopez",
    dateOfBirth: "2021-08-15",
    parentName: "Diego Lopez",
    contactNumber: "+595 986 209 981",
    email: "diego.lopez@gmail.com",
    diagnosis: "Desarrollo típico - seguimiento preventivo",
    notes: "Asiste a sesiones de estimulación temprana como medida preventiva.",
    professionalId: "prof2",
    phone: "+595 986 209 981",
    age: 2,
    gender: "Femenino",
    status: "active",
    location: "Asuncion",
    developmentalMilestones: developmentalMilestones.filter(m => m.patientId === "pat4")
  },
  {
    id: "pat5",
    name: "Santiago Medina",
    dateOfBirth: "2019-03-07",
    parentName: "Patricia Medina",
    contactNumber: "+595 986 209 981",
    email: "patricia.medina@yahoo.com",
    diagnosis: "Hipotonía muscular",
    notes: "Necesita fortalecimiento muscular general y mejora de postura.",
    professionalId: "prof3",
    phone: "+595 986 209 981",
    age: 4,
    gender: "Masculino",
    status: "active",
    location: "Rosario",
    developmentalMilestones: developmentalMilestones.filter(m => m.patientId === "pat5")
  },
  {
    id: "pat6",
    name: "Camila Rojas",
    dateOfBirth: "2020-10-10",
    parentName: "Sofía Rojas",
    contactNumber: "+595 986 209 982",
    email: "sofia.rojas@gmail.com",
    diagnosis: "Dificultades de lenguaje",
    notes: "Requiere terapia de lenguaje para mejorar pronunciación y vocabulario.",
    professionalId: "prof2",
    phone: "+595 986 209 982",
    age: 3,
    gender: "Femenino",
    status: "active",
    location: "San Lorenzo",
    developmentalMilestones: developmentalMilestones.filter(m => m.patientId === "pat6")
  },
  {
    id: "pat7",
    name: "Javier Torres",
    dateOfBirth: "2017-07-22",
    parentName: "Carlos Torres",
    contactNumber: "+595 986 209 983",
    email: "carlos.torres@gmail.com",
    diagnosis: "Déficit de atención e hiperactividad",
    notes: "Requiere actividades que fomenten la concentración y el autocontrol.",
    professionalId: "prof3",
    phone: "+595 986 209 983",
    age: 6,
    gender: "Masculino",
    status: "active",
    location: "Fernando de la Mora",
    developmentalMilestones: developmentalMilestones.filter(m => m.patientId === "pat7")
  },
  {
    id: "pat8",
    name: "Sofía Benítez",
    dateOfBirth: "2019-12-05",
    parentName: "Ana Benítez",
    contactNumber: "+595 986 209 984",
    email: "ana.benitez@gmail.com",
    diagnosis: "Retraso en el desarrollo del habla",
    notes: "Necesita terapia para mejorar habilidades comunicativas.",
    professionalId: "prof1",
    phone: "+595 986 209 984",
    age: 4,
    gender: "Femenino",
    status: "active",
    location: "Luque",
    developmentalMilestones: developmentalMilestones.filter(m => m.patientId === "pat8")
  },
  {
    id: "pat9",
    name: "Emilio Vargas",
    dateOfBirth: "2018-04-18",
    parentName: "Laura Vargas",
    contactNumber: "+595 986 209 985",
    email: "laura.vargas@gmail.com",
    diagnosis: "Dificultades motoras",
    notes: "Requiere fortalecimiento muscular y mejora de coordinación.",
    professionalId: "prof3",
    phone: "+595 986 209 985",
    age: 5,
    gender: "Masculino",
    status: "active",
    location: "Capiatá",
  },
  {
    id: "pat10",
    name: "Isabella Romero",
    dateOfBirth: "2021-01-25",
    parentName: "Marcos Romero",
    contactNumber: "+595 986 209 986",
    email: "marcos.romero@gmail.com",
    diagnosis: "Seguimiento preventivo",
    notes: "Asiste a sesiones para monitorear desarrollo general.",
    professionalId: "prof2",
    phone: "+595 986 209 986",
    age: 2,
    gender: "Femenino",
    status: "active",
    location: "Asuncion",
  }
];

// Exercises data
export const exercises: Exercise[] = [
  {
    id: "ex1",
    name: "Ejercicios de agarre",
    description: "Práctica de agarre de objetos pequeños para mejorar motricidad fina",
    repetitions: 10,
    sets: 3,
    completed: false,
    duration: "10 minutos",
    frequency: "Diario",
    instructions: "Utilizar juguetes pequeños y seguros como cubos o piezas grandes de rompecabezas."
  },
  {
    id: "ex2",
    name: "Equilibrio sobre pelota",
    description: "Ejercicios de equilibrio sobre pelota terapéutica",
    repetitions: 5,
    sets: 2,
    completed: false,
    duration: "15 minutos",
    frequency: "3 veces por semana",
    instructions: "Sentar al niño sobre la pelota, sosteniendo su tronco, y realizar movimientos suaves hacia los lados."
  },
  {
    id: "ex3",
    name: "Estimulación sensorial",
    description: "Exposición a diferentes texturas y sensaciones",
    repetitions: 1,
    sets: 1,
    completed: false,
    duration: "20 minutos",
    frequency: "Diario",
    instructions: "Utilizar telas de diferentes texturas, térmicas frías y calientes, y diferentes materiales."
  },
  {
    id: "ex4",
    name: "Gateo asistido",
    description: "Facilitación de movimientos de gateo",
    repetitions: 8,
    sets: 2,
    completed: false,
    duration: "10 minutos",
    frequency: "2 veces por día",
    instructions: "Colocar al niño en posición de gateo y ayudar manualmente a realizar el movimiento alternado."
  },
  {
    id: "ex5",
    name: "Seguimiento visual",
    description: "Ejercicios para mejorar seguimiento visual de objetos",
    repetitions: 10,
    sets: 3,
    completed: false,
    duration: "5 minutos",
    frequency: "3 veces por día",
    instructions: "Mover un objeto llamativo lentamente en el campo visual del niño, horizontal y verticalmente."
  }
];

// Session evaluations
export const sessionEvaluations: SessionEvaluation[] = [
  {
    id: "eval1",
    sessionId: "ses1",
    developmentArea: "Motricidad fina y gruesa",
    objectives: "Establecer línea base para el tratamiento de coordinación y equilibrio",
    activities: "Evaluación de agarre, coordinación bilateral y equilibrio estático",
    patientResponse: "Muestra dificultades en coordinación de mano derecha y equilibrio sobre un pie",
    observations: "Presenta retraso en coordinación y equilibrio acorde a su edad",
    achievedMilestones: "Se identifican habilidades básicas de agarre",
    nextSteps: "Iniciar tratamiento enfocado en coordinación bilateral y equilibrio",
    recommendations: "Continuar con sesiones semanales y realizar ejercicios en casa",
    createdAt: "2025-06-15T10:00:00Z",
    updatedAt: "2025-06-15T10:00:00Z"
  },
  {
    id: "eval2",
    sessionId: "ses4",
    developmentArea: "Control postural y movilidad",
    objectives: "Evaluar nivel de espasticidad en extremidades inferiores",
    activities: "Valoración de rango de movimiento y patrones posturales",
    patientResponse: "Presenta resistencia moderada al estiramiento de extremidades inferiores",
    observations: "Espasticidad más marcada en miembros inferiores, especialmente en flexores de rodilla",
    achievedMilestones: "Logra mantenerse sentada con apoyo mínimo",
    nextSteps: "Establecer plan de tratamiento para reducir espasticidad",
    recommendations: "Realizar estiramientos suaves diariamente",
    createdAt: "2025-07-03T12:00:00Z",
    updatedAt: "2025-07-03T12:00:00Z"
  },
  {
    id: "eval3",
    sessionId: "ses5",
    developmentArea: "Integración sensorial",
    objectives: "Evaluar respuesta a estímulos sensoriales",
    activities: "Exposición a diferentes texturas, sonidos y estímulos visuales",
    patientResponse: "Muestra hipersensibilidad táctil, especialmente en manos y pies",
    observations: "Se identifican patrones de respuesta defensiva ante texturas rugosas",
    achievedMilestones: "Acepta progresivamente algunas texturas suaves",
    nextSteps: "Implementar programa de integración sensorial gradual",
    recommendations: "Introducir gradualmente diferentes texturas en actividades diarias",
    createdAt: "2025-07-05T16:00:00Z",
    updatedAt: "2025-07-05T16:00:00Z"
  }
];

// Media files
export const mediaFiles: MediaFile[] = [
  {
    id: "media1",
    sessionId: "ses1",
    fileName: "evaluacion_inicial_martin.jpg",
    fileUrl: "https://example.com/files/evaluacion_inicial_martin.jpg",
    type: "image",
    uploadDate: "2025-06-15T10:30:00Z",
    notes: "Foto documentando postura durante evaluación inicial"
  },
  {
    id: "media2",
    sessionId: "ses2",
    fileName: "progreso_agarre_martin.mp4",
    fileUrl: "https://example.com/files/progreso_agarre_martin.mp4",
    type: "video",
    uploadDate: "2025-06-22T09:45:00Z",
    notes: "Video mostrando mejora en ejercicio de agarre"
  },
  {
    id: "media3",
    sessionId: "ses4",
    fileName: "evaluacion_lucia.jpg",
    fileUrl: "https://example.com/files/evaluacion_lucia.jpg",
    type: "image",
    uploadDate: "2025-07-03T11:30:00Z",
    notes: "Documentación de espasticidad en extremidades inferiores"
  },
  {
    id: "media4",
    sessionId: "ses5",
    fileName: "respuestas_sensoriales_tomas.mp4",
    fileUrl: "https://example.com/files/respuestas_sensoriales_tomas.mp4",
    type: "video",
    uploadDate: "2025-07-05T15:45:00Z",
    notes: "Registro de respuestas ante diferentes estímulos táctiles"
  }
];

// Billing documents
export const billingDocuments: BillingDocument[] = [
  {
    id: "bill1",
    sessionId: "ses1",
    fileName: "factura_martin_evaluacion_inicial.pdf",
    fileUrl: "https://example.com/bills/factura_martin_evaluacion_inicial.pdf",
    uploadDate: "2025-06-15T11:00:00Z",
    type: "invoice"
  },
  {
    id: "bill2",
    sessionId: "ses2",
    fileName: "recibo_martin_seguimiento.pdf",
    fileUrl: "https://example.com/bills/recibo_martin_seguimiento.pdf",
    uploadDate: "2025-06-22T10:00:00Z",
    type: "receipt"
  },
  {
    id: "bill3",
    sessionId: "ses4",
    fileName: "factura_lucia_evaluacion.pdf",
    fileUrl: "https://example.com/bills/factura_lucia_evaluacion.pdf",
    uploadDate: "2025-07-03T12:30:00Z",
    type: "invoice"
  },
  {
    id: "bill4",
    sessionId: "ses5",
    fileName: "factura_tomas_evaluacion_sensorial.pdf",
    fileUrl: "https://example.com/bills/factura_tomas_evaluacion_sensorial.pdf",
    uploadDate: "2025-07-05T16:30:00Z",
    type: "invoice"
  }
];

// Collaborator notes
export const collaboratorNotes: CollaboratorNote[] = [
  {
    id: "note1",
    sessionId: "ses1",
    professionalId: "prof2",
    content: "Recomiendo complementar con evaluación de integración sensorial en próximas sesiones.",
    createdAt: "2025-06-16T09:00:00Z",
    isPrivate: false
  },
  {
    id: "note2",
    sessionId: "ses5",
    professionalId: "prof1",
    content: "Considero importante evaluar componente motor en relación con hipersensibilidad táctil.",
    createdAt: "2025-07-06T14:00:00Z",
    isPrivate: false
  },
  {
    id: "note3",
    sessionId: "ses7",
    professionalId: "prof2",
    content: "Podría beneficiarse de terapia ocupacional complementaria para abordar hipotonía.",
    createdAt: "2025-07-13T10:00:00Z",
    isPrivate: false
  }
];

// Sessions
export const sessions: Session[] = [
  {
    id: "ses1",
    date: "2025-06-15",
    patientId: "pat1",
    professionalId: "prof1",
    notes: "Primera evaluación. Presenta retraso en coordinación y equilibrio.",
    progress: "Se establece línea base para tratamiento.",
    exercises: [exercises[0], exercises[1]],
    recommendations: "Continuar con sesiones semanales y realizar ejercicios en casa.",
    type: "Evaluación inicial",
    time: "09:00",
    duration: 60,
    evaluation: sessionEvaluations.find(evaluation => evaluation.sessionId === "ses1"),
    mediaFiles: mediaFiles.filter(media => media.sessionId === "ses1"),
    billingDocuments: billingDocuments.filter(bill => bill.sessionId === "ses1"),
    collaboratorNotes: collaboratorNotes.filter(note => note.sessionId === "ses1"),
    reportStatus: "completed"
  },
  {
    id: "ses2",
    date: "2025-06-22",
    patientId: "pat1",
    professionalId: "prof1",
    notes: "Se observa mejor respuesta en ejercicios de agarre.",
    progress: "Ligera mejora en coordinación de mano derecha.",
    exercises: [exercises[0], exercises[4]],
    recommendations: "Reforzar ejercicios de agarre con objetos de diferentes tamaños.",
    type: "Seguimiento",
    time: "09:00",
    duration: 45,
    mediaFiles: mediaFiles.filter(media => media.sessionId === "ses2"),
    billingDocuments: billingDocuments.filter(bill => bill.sessionId === "ses2"),
    reportStatus: "completed"
  },
  {
    id: "ses3",
    date: "2025-06-29",
    patientId: "pat1",
    professionalId: "prof1",
    notes: "Continúa progreso en motricidad fina, comienza trabajo de equilibrio.",
    progress: "Avance notable en precisión de agarre con mano derecha.",
    exercises: [exercises[0], exercises[1], exercises[4]],
    recommendations: "Incrementar dificultad de ejercicios de equilibrio gradualmente.",
    type: "Seguimiento",
    time: "09:00",
    duration: 45,
    reportStatus: "completed"
  },
  {
    id: "ses4",
    date: "2025-07-03",
    patientId: "pat2",
    professionalId: "prof1",
    notes: "Evaluación inicial. Presenta espasticidad en extremidades inferiores.",
    progress: "Se establece plan de tratamiento enfocado en reducir espasticidad.",
    exercises: [exercises[1], exercises[3]],
    recommendations: "Realizar estiramientos suaves diariamente.",
    type: "Evaluación inicial",
    time: "11:00",
    duration: 60,
    evaluation: sessionEvaluations.find(evaluation => evaluation.sessionId === "ses4"),
    mediaFiles: mediaFiles.filter(media => media.sessionId === "ses4"),
    billingDocuments: billingDocuments.filter(bill => bill.sessionId === "ses4"),
    reportStatus: "completed"
  },
  {
    id: "ses5",
    date: "2025-07-05",
    patientId: "pat3",
    professionalId: "prof2",
    notes: "Evaluación sensorial. Muestra hipersensibilidad táctil.",
    progress: "Se identifican patrones de respuesta ante diferentes estímulos.",
    exercises: [exercises[2]],
    recommendations: "Introducir gradualmente diferentes texturas en actividades diarias.",
    type: "Evaluación sensorial",
    time: "15:00",
    duration: 45,
    evaluation: sessionEvaluations.find(evaluation => evaluation.sessionId === "ses5"),
    mediaFiles: mediaFiles.filter(media => media.sessionId === "ses5"),
    billingDocuments: billingDocuments.filter(bill => bill.sessionId === "ses5"),
    collaboratorNotes: collaboratorNotes.filter(note => note.sessionId === "ses5"),
    reportStatus: "completed"
  },
  {
    id: "ses6",
    date: "2025-07-10",
    patientId: "pat4",
    professionalId: "prof2",
    notes: "Sesión preventiva. Desarrollo típico observado.",
    progress: "Sin anomalías detectadas, se refuerzan habilidades motoras básicas.",
    exercises: [exercises[4]],
    recommendations: "Continuar con sesiones preventivas mensuales.",
    type: "Seguimiento preventivo",
    time: "10:00",
    duration: 30,
    reportStatus: "completed"
  },
  {
    id: "ses7",
    date: "2025-07-12",
    patientId: "pat5",
    professionalId: "prof3",
    notes: "Primera sesión. Hipotonía muscular evidente.",
    progress: "Se inicia trabajo en fortalecimiento muscular.",
    exercises: [exercises[3], exercises[1]],
    recommendations: "Realizar ejercicios de fortalecimiento en casa.",
    type: "Evaluación inicial",
    time: "14:00",
    duration: 60,
    collaboratorNotes: collaboratorNotes.filter(note => note.sessionId === "ses7"),
    reportStatus: "completed"
  },
  {
    id: "ses8",
    date: "2025-07-15",
    patientId: "pat6",
    professionalId: "prof2",
    notes: "Dificultades de lenguaje trabajadas con ejercicios básicos.",
    progress: "Mejora en pronunciación de palabras simples.",
    exercises: [exercises[4]],
    recommendations: "Practicar palabras nuevas diariamente.",
    type: "Terapia de lenguaje",
    time: "16:00",
    duration: 45,
    reportStatus: "pending"
  },
  {
    id: "ses9",
    date: "2025-07-18",
    patientId: "pat7",
    professionalId: "prof3",
    notes: "Déficit de atención trabajado con actividades estructuradas.",
    progress: "Mejora en la capacidad de concentración durante actividades.",
    exercises: [exercises[0], exercises[4]],
    recommendations: "Implementar rutinas diarias estructuradas.",
    type: "Terapia ocupacional",
    time: "13:00",
    duration: 50,
    reportStatus: "pending"
  },
  {
    id: "ses10",
    date: "2025-07-20",
    patientId: "pat8",
    professionalId: "prof1",
    notes: "Retraso en el desarrollo del habla. Se trabaja en vocabulario básico.",
    progress: "Incremento en el uso de palabras nuevas.",
    exercises: [exercises[4]],
    recommendations: "Reforzar vocabulario con actividades lúdicas.",
    type: "Terapia de habla",
    time: "11:00",
    duration: 40,
    reportStatus: "pending"
  }
];

// Helper Functions
export const getPatientsByProfessional = (professionalId: string): Patient[] => {
  return patients.filter(patient => patient.professionalId === professionalId);
};

export const getSessionsByPatient = (patientId: string): Session[] => {
  return sessions.filter(session => session.patientId === patientId);
};

export const getProfessionalById = (id: string): Professional | undefined => {
  return professionals.find(prof => prof.id === id);
};

export const getPatientById = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

export const getSessionById = (id: string): Session | undefined => {
  return sessions.find(session => session.id === id);
};

export const getPendingEvaluations = (professionalId: string): Session[] => {
  return sessions.filter(session => {
    const sessionDateTime = new Date(session.date);
    sessionDateTime.setHours(parseInt(session.time.split(':')[0]), parseInt(session.time.split(':')[1]));

    return (
      session.professionalId === professionalId &&
      sessionDateTime < new Date() && // Session already happened
      (!session.reportStatus || session.reportStatus === 'pending') // Report is pending
    );
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Oldest first
};

export const getCompletedEvaluations = (professionalId: string): Session[] => {
  return sessions.filter(session => {
    return (
      session.professionalId === professionalId &&
      session.reportStatus === 'completed'
    );
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Newest first
};
