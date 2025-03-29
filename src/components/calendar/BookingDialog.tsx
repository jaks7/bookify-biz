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
import axios from "axios";
import { ENDPOINTS } from "@/config/api";
import { useAuth } from "@/stores/authContext";
import { toast } from "sonner";

interface Client {
  client_id: number;
  fullname: string;
  phone: string;
}

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
  selectedTime?: string;
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
  selectedTime,
}) => {
  const [bookingType, setBookingType] = useState<BookingType>("reservation");
  const [professionalId, setProfessionalId] = useState<string | undefined>(undefined);
  const [serviceId, setServiceId] = useState<string | undefined>(undefined);
  const [clientId, setClientId] = useState<number | undefined>(undefined);
  const [clientName, setClientName] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("09:30");
  const [title, setTitle] = useState<string>("");
  const { currentBusiness } = useAuth();

  // Filter working professionals
  const workingProfessionals = professionals?.filter(p => p.availabilities && p.availabilities.length > 0) || [];

  // Cargar clientes cuando se abre el diálogo
  useEffect(() => {
    const fetchClients = async () => {
      if (!currentBusiness?.business_id) return;
      
      try {
        const response = await axios.get<Client[]>(
          `${ENDPOINTS.BUSINESSES}${currentBusiness.business_id}/clients/`
        );
        setClients(response.data);
      } catch (error) {
        console.error('Error al cargar los clientes:', error);
        toast.error('No se pudieron cargar los clientes');
      }
    };

    if (isOpen) {
      fetchClients();
    }
  }, [isOpen, currentBusiness?.business_id]);

  useEffect(() => {
    if (isOpen) {
      if (booking) {
        // Edit mode - populate with existing booking data
        setBookingType(booking.title ? "block" : "reservation");
        setProfessionalId(booking.professional?.professional_id?.toString());
        setServiceId(booking.service?.service_id?.toString());
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
        const initialTime = selectedTime || "09:00";
        setStartTime(initialTime);
        
        // Default end time is start time + 15 minutes
        const startDate = new Date(`${date}T${initialTime}`);
        const endDate = addMinutes(startDate, 15);
        setEndTime(format(endDate, "HH:mm"));
      }
    }
  }, [isOpen, booking, defaultProfessionalId, date, selectedTime]);

  // Update end time when service is selected
  useEffect(() => {
    if (serviceId) {
      const selectedService = services.find(service => service.service_id?.toString() === serviceId);
      if (selectedService && selectedService.duration) {
        const startDate = new Date(`${date}T${startTime}`);
        const endDate = addMinutes(startDate, selectedService.duration);
        setEndTime(format(endDate, "HH:mm"));
      }
    }
  }, [serviceId, services, startTime, date]);

  // Filter clients as user types
  const handleClientSearch = (value: string) => {
    setClientName(value);
    setSelectedClient(null);
    
    if (value) {
      const filtered = clients.filter(client => 
        client.fullname.toLowerCase().includes(value.toLowerCase()) ||
        client.phone.includes(value)
      );
      setFilteredClients(filtered);
      setShowClientDropdown(true);
    } else {
      setFilteredClients(clients);
      setShowClientDropdown(false);
    }
  };

  // Handle client selection from dropdown
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setClientName(client.fullname);
    setShowClientDropdown(false);
  };

  const handleInputFocus = () => {
    if (clientName) {
      // Only show dropdown if there's already text
      const filtered = clients.filter(client => 
        client.fullname.toLowerCase().includes(clientName.toLowerCase()) ||
        client.phone.includes(clientName)
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
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
      // Convertir service_id a número si existe
      formData.service_id = serviceId ? parseInt(serviceId) : undefined;
      
      // Si se seleccionó un cliente existente
      if (selectedClient) {
        formData.client_id = selectedClient.client_id; // Ya es number
      } 
      // Si se introdujo un nuevo nombre de cliente
      else if (clientName.trim()) {
        formData.new_client = clientName.trim();
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
                      onChange={(newTime) => {
                        setStartTime(newTime);
                        
                        // If no service selected, update end time to start + 15 minutes
                        if (!serviceId) {
                          const startDate = new Date(`${date}T${newTime}`);
                          const endDate = addMinutes(startDate, 15);
                          setEndTime(format(endDate, "HH:mm"));
                        } else {
                          // If service selected, update end time based on service duration
                          const selectedService = services.find(service => service.service_id?.toString() === serviceId);
                          if (selectedService && selectedService.duration) {
                            const startDate = new Date(`${date}T${newTime}`);
                            const endDate = addMinutes(startDate, selectedService.duration);
                            setEndTime(format(endDate, "HH:mm"));
                          }
                        }
                      }}
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
                        {services?.map((service) => (
                          service.service_id && (
                            <SelectItem 
                              key={service.service_id} 
                              value={service.service_id.toString()}
                            >
                              {service.name} ({service.duration} min)
                            </SelectItem>
                          )
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
                              key={client.client_id}
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
                        {selectedClient 
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
