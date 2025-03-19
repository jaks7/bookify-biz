
export interface Professional {
  id: string;
  professional_id?: string;
  name: string;
  surnames?: string;
  email?: string;
  phone?: string;
  business?: string;
  isWorking?: boolean;
  workingHours?: { start: string; end: string }[];
  appointments?: Array<{
    id: string;
    time: string;
    duration: number;
    clientName: string;
    service: string;
  }>;
} 
