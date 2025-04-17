import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BusinessDetails } from "@/components/business/BusinessDetails";
import { BusinessDetail, BookingRequest } from "@/types/booking";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ENDPOINTS } from "@/config/api";
import { useAuth } from "@/stores/authContext";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ClientReservation from "../demo/ClientReservation";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastBooking, setLastBooking] = useState<BookingRequest | null>(null);
  const { businessId } = useParams<{ businessId: string }>();
  const { currentBusiness } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const id = businessId || currentBusiness?.business_id;
        
        if (!id) {
          throw new Error("No se encontró ID del negocio");
        }
        
        const response = await axios.get(ENDPOINTS.BUSINESS_DETAIL(id));
        console.log("Business data loaded:", response.data);
        
        const businessData = {
          ...response.data,
          services: response.data.services.map((service: any, index: number) => ({
            ...service,
            service_id: service.service_id || index + 1
          }))
        };
        
        setBusiness(businessData);
      } catch (err) {
        console.error("Error fetching business details:", err);
        setError("No se pudieron cargar los detalles del negocio");
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
            { service_id: 1, name: "Consulta general", duration: 30, price: 15.0 },
            { service_id: 2, name: "Alineado cervical", duration: 60, price: 100.0 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [businessId, currentBusiness?.business_id]);

  const handleReservationComplete = (formData: any) => {
    const bookingRequest: BookingRequest = {
      start_datetime: formData.start_datetime,
      end_datetime: formData.end_datetime,
      service_id: formData.service_id,
      professional_id: formData.professional_id,
      phone: formData.phone || "",
      name: formData.fullname || "",
      email: formData.email || "",
    };

    setLastBooking(bookingRequest);
    
    setIsReservationOpen(false);
    setShowConfirmation(true);
    
    toast.success("Reserva creada con éxito");
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setLastBooking(null);
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
        <BusinessDetails 
          business={business} 
          reservationButton={
            <Button 
              className="w-full" 
              size="lg" 
              onClick={() => setIsReservationOpen(true)}
            >
              Reservar cita
            </Button>
          } 
        />
        
        <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
          <DialogContent className="sm:max-w-[100%] md:max-w-[90%] lg:max-w-[80%] max-h-[90vh] overflow-y-auto">
            {isReservationOpen && (
              <ClientReservation 
                inDialog={true} 
                onComplete={handleReservationComplete}
                businessData={business}
                showConfirmationAsStep={false}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>¡Reserva confirmada!</DialogTitle>
              <DialogDescription>
                Tu cita ha sido reservada correctamente. Recibirás un mensaje de confirmación.
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              
              {lastBooking && (
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Fecha:</span> {
                    format(new Date(lastBooking.start_datetime), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
                  }</p>
                  <p><span className="font-medium">Hora:</span> {
                    format(new Date(lastBooking.start_datetime), "HH:mm")
                  }</p>
                  {business.services?.find(s => s.service_id === lastBooking.service_id) && (
                    <p>
                      <span className="font-medium">Servicio:</span> {
                        business.services.find(s => s.service_id === lastBooking.service_id)?.name
                      }
                    </p>
                  )}
                  <p><span className="font-medium">Cliente:</span> {lastBooking.name}</p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={handleCloseConfirmation}>
                Volver al negocio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BusinessPage;
