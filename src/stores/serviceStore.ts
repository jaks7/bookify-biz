
import { create } from 'zustand';
import axios from 'axios';
import { ENDPOINTS } from '@/config/api';
import { Service } from '@/types/service';

interface ServiceStore {
  services: Service[];
  loading: boolean;
  error: string | null;
  fetchServices: (businessId: string) => Promise<void>;
}

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  loading: false,
  error: null,
  fetchServices: async (businessId: string) => {
    try {
      set({ loading: true, error: null });
      console.log('Fetching services for business:', businessId);
      const response = await axios.get<Service[]>(ENDPOINTS.SERVICES(businessId));
      console.log('Services response:', response.data);
      
      // Asegúrate de que cada servicio tenga el service_id necesario
      const servicesWithIds = response.data.map(service => ({
        ...service,
        service_id: service.service_id || service.id
      }));
      
      set({ services: servicesWithIds || [], loading: false });
    } catch (error) {
      console.error('Error fetching services:', error);
      set({ error: 'Error al cargar los servicios', loading: false });
    }
  },
})); 
