
import React from "react";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  ExternalLink,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BusinessDetail } from "@/types/booking";
import { Link } from "react-router-dom";

interface BusinessDetailsProps {
  business: BusinessDetail;
  reservationPath: string;
}

// Helper function to format business hours nicely
const formatBusinessHours = (businessHours: BusinessDetail['business_hours']) => {
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
    <div className="max-w-5xl mx-auto p-4">
      {/* Header section with business name and description */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{business.name}</h1>
        {business.description && (
          <p className="mt-2 text-gray-600">{business.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column with contact info */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Ubicación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">{business.address}</p>
              <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary text-sm flex items-center hover:underline"
              >
                Abrir en Google Maps
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Center column with hours */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Horario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formattedHours.map((item) => (
                  <div key={item.day} className="flex justify-between text-sm">
                    <span className="font-medium">{item.day}</span>
                    <span>{item.hours}</span>
                  </div>
                ))}
              </div>

              {business.phone && (
                <>
                  <Separator className="my-4" />
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Teléfono</p>
                      <p className="text-sm">{business.phone}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column with map */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Mapa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-[200px] bg-gray-100 relative rounded-md overflow-hidden">
                <iframe
                  title="Mapa de ubicación"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`}
                  allowFullScreen
                ></iframe>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-200/30"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Services section - now full width below the other cards */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Servicios disponibles
            </CardTitle>
            <CardDescription>
              Elige el servicio que necesitas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.services.map((service, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md transition-colors hover:bg-gray-100">
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{service.duration} min</span>
                    </div>
                  </div>
                  <div className="text-primary font-bold text-lg">{service.price}€</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-4">
            <Button asChild className="w-full md:w-1/2 lg:w-1/3 bg-blue-600 hover:bg-blue-700 text-base py-6">
              <Link to={reservationPath}>
                <Calendar className="mr-2 h-5 w-5" /> Reservar ahora
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
