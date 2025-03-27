
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

export interface ProfessionalAvailability {
  datetime_start: string;
  datetime_end: string;
}

export interface Professional {
  id: number;
  professional_id: number;
  name: string;
  surnames?: string | null;
  fullname: string;
  isWorking?: boolean;
  workingHours?: WorkingHours[];
  appointments?: Appointment[];
  availabilities?: ProfessionalAvailability[];
}

export interface DailyScheduleData {
  date: string;
  business_hours: {
    datetime_start: string;
    datetime_end: string;
  }[];
  professionals: Professional[];
  bookings: any[];
}
