import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '@/config/api';

// Types
interface Profile {
  name: string;
  surnames: string;
  phone: string;
  address: string;
}

interface Business {
  business_id: string;
  name: string;
  type_of_business: string;
  configuration_is_completed: boolean;
}

interface User {
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  profile: Profile | null;
  currentBusiness: Business | null;
  availableBusinesses: Business[];
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  fetchUserData: () => Promise<any>;
  switchBusiness: (businessId: string) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Configurar axios para incluir el token en todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem('token') || null,
    user: null,
    profile: null,
    currentBusiness: null,
    availableBusinesses: [],
    isLoading: false,
    isAuthenticated: !!localStorage.getItem('token'),
  });

  const initialized = useRef(false);

  // Solo llamar a fetchUserData una vez al iniciar
  useEffect(() => {
    const initializeAuth = async () => {
      if (initialized.current) return;
      
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        initialized.current = true;
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        const response = await axios.get('http://127.0.0.1:8000/members/me/');
        
        setState(prev => ({
          ...prev,
          user: { email: response.data.email },
          profile: response.data.profile,
          currentBusiness: response.data.current_business,
          availableBusinesses: response.data.available_businesses,
          isAuthenticated: true
        }));
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      }
    };

    initializeAuth();
  }, []); // Solo se ejecuta una vez al montar el componente

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await axios.get(ENDPOINTS.ME);
      setState(prev => ({
        ...prev,
        user: { email: response.data.email },
        profile: response.data.profile,
        currentBusiness: response.data.current_business,
        availableBusinesses: response.data.available_businesses,
        isLoading: false,
        isAuthenticated: true
      }));
      return response.data;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      console.error('Error al obtener datos del usuario:', error);
      throw error;
    }
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post(ENDPOINTS.LOGIN, credentials);
      const token = response.data.key;
      
      localStorage.setItem('token', token);
      // Ya no necesitamos configurar axios.defaults aquí porque lo manejamos con el interceptor
      
      setState(prev => ({ ...prev, token }));
      await fetchUserData();
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    initialized.current = false;
    localStorage.removeItem('token');
    // Ya no necesitamos limpiar axios.defaults aquí
    
    setState({
      token: null,
      user: null,
      profile: null,
      currentBusiness: null,
      availableBusinesses: [],
      isLoading: false,
      isAuthenticated: false
    });
  };

  const switchBusiness = async (businessId: string) => {
    try {
      await axios.put(ENDPOINTS.ME_UPDATE, {
        current_business_id: businessId
      });
      await fetchUserData();
    } catch (error) {
      console.error('Error switching business:', error);
      throw error;
    }
  };

  const values = {
    ...state,
    login,
    logout,
    fetchUserData,
    switchBusiness
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
