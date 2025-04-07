
import {
  sessions,
  getSessionById,
  getPendingEvaluations,
  getCompletedEvaluations,
  sessionEvaluations
} from "../data/mockData";
import { Session, SessionEvaluation } from "../types/models";

// Get all sessions (simulated API call with mock data)
export const getSessions = async (): Promise<Session[]> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return sessions;
};

// Get session by id (simulated API call with mock data)
export const getSessionByIdApi = async (id: string): Promise<Session | null> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const session = getSessionById(id);
  return session || null;
};

// Get pending evaluations for a professional
export const getPendingEvaluationsForProfessional = async (professionalId: string): Promise<Session[]> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return getPendingEvaluations(professionalId);
};

// Get completed evaluations for a professional
export const getCompletedEvaluationsForProfessional = async (professionalId: string): Promise<Session[]> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return getCompletedEvaluations(professionalId);
};

// Get evaluation for a specific session
export const getSessionEvaluation = async (sessionId: string): Promise<SessionEvaluation | null> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const evaluation = sessionEvaluations.find(evaluation => evaluation.sessionId === sessionId);
  return evaluation || null;
};

// Create or update a session evaluation
export const saveSessionEvaluation = async (evaluation: SessionEvaluation): Promise<SessionEvaluation> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  // In a real API, this would create or update the evaluation in the database
  // For now, we'll just return the evaluation as if it was saved
  return {
    ...evaluation,
    updatedAt: new Date().toISOString()
  };
};
