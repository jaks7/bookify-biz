
import { create } from 'zustand';
import axios from 'axios';
import { ENDPOINTS } from '@/config/api';
import { Professional } from '@/types/professional';

interface ProfessionalStore {
  professionals: Professional[];
  loading: boolean;
  error: string | null;
  fetchProfessionals: (businessId: string) => Promise<void>;
}

export const useProfessionalStore = create<ProfessionalStore>((set) => ({
  professionals: [],
  loading: false,
  error: null,
  fetchProfessionals: async (businessId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get<Professional[]>(ENDPOINTS.PROFESSIONALS(businessId));
      set({ professionals: response.data || [], loading: false });
    } catch (error) {
      console.error('Error fetching professionals:', error);
      set({ error: 'Error al cargar los profesionales', loading: false });
    }
  },
}));
