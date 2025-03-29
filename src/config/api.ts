export const API_BASE_URL = 'http://127.0.0.1:8000';

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/dj-rest-auth/login/`,
  ME: `${API_BASE_URL}/members/me/`,
  ME_UPDATE: `${API_BASE_URL}/members/me/update/`,
  BUSINESSES: `${API_BASE_URL}/business/`,
  BUSINESSES_CREATE: `${API_BASE_URL}/business/create/`,
  BUSINESS_DETAIL: (businessId: string) => `${API_BASE_URL}/business/${businessId}/`,
  BUSINESS_UPDATE: (businessId: string) => `${API_BASE_URL}/business/${businessId}/update/`,

  PROFESSIONALS: (businessId: string) => `${API_BASE_URL}/business/${businessId}/professionals/`,
  PROFESSIONALS_CREATE: (businessId: string) => `${API_BASE_URL}/business/${businessId}/professionals/create/`,
  PROFESSIONAL_DELETE: (businessId: string, professionalId: string) => 
    `${API_BASE_URL}/business/${businessId}/professionals/${professionalId}/delete/`,
  PROFESSIONAL_UPDATE: (businessId: string, professionalId: string) => 
    `${API_BASE_URL}/business/${businessId}/professionals/${professionalId}/update/`,

  SERVICES: (businessId: string) => `${API_BASE_URL}/business/${businessId}/services/`,
  SERVICES_CREATE: (businessId: string) => `${API_BASE_URL}/business/${businessId}/services/create/`,
  SERVICE_DELETE: (businessId: string, serviceId: string) => 
    `${API_BASE_URL}/business/${businessId}/services/${serviceId}/delete/`,
  SERVICE_UPDATE: (businessId: string, serviceId: string) => 
    `${API_BASE_URL}/business/${businessId}/services/${serviceId}/update/`,

  BUSINESS_CONFIG_CREATE: (businessId: string) => 
    `${API_BASE_URL}/business/${businessId}/configuration/create/`,
  BUSINESS_CONFIG_DETAIL: (businessId: string) => 
    `${API_BASE_URL}/business/${businessId}/configuration/`,
  BUSINESS_CONFIG_UPDATE: (businessId: string) => 
    `${API_BASE_URL}/business/${businessId}/configuration/update/`,
  PROFESSIONAL_AVAILABILITY: (businessId: string) => 
    `${API_BASE_URL}/business/${businessId}/availability/`,

  AVAILABILITY_PATTERNS: (businessId: string) => `${API_BASE_URL}/calendars/${businessId}/patterns/`,

  // Bookings endpoints
  BOOKINGS: (businessId: string) => `${API_BASE_URL}/calendars/${businessId}/bookings/`,
  BOOKING_DETAIL: (businessId: string, bookingId: string) => 
    `${API_BASE_URL}/calendars/${businessId}/bookings/${bookingId}/`,
  BOOKING_CREATE: (businessId: string) => 
    `${API_BASE_URL}/calendars/${businessId}/bookings/create/`,
  BOOKING_UPDATE: (businessId: string, bookingId: string) => 
    `${API_BASE_URL}/calendars/${businessId}/bookings/${bookingId}/update/`,

  SHIFTS: (businessId: string) => `${API_BASE_URL}/calendars/${businessId}/shifts/`,
  SHIFTS_CREATE: (businessId: string) => `${API_BASE_URL}/calendars/${businessId}/shifts/create/`,
  SHIFT_DETAIL: (businessId: string, shiftId: string) => `${API_BASE_URL}/calendars/${businessId}/shifts/${shiftId}/`,
  SHIFT_UPDATE: (businessId: string, shiftId: string) => `${API_BASE_URL}/calendars/${businessId}/shifts/${shiftId}/update/`,
  SHIFT_DELETE: (businessId: string, shiftId: string) => `${API_BASE_URL}/calendars/${businessId}/shifts/${shiftId}/delete/`,
  SHIFT: (businessId: string, shiftId: string) => 
    `${API_BASE_URL}/calendars/${businessId}/shifts/${shiftId}/`,
  EXCEPTIONS_DELETE: (businessId: string, exceptionId: string) => 
    `${API_BASE_URL}/calendars/${businessId}/exceptions/${exceptionId}/delete/`,
  BUSINESS_SCHEDULE: (businessId: string) => 
    `${API_BASE_URL}/calendars/${businessId}/schedule/`,
} as const;
