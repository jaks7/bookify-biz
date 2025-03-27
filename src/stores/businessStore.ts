
import { create } from 'zustand';
import axios from 'axios';
import { ENDPOINTS } from '@/config/api';
import { Business } from '@/types/business';
import { Booking } from '@/types/booking';
import { format } from 'date-fns';

interface BusinessStore {
  business: Business | null;
  loading: boolean;
  error: string | null;
  fetchBusiness: (businessId: string) => Promise<void>;
  updateBusiness: (businessId: string, data: Partial<Business>) => Promise<boolean>;
  fetchBookings: (businessId: string, date: Date, professionalId?: number) => Promise<Booking[]>;
}

export const useBusinessStore = create<BusinessStore>((set, get) => ({
  business: null,
  loading: false,
  error: null,
  
  fetchBusiness: async (businessId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get<Business>(ENDPOINTS.BUSINESS_DETAIL(businessId));
      set({ business: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching business:', error);
      set({ error: 'Error al cargar los datos del negocio', loading: false });
    }
  },
  
  updateBusiness: async (businessId: string, data: Partial<Business>) => {
    try {
      set({ loading: true, error: null });
      await axios.put(ENDPOINTS.BUSINESS_UPDATE(businessId), data);
      set(state => ({ 
        business: state.business ? { ...state.business, ...data } : null,
        loading: false 
      }));
      return true;
    } catch (error) {
      console.error('Error updating business:', error);
      set({ error: 'Error al actualizar los datos del negocio', loading: false });
      return false;
    }
  },

  fetchBookings: async (businessId: string, date: Date, professionalId?: number) => {
    try {
      set({ loading: true, error: null });
      
      // Format date for API
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Build query params
      let params: Record<string, string> = { date: formattedDate };
      if (professionalId) {
        params.professional_id = professionalId.toString();
      }
      
      // Make API request
      const response = await axios.get<Booking[]>(ENDPOINTS.BOOKINGS(businessId), { params });
      
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      set({ error: 'Error al cargar las reservas', loading: false });
      return [];
    }
  }
}));
