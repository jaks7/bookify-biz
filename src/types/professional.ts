
export interface Appointment {
  id: string;
  time: string;
  duration: number;
  clientName: string;
  service: string;
}

export interface Professional {
  id: string;
  name: string;
  isWorking?: boolean;
  workingHours?: { start: string; end: string }[];
  appointments?: Appointment[];
  professional_id?: number; // Added to support the backend format
  surnames?: string; // Added to support other pages
  email?: string; // Added to support other pages
  lastName?: string; // Added to support legacy code
}
