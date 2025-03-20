
export interface Professional {
  id: string;
  name: string;
  isWorking?: boolean;
  workingHours?: { start: string; end: string }[];
  appointments?: Appointment[];
  professional_id?: string; // Added for compatibility
  surnames?: string; // Added for compatibility
  email?: string; // Added for compatibility
}

export interface Appointment {
  id: string;
  time: string;
  duration: number;
  clientName?: string;
  service?: string;
}
