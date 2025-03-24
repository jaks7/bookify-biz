
import { create } from 'zustand';
import axios from 'axios';
import { ENDPOINTS } from '@/config/api';
import { BusinessHours } from '@/types/availability';
import { BusinessConfig } from '@/types/business';

interface AvailabilityState {
  businessConfig: BusinessConfig | null;
  businessHours: BusinessHours;
  loading: boolean;
  error: string | null;
  fetchBusinessConfig: (businessId: string) => Promise<void>;
  updateBusinessConfig: (businessId: string, config: Partial<BusinessConfig>, businessHours: BusinessHours) => Promise<boolean>;
}

export const useAvailabilityStore = create<AvailabilityState>((set, get) => ({
  businessConfig: null,
  businessHours: {},
  loading: false,
  error: null,
  
  fetchBusinessConfig: async (businessId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get<BusinessConfig>(ENDPOINTS.BUSINESS_CONFIG_DETAIL(businessId));
      
      set({ 
        businessConfig: response.data,
        businessHours: response.data.business_hours || {},
        loading: false 
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching business config:', error);
      set({ 
        error: 'Error al cargar la configuración', 
        loading: false 
      });
    }
  },
  
  updateBusinessConfig: async (businessId: string, config: Partial<BusinessConfig>, businessHours: BusinessHours) => {
    try {
      set({ loading: true, error: null });
      
      const updatedConfig = {
        ...config,
        business_hours: businessHours
      };
      
      if (get().businessConfig) {
        await axios.put(
          ENDPOINTS.BUSINESS_CONFIG_UPDATE(businessId),
          updatedConfig
        );
      } else {
        await axios.post(
          ENDPOINTS.BUSINESS_CONFIG_CREATE(businessId),
          updatedConfig
        );
      }
      
      set({ 
        businessConfig: { ...get().businessConfig, ...updatedConfig } as BusinessConfig,
        businessHours,
        loading: false 
      });
      
      return true;
    } catch (error) {
      console.error('Error updating business config:', error);
      set({ 
        error: 'Error al actualizar la configuración', 
        loading: false 
      });
      return false;
    }
  }
}));
