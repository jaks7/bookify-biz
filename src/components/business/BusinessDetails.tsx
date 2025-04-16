
import React from "react";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  Info, 
  ExternalLink,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BusinessDetail } from "@/types/booking";
import { formatBusinessHours } from "@/lib/format";
import { Link } from "react-router-dom";

interface BusinessDetailsProps {
  business: BusinessDetail;
  reservationPath: string;
}

// Helper function to format business hours nicely
export const formatBusinessHours = (businessHours: BusinessDetail['business_hours']) => {
  const daysMap: Record<string, string> = {
    "1": "Lunes",
    "2": "Martes",
    "3": "Miércoles",
    "4": "Jueves",
    "5": "Viernes",
    "6": "Sábado",
    "7": "Domingo"
  };

  return Object.entries(businessHours).map(([day, hours]) => {
    if (hours.length === 0) {
      return { day: daysMap[day], hours: "Cerrado" };
    }
    
    // For simplicity, we just show the first time range
    // A more comprehensive solution would show multiple time ranges if they exist
    const timeRange = hours[0];
    return {
      day: daysMap[day],
      hours: `${timeRange.start} - ${timeRange.end}`
    };
  });
};

export const BusinessDetails: React.FC<BusinessDetailsProps> = ({ business, reservationPath }) => {
  const encodedAddress = encodeURIComponent(business.address);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  const formattedHours = formatBusinessHours(business.business_hours);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información del negocio */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{business.name}</h1>
            {business.description && (
              <p className="mt-2 text-gray-600">{business.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dirección y mapa */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{business.address}</p>
                <div className="mt-3 h-[160px] bg-gray-100 relative rounded-md overflow-hidden">
                  {/* Aquí iría el mapa de Google */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <iframe
                      title="Mapa de ubicación"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`}
                      allowFullScreen
                    ></iframe>
                    {/* Overlay para evitar problemas con la carga del mapa */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-200/30"></div>
                  </div>
                </div>
                <a 
                  href={googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary text-sm flex items-center mt-2 hover:underline"
                >
                  Abrir en Google Maps
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </CardContent>
            </Card>

            {/* Información de contacto y horarios */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Información
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {business.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Teléfono</p>
                      <p className="text-sm">{business.phone}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Horario</p>
                    <div className="text-sm space-y-1">
                      {formattedHours.map((item) => (
                        <div key={item.day} className="flex justify-between">
                          <span className="font-medium">{item.day}</span>
                          <span>{item.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reservas */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Reserva tu cita
              </CardTitle>
              <CardDescription>
                Elige el servicio que necesitas y haz tu reserva online
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {business.services.map((service, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-primary font-medium">{service.price}€</div>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{service.duration} min</span>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={reservationPath}>
                  <Calendar className="mr-2 h-4 w-4" /> Reservar ahora
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
