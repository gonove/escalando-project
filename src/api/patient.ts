
import { getPatientById, patients, getSessionsByPatient } from "../data/mockData";
import { Patient, Session } from "../types/models";

// Get all patients (simulated API call with mock data)
export const getPatients = async (): Promise<Patient[]> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return patients;
};

// Get patient by id (simulated API call with mock data)
export const getPatientByIdApi = async (id: string): Promise<Patient | null> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const patient = getPatientById(id);
  return patient || null;
};

// Get sessions for a patient (simulated API call with mock data)
export const getPatientSessions = async (patientId: string): Promise<Session[]> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return getSessionsByPatient(patientId);
};

// Future Axios implementation (commented out)
// export const getPatients = async () => {
//   try {
//     const response = await axios.get("http://localhost:3000/api/patient");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching patients:", error);
//     throw error;
//   }
// }
