import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import axios from 'axios';

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

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem('token') || null,
    user: null,
    profile: null,
    currentBusiness: null,
    availableBusinesses: [],
    isLoading: false,
    isAuthenticated: !!localStorage.getItem('token'),
  });

  // Usar useRef para rastrear si ya se inicializó
  const initialized = useRef(false);

  // Inicializar datos del usuario una sola vez
  useEffect(() => {
    const initializeAuth = async () => {
      // Evitar múltiples inicializaciones
      if (initialized.current) return;
      initialized.current = true;

      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        const response = await axios.get('http://127.0.0.1:8000/members/me/');
        
        setState(prev => ({
          ...prev,
          token,
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
  }, []); // Solo se ejecuta una vez al montar

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/dj-rest-auth/login/', credentials);
      const token = response.data.key;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      const userResponse = await axios.get('http://127.0.0.1:8000/members/me/');
      setState(prev => ({
        ...prev,
        token,
        user: { email: userResponse.data.email },
        profile: userResponse.data.profile,
        currentBusiness: userResponse.data.current_business,
        availableBusinesses: userResponse.data.available_businesses,
        isAuthenticated: true
      }));
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const fetchUserData = async () => {
    if (!state.token) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await axios.get('http://127.0.0.1:8000/members/me/');
      setState(prev => ({
        ...prev,
        user: { email: response.data.email },
        profile: response.data.profile,
        currentBusiness: response.data.current_business,
        availableBusinesses: response.data.available_businesses,
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      console.error('Error al obtener datos del usuario:', error);
      throw error;
    }
  };

  const logout = () => {
    initialized.current = false; // Resetear el flag de inicialización
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    
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

  const switchBusiness = (businessId: string) => {
    const business = state.availableBusinesses.find(b => b.business_id === businessId);
    if (business) {
      setState(prev => ({ ...prev, currentBusiness: business }));
      // Aquí podría ir una llamada a la API para cambiar el negocio actual
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
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
