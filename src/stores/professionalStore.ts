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

function createStore<T>(createState: (set: any, get: any) => T): () => T {
  let state: T;
  const listeners: (() => void)[] = [];
  
  const setState = (partial: Partial<T> | ((state: T) => Partial<T>)) => {
    const nextState = typeof partial === 'function' 
      ? { ...state, ...partial(state) }
      : { ...state, ...partial };
    
    state = nextState as T;
    listeners.forEach(listener => listener());
  };
  
  const getState = () => state;
  
  state = createState(setState, getState);
  
  return () => state;
}

export const useProfessionalStore = createStore<ProfessionalStore>((set) => ({
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
