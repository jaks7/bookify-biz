import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '@/config/api';
import { Professional } from '@/types/professional';

interface ProfessionalContextType {
  professionals: Professional[];
  loading: boolean;
  error: string | null;
  fetchProfessionals: (businessId: string) => Promise<void>;
}

const ProfessionalContext = createContext<ProfessionalContextType | undefined>(undefined);

export const ProfessionalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfessionals = async (businessId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Professional[]>(ENDPOINTS.PROFESSIONALS(businessId));
      setProfessionals(response.data || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      setError('Error al cargar los profesionales');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfessionalContext.Provider 
      value={{ 
        professionals, 
        loading, 
        error, 
        fetchProfessionals 
      }}
    >
      {children}
    </ProfessionalContext.Provider>
  );
};

export const useProfessional = () => {
  const context = useContext(ProfessionalContext);
  if (context === undefined) {
    throw new Error('useProfessional must be used within a ProfessionalProvider');
  }
  return context;
}; 