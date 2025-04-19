import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BusinessDetails } from "@/components/business/BusinessDetails";
import { BusinessDetail, BookingRequest } from "@/types/booking";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ClientReservation from "../ClientReservation";
import ClientNavbar from "@/components/client-portal/ClientNavbar";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { format, startOfWeek, endOfWeek, addWeeks } from "date-fns";
import { es } from "date-fns/locale";

const fallbackBusinessData: BusinessDetail = {
  business_id: "",
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
  const [initialAvailability, setInitialAvailability] = useState<any[]>([]);
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId) {
        setError("ID del negocio no proporcionado en la URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
        
        const [businessResponse, availabilityResponse] = await Promise.all([
          axios.get(`${baseUrl}/client_portal/${businessId}/`),
          axios.get(`${baseUrl}/client_portal/${businessId}/available-slots/`, {
            params: {
              start_date: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
              end_date: format(endOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 }), 'yyyy-MM-dd')
            }
          })
        ]);

        console.log("Business data loaded:", businessResponse.data);
        console.log("Initial availability loaded:", availabilityResponse.data);
        
        setBusiness({
          ...businessResponse.data,
          business_id: businessId
        });
        setInitialAvailability(availabilityResponse.data);

      } catch (err) {
        console.error("Error fetching data:", err);
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError("El negocio no fue encontrado o no está disponible públicamente.");
        } else {
          setError("No se pudieron cargar los datos. Inténtalo de nuevo más tarde.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessId]);

  const handleReservationComplete = (formData: any) => {
    const bookingRequest: BookingRequest = {
      start_datetime: formData.start_datetime,
      end_datetime: formData.end_datetime,
      service_id: formData.service_id,
      professional_id: formData.professional_id,
      phone: formData.phone || "",
      name: formData.fullname || undefined,
      email: formData.email || undefined,
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
    <>
      <ClientNavbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-10">
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
          
          <Dialog 
            open={isReservationOpen} 
            onOpenChange={(open) => {
              setIsReservationOpen(open);
            }}
          >
            <DialogContent className="sm:max-w-[100%] md:max-w-[90%] lg:max-w-[80%] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Reserva tu cita</DialogTitle>
                <DialogDescription>
                  Selecciona el servicio, fecha y horario para tu cita.
                </DialogDescription>
              </DialogHeader>
              {isReservationOpen && (
                <ClientReservation 
                  inDialog={true} 
                  onComplete={handleReservationComplete}
                  businessData={business}
                  initialAvailability={initialAvailability}
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
                    {lastBooking.name && <p><span className="font-medium">Cliente:</span> {lastBooking.name}</p>}
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
    </>
  );
};

export default BusinessPage;
