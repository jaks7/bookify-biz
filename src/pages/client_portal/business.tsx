
import React, { useState, useEffect } from "react";
import { BusinessDetails } from "@/components/business/BusinessDetails";
import { BusinessDetail } from "@/types/booking";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReservationDialog } from "@/components/client-portal/ReservationDialog";
import axios from "axios";
import { ENDPOINTS } from "@/config/api";
import { useAuth } from "@/stores/authContext";
import { useParams } from "react-router-dom";

// Datos de ejemplo en caso de error o mientras se cargan
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

const BusinessPage = () => {
  const [business, setBusiness] = useState<BusinessDetail>(fallbackBusinessData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const { businessId } = useParams<{ businessId: string }>();
  const { currentBusiness } = useAuth();

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Decidir qué ID de negocio usar
        const id = businessId || currentBusiness?.business_id;
        
        if (!id) {
          throw new Error("No se encontró ID del negocio");
        }
        
        const response = await axios.get(ENDPOINTS.BUSINESS_DETAIL(id));
        console.log("Business data loaded:", response.data);
        setBusiness(response.data);
      } catch (err) {
        console.error("Error fetching business details:", err);
        setError("No se pudieron cargar los detalles del negocio");
        // En caso de error, usar datos de ejemplo para demostración
        setBusiness({
          name: "Centro de Fisioterapia Vital",
          description: "Centro especializado en tratamientos de fisioterapia cervical y problemas posturales.",
          address: "C Cristobal Colon 5, Castellon, 12002",
          phone: "964 123 456",
          business_hours: {
            "1": [{ start: "09:00", end: "17:00" }],
            "2": [{ start: "09:00", end: "17:00" }],
            "3": [{ start: "09:00", end: "17:00" }],
            "4": [{ start: "09:00", end: "17:00" }],
            "5": [{ start: "09:00", end: "17:00" }],
            "6": [{ start: "09:00", end: "14:00" }],
            "7": []
          },
          services: [
            { name: "Consulta general", duration: 30, price: 15.0 },
            { name: "Alineado cervical", duration: 60, price: 100.0 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [businessId, currentBusiness?.business_id]);

  const handleOpenReservation = () => {
    setIsReservationOpen(true);
  };

  const handleCloseReservation = () => {
    setIsReservationOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error && !business) {
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
        {/* Renderizar BusinessDetails pero reemplazar la acción del botón */}
        <BusinessDetails 
          business={business} 
          reservationButton={
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleOpenReservation}
            >
              Reservar cita
            </Button>
          } 
        />
        
        {/* Diálogo de reserva */}
        <ReservationDialog 
          isOpen={isReservationOpen}
          onClose={handleCloseReservation}
          business={business}
        />
      </div>
    </div>
  );
};

export default BusinessPage;
