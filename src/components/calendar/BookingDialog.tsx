
import React, { useState, useEffect } from "react";
import { format, parseISO, addMinutes } from "date-fns";
import { es } from "date-fns/locale";
import { X, Calendar, Clock, User, FileText, Bookmark } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimePicker } from "@/components/calendar/TimePicker";
import { Booking, BookingFormData, BookingType } from "@/types/booking";
import { Professional } from "@/types/professional";
import { Service } from "@/types/service";

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BookingFormData) => void;
  booking?: Booking;
  date: string;
  professionals: Professional[];
  services: Service[];
  defaultProfessionalId?: number;
  isEditing: boolean;
}

export const BookingDialog: React.FC<BookingDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  booking,
  date,
  professionals,
  services,
  defaultProfessionalId,
  isEditing,
}) => {
  const [bookingType, setBookingType] = useState<BookingType>("reservation");
  const [professionalId, setProfessionalId] = useState<number | undefined>(undefined);
  const [serviceId, setServiceId] = useState<number | undefined>(undefined);
  const [clientId, setClientId] = useState<number | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("09:30");
  const [title, setTitle] = useState<string>("");

  // Filter working professionals
  const workingProfessionals = professionals.filter(p => p.isWorking);

  useEffect(() => {
    if (isOpen) {
      if (booking) {
        // Edit mode - populate with existing booking data
        setBookingType(booking.title ? "block" : "reservation");
        setProfessionalId(booking.professional?.professional_id);
        setServiceId(booking.service?.service_id);
        setClientId(booking.client?.client_id);
        
        // Extract times from datetime strings
        const startDateTime = booking.start_datetime;
        const endDateTime = booking.end_datetime;
        
        setStartTime(startDateTime.includes('T') 
          ? startDateTime.split('T')[1].substring(0, 5) 
          : startDateTime);
          
        setEndTime(endDateTime.includes('T') 
          ? endDateTime.split('T')[1].substring(0, 5) 
          : endDateTime);
          
        setTitle(booking.title || "");
      } else {
        // New booking mode
        setBookingType("reservation");
        setProfessionalId(defaultProfessionalId);
        setServiceId(undefined);
        setClientId(undefined);
        setTitle("");
        
        // Default to selected time slot or 9:00
        setStartTime(defaultProfessionalId ? "09:00" : "09:00");
        
        // Default end time is start time + 30 minutes
        const startDate = new Date(`${date}T${startTime}`);
        const endDate = addMinutes(startDate, 30);
        setEndTime(format(endDate, "HH:mm"));
      }
    }
  }, [isOpen, booking, defaultProfessionalId, date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: BookingFormData = {
      booking_type: bookingType,
      professional_id: professionalId,
      start_datetime: `${date}T${startTime}:00Z`,
      end_datetime: `${date}T${endTime}:00Z`,
    };
    
    if (bookingType === "reservation") {
      formData.service_id = serviceId;
      formData.client_id = clientId;
    } else {
      formData.title = title;
    }
    
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? `Editar ${booking?.title ? "bloqueo" : "reserva"}`
              : "Crear nueva entrada en agenda"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs 
            defaultValue={bookingType} 
            value={bookingType} 
            onValueChange={(value) => setBookingType(value as BookingType)}
            className="mt-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reservation">Reserva</TabsTrigger>
              <TabsTrigger value="block">Bloqueo</TabsTrigger>
            </TabsList>
            
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div className="font-medium">{format(parseISO(date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</div>
              </div>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="professional">Profesional</Label>
                  <Select 
                    value={professionalId?.toString()} 
                    onValueChange={(value) => setProfessionalId(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar profesional" />
                    </SelectTrigger>
                    <SelectContent>
                      {workingProfessionals.map((professional) => (
                        <SelectItem key={professional.professional_id} value={professional.professional_id.toString()}>
                          {professional.fullname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Hora inicio</Label>
                    <TimePicker 
                      value={startTime} 
                      onChange={setStartTime} 
                      step={15}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Hora fin</Label>
                    <TimePicker 
                      value={endTime} 
                      onChange={setEndTime} 
                      step={15}
                    />
                  </div>
                </div>
                
                <TabsContent value="reservation" className="space-y-4 mt-0 p-0">
                  <div className="grid gap-2">
                    <Label htmlFor="service">Servicio</Label>
                    <Select 
                      value={serviceId?.toString()} 
                      onValueChange={(value) => setServiceId(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name} ({service.duration} min)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="client">Cliente</Label>
                    <div className="flex">
                      <Input 
                        id="client"
                        type="text"
                        placeholder="Buscar cliente por nombre o teléfono"
                        className="rounded-r-none"
                        disabled={true}
                        value={booking?.client?.fullname || ""}
                      />
                      <Button type="button" className="rounded-l-none">
                        Buscar
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="block" className="space-y-4 mt-0 p-0">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título</Label>
                    <Input 
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej. Reunión, Descanso, Ausencia..."
                    />
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Actualizar" : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
