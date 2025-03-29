
import React, { useState, useEffect } from "react";
import { format, parseISO, addMinutes } from "date-fns";
import { es } from "date-fns/locale";
import { X, Calendar, Clock, User, FileText, Bookmark, Search } from "lucide-react";
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

// Mock clients for demo purposes
const mockClients = [
  { id: 1, fullname: "María López", phone: "612345678" },
  { id: 2, fullname: "Juan García", phone: "623456789" },
  { id: 3, fullname: "Ana Martínez", phone: "634567890" },
  { id: 4, fullname: "Pedro Rodríguez", phone: "645678901" },
  { id: 5, fullname: "Laura Sánchez", phone: "656789012" },
];

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
  const [professionalId, setProfessionalId] = useState<string | undefined>(undefined);
  const [serviceId, setServiceId] = useState<string | undefined>(undefined);
  const [clientId, setClientId] = useState<number | undefined>(undefined);
  const [clientName, setClientName] = useState<string>("");
  const [filteredClients, setFilteredClients] = useState(mockClients);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("09:30");
  const [title, setTitle] = useState<string>("");

  // Filter working professionals
  const workingProfessionals = professionals?.filter(p => p.availabilities && p.availabilities.length > 0) || [];

  useEffect(() => {
    if (isOpen) {
      if (booking) {
        // Edit mode - populate with existing booking data
        setBookingType(booking.title ? "block" : "reservation");
        setProfessionalId(booking.professional?.professional_id?.toString());
        setServiceId(booking.service?.id?.toString());
        setClientId(booking.client?.client_id);
        setClientName(booking.client?.fullname || "");
        
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
        setProfessionalId(defaultProfessionalId?.toString());
        setServiceId(undefined);
        setClientId(undefined);
        setClientName("");
        setTitle("");
        
        // Default to selected time slot or 9:00
        setStartTime("09:00");
        
        // Default end time is start time + 30 minutes
        const startDate = new Date(`${date}T${startTime}`);
        const endDate = addMinutes(startDate, 30);
        setEndTime(format(endDate, "HH:mm"));
      }
    }
  }, [isOpen, booking, defaultProfessionalId, date]);

  // Filter clients as user types
  const handleClientSearch = (value: string) => {
    setClientName(value);
    setClientId(undefined); // Clear selected client id when typing manually
    
    // Filter clients based on input
    if (value) {
      const filtered = mockClients.filter(client => 
        client.fullname.toLowerCase().includes(value.toLowerCase()) ||
        client.phone.includes(value)
      );
      setFilteredClients(filtered);
      setShowClientDropdown(true);
    } else {
      setFilteredClients(mockClients);
      setShowClientDropdown(false);
    }
  };

  // Handle client selection from dropdown
  const handleClientSelect = (client: { id: number; fullname: string }) => {
    setClientId(client.id);
    setClientName(client.fullname);
    setShowClientDropdown(false);
  };

  const handleInputFocus = () => {
    if (clientName) {
      // Only show dropdown if there's already text
      const filtered = mockClients.filter(client => 
        client.fullname.toLowerCase().includes(clientName.toLowerCase()) ||
        client.phone.includes(clientName)
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(mockClients);
    }
    setShowClientDropdown(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: BookingFormData = {
      booking_type: bookingType,
      professional_id: professionalId ? parseInt(professionalId) : undefined,
      start_datetime: `${date}T${startTime}:00Z`,
      end_datetime: `${date}T${endTime}:00Z`,
    };
    
    if (bookingType === "reservation") {
      formData.service_id = serviceId ? parseInt(serviceId) : undefined;
      formData.client_id = clientId;
      // If no client ID but there's a name, pass the name for creating a new client
      if (!clientId && clientName) {
        formData.client_name = clientName;
      }
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
                    value={professionalId || undefined} 
                    onValueChange={setProfessionalId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar profesional" />
                    </SelectTrigger>
                    <SelectContent>
                      {workingProfessionals.map((professional) => (
                        professional.professional_id && (
                          <SelectItem 
                            key={professional.professional_id} 
                            value={professional.professional_id.toString()}
                          >
                            {professional.fullname}
                          </SelectItem>
                        )
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
                    <Label htmlFor="service">Servicio (opcional)</Label>
                    <Select 
                      value={serviceId || undefined} 
                      onValueChange={setServiceId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {services?.filter(service => service.id !== undefined && service.id !== null)
                          .map((service) => (
                            <SelectItem 
                              key={service.id} 
                              value={service.id.toString()}
                            >
                              {service.name} ({service.duration} min)
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="client">Cliente</Label>
                    <div className="relative">
                      <div className="flex">
                        <div className="bg-gray-100 p-2 rounded-l-md border-y border-l">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <Input 
                          id="client"
                          type="text"
                          placeholder="Buscar o introducir nombre de cliente"
                          className="rounded-l-none w-full"
                          value={clientName}
                          onChange={(e) => handleClientSearch(e.target.value)}
                          onFocus={handleInputFocus}
                        />
                      </div>
                      
                      {showClientDropdown && filteredClients.length > 0 && (
                        <ul className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg w-full max-h-60 overflow-y-auto">
                          {filteredClients.map(client => (
                            <li 
                              key={client.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                              onClick={() => handleClientSelect(client)}
                            >
                              <span>{client.fullname}</span>
                              <span className="text-xs text-gray-500">{client.phone}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1">
                        {clientId 
                          ? "Cliente seleccionado de la base de datos" 
                          : clientName 
                            ? "Se creará un nuevo cliente con este nombre" 
                            : "Introduce un nombre o selecciona de la lista"}
                      </p>
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
