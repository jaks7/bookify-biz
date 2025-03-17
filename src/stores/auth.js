import { defineStore } from 'pinia';
import axios from 'axios';

// This is a compatibility layer to provide access to the new React auth context
// through the old Pinia store API. This allows existing Vue components to continue
// working while we migrate to React context.
export const useAuthStore = defineStore('auth', {
  state: () => ({
    // These values will be overridden when the auth context is available
    token: localStorage.getItem('token') || null,
    user: null,
    profile: null,
    currentBusiness: null,
    availableBusinesses: [],
    isLoading: false,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.profile?.name || 'Usuario',
    userEmail: (state) => state.user?.email || '',
  },
  
  actions: {
    async login(credentials) {
      try {
        this.isLoading = true;
        // Llamada al endpoint de login
        const response = await axios.post('http://127.0.0.1:8000/dj-rest-auth/login/', {
          email: credentials.email,
          password: credentials.password
        });

        // Guardar token
        const token = response.data.key;
        this.token = token;
        localStorage.setItem('token', token);
        
        // Configurar axios para futuras peticiones
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;

        // Obtener datos del usuario
        await this.fetchUserData();

        return true;
      } catch (error) {
        console.error('Error en login:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchUserData() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/members/me/');
        this.user = { email: response.data.email };
        this.profile = response.data.profile;
        this.currentBusiness = response.data.current_business;
        this.availableBusinesses = response.data.available_businesses;
        return response.data;
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
    },
    
    logout() {
      this.token = null;
      this.user = null;
      this.profile = null;
      this.currentBusiness = null;
      this.availableBusinesses = [];
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
    
    async switchBusiness(businessId) {
      try {
        await axios.put('http://127.0.0.1:8000/members/me/update/', {
          current_business_id: businessId
        });
        await this.fetchUserData();
      } catch (error) {
        console.error('Error switching business:', error);
        throw error;
      }
    }
  },
});
