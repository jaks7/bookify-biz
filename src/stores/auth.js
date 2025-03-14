import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  
  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/dj-rest-auth/login/', credentials);
        this.token = response.data.key;
        localStorage.setItem('token', response.data.key);
        axios.defaults.headers.common['Authorization'] = `Token ${response.data.key}`;
        return true;
      } catch (error) {
        console.error('Error en login:', error);
        throw error;
      }
    },
    
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
  },
}); 