
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
  dateOfBirth: string;
  parentName?: string;
  contactNumber?: string;
  developmentalMilestones?: DevelopmentalMilestone[];
}

export interface DevelopmentalMilestone {
  id: string;
  patientId: string;
  ageMonths: number;
  date: string;
  milestone: string;
  category: 'motor' | 'cognitive' | 'language' | 'social' | 'other';
  notes?: string;
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
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
  billingStatus?: 'pending' | 'completed' | 'cancelled';
  billingDocuments?: BillingDocument[];
  reportStatus?: 'pending' | 'completed';
  mediaFiles?: MediaFile[];  // Added for session media files
  evaluation?: SessionEvaluation;  // Added for detailed session evaluation
  collaboratorNotes?: CollaboratorNote[];  // Added for notes from other professionals
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  dayOfWeek?: number; // 0-6, where 0 is Sunday
  endDate?: string;
  occurrences?: number;
}

export interface BillingDocument {
  id: string;
  sessionId: string;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  type: 'invoice' | 'receipt' | 'other';
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

// New interfaces for session documentation

export interface MediaFile {
  id: string;
  sessionId: string;
  fileName: string;
  fileUrl: string;
  type: 'image' | 'video' | 'audio' | 'document';
  uploadDate: string;
  notes?: string;
}

export interface SessionEvaluation {
  id: string;
  sessionId: string;
  developmentArea: string;
  objectives: string;
  activities: string;
  patientResponse: string;
  observations: string;
  achievedMilestones: string;
  nextSteps: string;
  recommendations: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollaboratorNote {
  id: string;
  sessionId: string;
  professionalId: string;
  content: string;
  createdAt: string;
  isPrivate: boolean;
}
