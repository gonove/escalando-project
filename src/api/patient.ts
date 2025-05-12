import axios from "axios";
// import { getPatientById, patients, getSessionsByPatient } from "../data/mockData";
import { Patient, PatientContact, Session } from "../types/models";

// Get all patients from the backend
// localhost:3000/api/patient/?limit=3&offset=3
export const getPatients = async (limit: number, offset: number): Promise<Patient[]> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/patient/?limit=${limit}&offset=${offset}`);
  const data = await response.data;
  return data;
};

// Get patient by id
export const getPatientById = async (id: string): Promise<Patient | null> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/patient/${id}`);
  const data = await response.data;
  return data;
};

// Update patient by id
export const updatePatientById = async (id: string, patient: Partial<Patient>): Promise<Patient | null> => {
  const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/patient/${id}`, patient);
  const data = await response.data;
  return data;
};

// Get patient contacts by patient id
export const getPatientContactsByPatientId = async (patientId: string): Promise<PatientContact[]> => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/patient-contacts/${patientId}`);
  const data = await response.data;
  return data;
};

// // Get sessions for a patient (simulated API call with mock data)
// export const getPatientSessions = async (patientId: string): Promise<Session[]> => {
//   // Simulating API delay
//   await new Promise(resolve => setTimeout(resolve, 400));
//   return getSessionsByPatient(patientId);
// };

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
