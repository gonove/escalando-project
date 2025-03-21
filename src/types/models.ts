
export interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  parentName: string;
  contactNumber: string;
  email?: string;
  diagnosis?: string;
  notes?: string;
  professionalId: string;
}

export interface Session {
  id: string;
  date: string;
  patientId: string;
  professionalId: string;
  notes: string;
  progress: string;
  exercises?: Exercise[];
  recommendations?: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration?: string;
  frequency?: string;
  instructions?: string;
}
