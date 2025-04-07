
import { professionals, getProfessionalById } from "../data/mockData";
import { Professional } from "../types/models";

// Get all professionals (simulated API call with mock data)
export const getProfessionals = async (): Promise<Professional[]> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return professionals;
};

// Get professional by id (simulated API call with mock data)
export const getProfessionalByIdApi = async (id: string): Promise<Professional | null> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const professional = getProfessionalById(id);
  return professional || null;
};

// Update professional data (simulated API call)
export const updateProfessionalProfile = async (id: string, data: Partial<Professional>): Promise<Professional> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real API, this would update the professional in the database
  // For now, we'll just return a merged object as if it was updated
  const existingProfessional = getProfessionalById(id);
  
  if (!existingProfessional) {
    throw new Error("Professional not found");
  }
  
  return {
    ...existingProfessional,
    ...data
  };
};
