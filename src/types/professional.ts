
export interface Appointment {
  id: string;
  time: string;
  duration: number;
  clientName?: string;
  service?: string;
}

export interface WorkingHours {
  start: string;
  end: string;
}

export interface Professional {
  id: number;
  name: string;
  isWorking?: boolean;
  workingHours?: WorkingHours[];
  appointments?: Appointment[];
}
