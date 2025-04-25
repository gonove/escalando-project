
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

// Get professional availability (simulated API call)
export const getProfessionalAvailability = async (professionalId: string): Promise<AvailabilityData> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock data for weekly template
  const mockWeeklyTemplate = {
    monday: createDefaultDaySlots(true),
    tuesday: createDefaultDaySlots(true),
    wednesday: createDefaultDaySlots(true),
    thursday: createDefaultDaySlots(true),
    friday: createDefaultDaySlots(true),
    saturday: createDefaultDaySlots(false, 13),
    sunday: createDefaultDaySlots(false),
  };
  
  // Mock data for exceptions
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  
  const exceptions: ExceptionData[] = [
    {
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString().split('T')[0],
      type: 'unavailable',
      reason: 'Personal day off'
    },
    {
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5).toISOString().split('T')[0],
      type: 'custom',
      slots: createCustomExceptionSlots()
    },
    {
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10).toISOString().split('T')[0],
      type: 'unavailable',
      reason: 'Conference'
    }
  ];
  
  return {
    professionalId,
    weeklyTemplate: mockWeeklyTemplate,
    exceptions,
  };
};

// Update professional availability (simulated API call)
export const updateProfessionalAvailability = async (
  professionalId: string, 
  data: AvailabilityData
): Promise<AvailabilityData> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real API, this would update the availability in the database
  // For now, we'll just return the same data as if it was updated
  return data;
};

// Helper types for availability
export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DaySlots {
  enabled: boolean;
  slots: TimeSlot[];
}

export interface WeeklyTemplate {
  monday: DaySlots;
  tuesday: DaySlots;
  wednesday: DaySlots;
  thursday: DaySlots;
  friday: DaySlots;
  saturday: DaySlots;
  sunday: DaySlots;
}

export interface ExceptionData {
  date: string;
  type: 'unavailable' | 'custom';
  reason?: string;
  slots?: TimeSlot[];
}

export interface AvailabilityData {
  professionalId: string;
  weeklyTemplate: WeeklyTemplate;
  exceptions: ExceptionData[];
}

// Helper function to create default time slots for a day
function createDefaultDaySlots(enabled: boolean, endHour = 17): DaySlots {
  const slots: TimeSlot[] = [];
  const startHour = 9;
  
  // Create slots in 45-minute increments
  for (let hour = startHour; hour < endHour; hour++) {
    // First slot of the hour (xx:00 - xx:45)
    slots.push({ time: `${hour.toString().padStart(2, '0')}:00`, available: enabled });
    
    // Second slot of the hour (xx:45 - (xx+1):30)
    slots.push({ time: `${hour.toString().padStart(2, '0')}:45`, available: enabled });
  }
  
  return {
    enabled,
    slots
  };
}

// Helper function to create custom exception slots
function createCustomExceptionSlots(): TimeSlot[] {
  const baseSlots = createDefaultDaySlots(false).slots;
  
  // Make some slots available for the custom exception
  return baseSlots.map((slot, index) => {
    // Make every third slot available for demo purposes
    if (index % 3 === 0) {
      return { ...slot, available: true };
    }
    return slot;
  });
}
