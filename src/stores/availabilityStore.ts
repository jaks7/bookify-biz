
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '@/config/api';
import { BusinessHours } from '@/types/availability';
import { BusinessConfig } from '@/types/business';

interface AvailabilityContextType {
  businessConfig: BusinessConfig | null;
  businessHours: BusinessHours;
  loading: boolean;
  error: string | null;
  fetchBusinessConfig: (businessId: string) => Promise<void>;
  updateBusinessConfig: (businessId: string, config: Partial<BusinessConfig>, businessHours: BusinessHours) => Promise<boolean>;
}

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

export const AvailabilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHours>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinessConfig = async (businessId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<BusinessConfig>(ENDPOINTS.BUSINESS_CONFIG_DETAIL(businessId));
      
      setBusinessConfig(response.data);
      setBusinessHours(response.data.business_hours || {});
      setLoading(false);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching business config:', error);
      setError('Error al cargar la configuración');
      setLoading(false);
    }
  };
  
  const updateBusinessConfig = async (businessId: string, config: Partial<BusinessConfig>, businessHours: BusinessHours) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedConfig = {
        ...config,
        business_hours: businessHours
      };
      
      if (businessConfig) {
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
      
      setBusinessConfig({ ...businessConfig, ...updatedConfig } as BusinessConfig);
      setBusinessHours(businessHours);
      setLoading(false);
      
      return true;
    } catch (error) {
      console.error('Error updating business config:', error);
      setError('Error al actualizar la configuración');
      setLoading(false);
      return false;
    }
  };

  return (
    <AvailabilityContext.Provider 
      value={{ 
        businessConfig, 
        businessHours, 
        loading, 
        error, 
        fetchBusinessConfig, 
        updateBusinessConfig 
      }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
};

export const useAvailability = () => {
  const context = useContext(AvailabilityContext);
  if (context === undefined) {
    throw new Error('useAvailability must be used within an AvailabilityProvider');
  }
  return context;
};
