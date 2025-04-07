

import axios from "axios";


export const getPatients = async () => {
    try {
        const response = await axios.get("http://localhost:3000/api/patient");
        return response.data;
    } catch (error) {
        console.error("Error fetching patients:", error);
        throw error;
    }
}