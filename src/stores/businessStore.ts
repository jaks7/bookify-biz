import { create } from 'zustand';
import axios from 'axios';
import { ENDPOINTS } from '@/config/api';
import { Business } from '@/types/business';
import { Booking, BookingFormData } from '@/types/booking';
import { format } from 'date-fns';

interface BusinessStore {
  business: Business | null;
  loading: boolean;
  error: string | null;
  bookings: Booking[];
  fetchBusiness: (businessId: string) => Promise<void>;
  updateBusiness: (businessId: string, data: Partial<Business>) => Promise<boolean>;
  fetchBookings: (businessId: string, date: Date, professionalId?: number) => Promise<void>;
  createBooking: (businessId: string, data: BookingFormData) => Promise<boolean>;
  updateBooking: (businessId: string, bookingId: string, data: Partial<BookingFormData>) => Promise<boolean>;
  deleteBooking: (businessId: string, bookingId: string) => Promise<boolean>;
}

export const useBusinessStore = create<BusinessStore>((set, get) => ({
  business: null,
  loading: false,
  error: null,
  bookings: [],
  
  fetchBusiness: async (businessId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get<Business>(ENDPOINTS.BUSINESS_DETAIL(businessId));
      set({ business: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching business:', error);
      set({ error: 'Error al cargar los datos del negocio', loading: false });
    }
  },
  
  updateBusiness: async (businessId: string, data: Partial<Business>) => {
    try {
      set({ loading: true, error: null });
      await axios.put(ENDPOINTS.BUSINESS_UPDATE(businessId), data);
      set(state => ({ 
        business: state.business ? { ...state.business, ...data } : null,
        loading: false 
      }));
      return true;
    } catch (error) {
      console.error('Error updating business:', error);
      set({ error: 'Error al actualizar los datos del negocio', loading: false });
      return false;
    }
  },
  
  fetchBookings: async (businessId: string, date: Date, professionalId?: number) => {
    try {
      set({ loading: true, error: null });
      
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      let queryParams = `?date=${formattedDate}`;
      if (professionalId) {
        queryParams += `&professional_id=${professionalId}`;
      }
      
      const response = await axios.get<Booking[]>(`${ENDPOINTS.BOOKINGS(businessId)}${queryParams}`);
      set({ bookings: response.data, loading: false });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      set({ error: 'Error al cargar las reservas', loading: false });
      return [];
    }
  },
  
  createBooking: async (businessId: string, data: BookingFormData) => {
    try {
      set({ loading: true, error: null });
      await axios.post(ENDPOINTS.BOOKINGS(businessId), data);
      
      const date = new Date(data.start_datetime);
      await get().fetchBookings(businessId, date);
      
      set({ loading: false });
      return true;
    } catch (error) {
      console.error('Error creating booking:', error);
      set({ error: 'Error al crear la reserva o bloqueo', loading: false });
      return false;
    }
  },
  
  updateBooking: async (businessId: string, bookingId: string, data: Partial<BookingFormData>) => {
    try {
      set({ loading: true, error: null });
      await axios.put(`${ENDPOINTS.BOOKING_DETAIL(businessId, bookingId)}`, data);
      
      set(state => ({
        bookings: state.bookings.map(booking => 
          booking.booking_id === bookingId 
            ? { ...booking, ...data } 
            : booking
        ),
        loading: false
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating booking:', error);
      set({ error: 'Error al actualizar la reserva o bloqueo', loading: false });
      return false;
    }
  },
  
  deleteBooking: async (businessId: string, bookingId: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${ENDPOINTS.BOOKING_DETAIL(businessId, bookingId)}`);
      
      set(state => ({
        bookings: state.bookings.filter(booking => booking.booking_id !== bookingId),
        loading: false
      }));
      
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      set({ error: 'Error al eliminar la reserva o bloqueo', loading: false });
      return false;
    }
  }
}));
