
export interface Professional {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  email: string;
  phone: string;
  bio?: string;
}

export interface Patient {
  id: string;
  name: string;
  professionalId: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  status: string;
  diagnosis: string;
  notes: string;
  location: string;
  treatmentPlan: string | null;
  dateOfBirth: string;
  parentName?: string;
  contactNumber?: string;
}

export interface Session {
  id: string;
  patientId: string;
  professionalId: string;
  date: string;
  time: string;
  type: string;
  duration: number;
  progress: string;
  notes?: string;
  exercises?: Exercise[];
  recommendations?: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  repetitions: number;
  sets: number;
  completed: boolean;
  duration?: string;
  frequency?: string;
  instructions?: string;
}
