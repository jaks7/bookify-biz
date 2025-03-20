
export interface Professional {
  id: string;
  name: string;
  isWorking: boolean; // Make this required
  workingHours?: { start: string; end: string }[];
  appointments?: Appointment[];
}

export interface Appointment {
  id: string;
  time: string;
  duration: number;
  clientName?: string;
  service?: string;
}
