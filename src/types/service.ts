
export interface Service {
  id: number;
  name: string;
  description?: string;
  duration: number;
  price: number;
  business_id?: string;
  is_active?: boolean;
}
