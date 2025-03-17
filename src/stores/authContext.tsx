
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
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

  // Setup axios auth header if token exists
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Token ${state.token}`;
    }
  }, [state.token]);

  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/dj-rest-auth/login/', credentials);
      const token = response.data.key;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      setState(prev => ({
        ...prev,
        token,
        isAuthenticated: true
      }));
      
      await fetchUserData();
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const fetchUserData = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await axios.get('http://127.0.0.1:8000/me/', {
        headers: {
          'Authorization': `Token ${state.token}`
        }
      });
      
      setState(prev => ({
        ...prev,
        user: {
          email: response.data.email
        },
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
