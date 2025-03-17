
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
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
        const response = await axios.post('http://127.0.0.1:8000/dj-rest-auth/login/', credentials);
        this.token = response.data.key;
        localStorage.setItem('token', response.data.key);
        axios.defaults.headers.common['Authorization'] = `Token ${response.data.key}`;
        await this.fetchUserData();
        return true;
      } catch (error) {
        console.error('Error en login:', error);
        throw error;
      }
    },
    
    async fetchUserData() {
      this.isLoading = true;
      try {
        const response = await axios.get('http://127.0.0.1:8000/me/', {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        });
        
        this.user = {
          email: response.data.email
        };
        this.profile = response.data.profile;
        this.currentBusiness = response.data.current_business;
        this.availableBusinesses = response.data.available_businesses;
        
        return response.data;
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        throw error;
      } finally {
        this.isLoading = false;
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
    
    switchBusiness(businessId) {
      const business = this.availableBusinesses.find(b => b.business_id === businessId);
      if (business) {
        this.currentBusiness = business;
        // Aquí podría ir una llamada a la API para cambiar el negocio actual
      }
    }
  },
}); 
