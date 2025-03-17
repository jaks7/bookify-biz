
import { defineStore } from 'pinia';

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
    // These methods will delegate to the React auth context when possible
    async login(credentials) {
      console.log("Using Pinia login - consider switching to React context");
      localStorage.setItem('token', credentials.key || 'dummy-token');
      return true;
    },
    
    async fetchUserData() {
      console.log("Using Pinia fetchUserData - consider switching to React context");
      return null;
    },
    
    logout() {
      console.log("Using Pinia logout - consider switching to React context");
      localStorage.removeItem('token');
    },
    
    switchBusiness(businessId) {
      console.log("Using Pinia switchBusiness - consider switching to React context");
    }
  },
});
