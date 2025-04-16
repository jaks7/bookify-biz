
export interface Service {
  id: number;
  service_id?: number; // Añadido para compatibilidad
  name: string;
  description?: string;
  duration: number;
  price: number;
  business_id?: string;
  is_active?: boolean;
  professionals?: number[]; // Añadido para compatibilidad
}
