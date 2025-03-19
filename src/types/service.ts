export interface Service {
  service_id: string;
  name: string;
  duration: number;
  price: string;
  professionals: {
    professional_id: string;
    name: string;
    surnames: string;
    fullname: string;
  }[];
} 