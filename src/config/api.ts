
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
}; 
