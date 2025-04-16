
import React, { useEffect, useState } from "react";
import { BusinessDetails } from "@/components/business/BusinessDetails";
import { BusinessDetail } from "@/types/booking";
import axios from "axios";
import { ENDPOINTS } from "@/config/api";
import { useAuth } from "@/stores/authContext";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Un ejemplo de datos por defecto en caso de error o mientras se cargan
const fallbackBusinessData: BusinessDetail = {
  name: "Cargando...",
  description: null,
  address: "",
  phone: null,
  business_hours: {
    "1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": []
  },
  services: []
};

const BusinessDetailsPage = () => {
  const [business, setBusiness] = useState<BusinessDetail>(fallbackBusinessData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useParams<{ businessId: string }>();
  const { currentBusiness } = useAuth();

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Decidir qué ID de negocio usar, el de la URL o el del contexto
        const id = businessId || currentBusiness?.business_id;
        
        if (!id) {
          throw new Error("No se encontró ID del negocio");
        }
        
        const response = await axios.get(ENDPOINTS.BUSINESS_DETAIL(id));
        console.log("Business data loaded:", response.data);
        
        // Transformar datos si es necesario
        setBusiness(response.data);
      } catch (err) {
        console.error("Error fetching business details:", err);
        setError("No se pudieron cargar los detalles del negocio");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [businessId, currentBusiness?.business_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto text-center">
          <div className="p-6 bg-white rounded-lg shadow-sm max-w-lg mx-auto">
            <h2 className="text-xl font-medium text-red-600 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto">
        <BusinessDetails business={business} reservationPath="/reservation" />
      </div>
    </div>
  );
};

export default BusinessDetailsPage;
