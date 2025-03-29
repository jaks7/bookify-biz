import { create } from 'zustand';
import axios from 'axios';
import { ENDPOINTS } from '@/config/api';
import { DailyScheduleData } from '@/types/professional';
import { format } from 'date-fns';

interface CalendarStore {
  schedule: DailyScheduleData | null;
  loading: boolean;
  error: string | null;
  fetchDailySchedule: (businessId: string, date: Date, professionalId?: string) => Promise<void>;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  schedule: null,
  loading: false,
  error: null,

  fetchDailySchedule: async (businessId: string, date: Date, professionalId?: string) => {
    try {
      set({ loading: true, error: null });
      
      // Construir parámetros de consulta
      const params: Record<string, string> = {
        date: format(date, 'yyyy-MM-dd')
      };
      if (professionalId) {
        params.professional_id = professionalId;
      }

      const response = await axios.get<DailyScheduleData[]>(
        ENDPOINTS.BUSINESS_SCHEDULE(businessId),
        { params }
      );

      // La API devuelve un array, pero para un día específico solo necesitamos el primer elemento
      set({ 
        schedule: response.data[0] || null,
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching schedule:', error);
      set({ 
        error: 'Error al cargar el horario', 
        loading: false,
        schedule: null
      });
    }
  }
})); 