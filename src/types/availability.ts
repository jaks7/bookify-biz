
import { Professional } from "./professional";

export interface ProfessionalAvailability {
  id: string;
  professional: string;
  professionalName?: string; // For display purposes
  date: string;
  start_time: string;
  end_time: string;
}

export interface AvailabilityPattern {
  id: string;
  professional: string | null;
  professionalName?: string; // For display purposes
  name: string;
  start_date: string;
  end_date: string;
  days_of_week: string; // "1111100" for Mon-Fri
  start_time: string;
  end_time: string;
}
