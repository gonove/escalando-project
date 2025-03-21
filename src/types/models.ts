
export interface Professional {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  email: string;
  phone: string;
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
}
