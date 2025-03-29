import React, { useState, useEffect } from "react";
import { format, parseISO, addMinutes } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Clock, User, Bookmark, Calendar, FileText } from "lucide-react";
import { BusinessHours } from "@/components/calendar/BusinessHours";
import { ProfessionalSchedule } from "@/components/calendar/ProfessionalSchedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/calendar/BookingDialog";
import { Booking, BookingFormData } from "@/types/booking";
import { Professional, DailyScheduleData } from "@/types/professional";
import { Service } from "@/types/service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/stores/authContext";
import { useProfessionalStore } from "@/stores/professionalStore";
import { useServiceStore } from "@/stores/serviceStore";
import axios from "axios";
import { ENDPOINTS } from "@/config/api";

interface DayCalendarProps {
  selectedDate: Date;
  schedule: DailyScheduleData | null;
  loading: boolean;
  onScheduleUpdate: () => void;
}

// Time slots configuration
const TIME_SLOTS = [
  "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45",
  "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", 
  "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", 
  "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", 
  "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", 
  "19:00", "19:15", "19:30", "19:45", "20:00"
];

export const DayCalendar: React.FC<DayCalendarProps> = ({ 
  selectedDate,
  schedule,
  loading,
  onScheduleUpdate
}) => {
  const { currentBusiness } = useAuth();
  const { services, fetchServices } = useServiceStore();
  const [activeTab, setActiveTab] = useState("agenda");
  const [showAllProfessionals, setShowAllProfessionals] = useState(true);
  const [selectedProfessionals, setSelectedProfessionals] = useState<number[]>([]);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ time: string, professionalId: number } | null>(null);

  // Cargar servicios cuando cambie el negocio
  useEffect(() => {
    if (currentBusiness?.business_id) {
      fetchServices(currentBusiness.business_id);
    }
  }, [currentBusiness?.business_id]);

  // Actualizar selected professionals cuando cambie el schedule
  useEffect(() => {
    if (schedule?.professionals) {
      const workingProfIds = schedule.professionals
        .filter(p => p.availabilities && p.availabilities.length > 0)
        .map(p => p.professional_id);
      setSelectedProfessionals(workingProfIds);
    }
  }, [schedule]);

  // Obtener los datos del schedule
  const businessHours = schedule?.business_hours || [];
  const professionals = schedule?.professionals || [];
  const bookings = schedule?.bookings || [];

  const handleBusinessHoursChange = (hours: { start: string; end: string }[]) => {
    // Aquí iría la llamada al backend para actualizar los horarios
    toast.success('Horarios actualizados correctamente');
  };

  const handleProfessionalStatusChange = (id: number, isWorking: boolean) => {
    // Aquí iría la llamada al backend para actualizar el estado del profesional
    if (isWorking && !selectedProfessionals.includes(id)) {
      setSelectedProfessionals([...selectedProfessionals, id]);
    } else if (!isWorking && selectedProfessionals.includes(id)) {
      setSelectedProfessionals(selectedProfessionals.filter(profId => profId !== id));
    }
  };

  const handleProfessionalHoursChange = (id: number, hours: { start: string; end: string }[]) => {
    // Aquí iría la llamada al backend para actualizar los horarios del profesional
    toast.success('Horarios del profesional actualizados correctamente');
  };

  const handleProfessionalSelection = (id: number, selected: boolean) => {
    if (selected) {
      setSelectedProfessionals([...selectedProfessionals, id]);
    } else {
      setSelectedProfessionals(selectedProfessionals.filter(profId => profId !== id));
    }
  };

  const handleSelectAllProfessionals = (selected: boolean) => {
    setShowAllProfessionals(selected);
    if (selected) {
      const workingProfIds = professionals
        .filter(p => p.availabilities && p.availabilities.length > 0)
        .map(p => p.professional_id);
      setSelectedProfessionals(workingProfIds);
    } else {
      setSelectedProfessionals([]);
    }
  };

  const workingProfessionals = professionals.filter(p => p.availabilities && p.availabilities.length > 0);
  const filteredProfessionals = workingProfessionals.filter(p => selectedProfessionals.includes(p.professional_id));
  
  // Handle click on empty time slot
  const handleTimeSlotClick = (time: string, professionalId: number) => {
    setSelectedTimeSlot({ time, professionalId });
    setCurrentBooking(undefined);
    setIsEditing(false);
    setDialogOpen(true);
  };
  
  // Handle click on existing booking
  const handleBookingClick = async (booking: Booking) => {
    try {
      if (!currentBusiness?.business_id) {
        toast.error('No hay un negocio seleccionado');
        return;
      }

      // Obtener los detalles actualizados de la reserva
      const response = await axios.get(
        ENDPOINTS.BOOKING_DETAIL(currentBusiness.business_id, booking.booking_id)
      );

      setCurrentBooking(response.data);
      setSelectedTimeSlot(null);
      setIsEditing(true);
      setDialogOpen(true);
    } catch (error) {
      console.error('Error al obtener detalles de la reserva:', error);
      toast.error('Error al cargar los detalles de la reserva');
    }
  };
  
  // Handle save booking
  const handleSaveBooking = async (data: BookingFormData) => {
    if (!currentBusiness?.business_id) return;

    try {
      if (currentBooking) {
        // Update existing booking
        await axios.put(
          ENDPOINTS.BOOKING_UPDATE(currentBusiness.business_id, currentBooking.booking_id),
          data
        );
        toast.success("La reserva se ha actualizado correctamente");
      } else {
        // Create new booking
        await axios.post(
          ENDPOINTS.BOOKING_CREATE(currentBusiness.business_id),
          data
        );
        toast.success("La reserva se ha creado correctamente");
      }
      
      setDialogOpen(false);
      setCurrentBooking(null);
      onScheduleUpdate(); // Notificar que hubo un cambio
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "No se pudo procesar la operación");
    }
  };
  
  // Helper function to get initials
  const getInitials = (name: string): string => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Helper function to check if time is within available hours for a professional
  const isWithinAvailableHours = (professional: Professional, time: string): boolean => {
    if (!professional.availabilities) return false;
    
    const timeWithoutSeconds = time;
    
    return professional.availabilities.some(availability => {
      const startTime = availability.datetime_start.split('T')[1].substring(0, 5);
      const endTime = availability.datetime_end.split('T')[1].substring(0, 5);
      return timeWithoutSeconds >= startTime && timeWithoutSeconds < endTime;
    });
  };
  
  // Helper function to format the time string
  const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    if (timeString.includes('T')) {
      return timeString.split('T')[1].substring(0, 5);
    }
    return timeString.substring(0, 5);
  };
  
  // Helper function to get formatted date for the API
  const getFormattedDate = (): string => {
    return format(selectedDate, 'yyyy-MM-dd');
  };

  // Helper function to calculate the height of a booking in rows
  const calculateBookingRowSpan = (booking: Booking): number => {
    const startTime = formatTime(booking.start_datetime);
    const endTime = formatTime(booking.end_datetime);
    
    const startIndex = TIME_SLOTS.indexOf(startTime);
    const endIndex = TIME_SLOTS.indexOf(endTime);
    
    return Math.max(1, endIndex - startIndex);
  };

  // Helper function to get color for different types of bookings
  const getBookingColor = (booking: Booking): { bg: string, border: string, text: string, hover: string } => {
    const isBlock = !!booking.title;
    
    if (isBlock) {
      return {
        bg: "bg-blue-100",
        border: "border-blue-300",
        text: "text-blue-900",
        hover: "hover:bg-blue-200"
      };
    } else {
      return {
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-900",
        hover: "hover:bg-indigo-200"
      };
    }
  };

  // Get all bookings for a professional
  const getBookingsForProfessional = (professionalId: number): Booking[] => {
    return bookings.filter(
      booking => booking.professional?.professional_id === professionalId
    );
  };

  // Helper function to convert a booking to a spanning cell
  const convertBookingToSpanningCell = (booking: Booking, professional: Professional): React.ReactNode => {
    const startTime = formatTime(booking.start_datetime);
    const endTime = formatTime(booking.end_datetime);
    const isBlock = !!booking.title;
    
    const startIndex = TIME_SLOTS.indexOf(startTime);
    if (startIndex === -1) return null;
    
    const rowSpan = calculateBookingRowSpan(booking);
    if (rowSpan <= 0) return null;
    
    const isSmallBooking = rowSpan <= 2;
    const colors = getBookingColor(booking);
    const slotHeight = 36;
    
    return (
      <div 
        key={`booking-${booking.booking_id}`}
        className={cn(
          "absolute inset-x-0 rounded-md mx-1 p-2 cursor-pointer overflow-hidden border-2 shadow-sm transition-all",
          colors.bg, 
          colors.border,
          colors.hover
        )}
        style={{
          top: `${startIndex * slotHeight}px`,
          height: `${rowSpan * slotHeight - 2}px`,
          zIndex: 10
        }}
        onClick={() => handleBookingClick(booking)}
      >
        <div className={cn("flex flex-col h-full", colors.text)}>
          <div className="text-sm font-medium">
            {startTime} - {endTime}
            {isSmallBooking && (isBlock ? `: ${booking.title}` : booking.client && `: ${booking.client.fullname.split(' ')[0]}`)}
          </div>
          
          {!isSmallBooking && (
            <div className="mt-1">
              {isBlock ? (
                <div className="flex items-center gap-1 text-xs">
                  <FileText className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{booking.title}</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {booking.client && (
                    <div className="flex items-center gap-1 text-xs">
                      <User className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{booking.client.fullname}</span>
                    </div>
                  )}
                  {booking.service && (
                    <div className="flex items-center gap-1 text-xs">
                      <Bookmark className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{booking.service.name}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center p-6">
        <p>Cargando agenda...</p>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="text-center p-6 text-gray-500">
        No hay datos disponibles para este día.
      </div>
    );
  }

  return (
    <div>
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-4"
      >
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="horarios">Horarios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="horarios" className="space-y-4 mt-4">
          <BusinessHours 
            initialHours={businessHours?.map(h => ({
              start: h.datetime_start?.split('T')[1] || '',
              end: h.datetime_end?.split('T')[1] || ''
            })) || []} 
            onSave={handleBusinessHoursChange} 
          />
          
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
              <CardTitle className="text-md flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-600" />
                Profesionales {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {professionals?.map(professional => (
                  <ProfessionalSchedule
                    key={professional.professional_id}
                    professional={{
                      id: professional.professional_id?.toString() || '',
                      name: professional.fullname || '',
                      isWorking: professional.availabilities && professional.availabilities.length > 0,
                      workingHours: professional.availabilities?.map(avail => ({
                        start: avail.datetime_start?.split('T')[1]?.substring(0, 5) || '',
                        end: avail.datetime_end?.split('T')[1]?.substring(0, 5) || ''
                      })) || []
                    }}
                    onStatusChange={(id, isWorking) => handleProfessionalStatusChange(parseInt(id), isWorking)}
                    onHoursChange={(id, hours) => handleProfessionalHoursChange(parseInt(id), hours)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agenda" className="space-y-4 mt-4">
          <Card className="border-gray-200 shadow-sm mb-4">
            <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-md flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-gray-600" />
                  <span className="capitalize">{format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</span>
                </CardTitle>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="show-all-professionals"
                      checked={showAllProfessionals}
                      onCheckedChange={handleSelectAllProfessionals}
                    />
                    <Label htmlFor="show-all-professionals" className="text-sm cursor-pointer">
                      Mostrar todos
                    </Label>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              {workingProfessionals.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {workingProfessionals.map(professional => (
                    <label
                      key={professional.professional_id}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      <Checkbox
                        id={`prof-${professional.professional_id}`}
                        checked={selectedProfessionals.includes(professional.professional_id)}
                        onCheckedChange={(checked) => 
                          handleProfessionalSelection(professional.professional_id, checked === true)
                        }
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{professional.fullname}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {workingProfessionals.length > 0 && selectedProfessionals.length > 0 ? (
                <div className="overflow-auto">
                  {/* Fixed header with professional names */}
                  <div className="flex border-b sticky top-0 bg-white z-20">
                    <div className="w-16 text-center py-3 text-xs font-semibold text-gray-500 border-r">
                      Hora
                    </div>
                    <div className="flex-1 grid" style={{ 
                      gridTemplateColumns: `repeat(${filteredProfessionals.length}, minmax(200px, 1fr))` 
                    }}>
                      {filteredProfessionals.map(professional => (
                        <div key={professional.professional_id} className="p-3 text-center font-medium flex items-center justify-center gap-2 bg-gray-50 border-r">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs bg-indigo-100 text-indigo-600">
                              {getInitials(professional.fullname)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{professional.fullname}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Calendar grid */}
                  <div className="relative">
                    {TIME_SLOTS.map((time, timeIndex) => (
                      <div key={time} className={cn(
                        "flex gap-0 border-b h-9",
                        // Add darker background for full hours
                        time.endsWith("00") ? "bg-gray-50" : ""
                      )}>
                        <div className={cn(
                          "w-16 text-xs text-gray-500 py-2 px-1 border-r sticky left-0 bg-white z-10 text-right",
                          // Only show time label for 15, 30, 45, and 00
                          !time.endsWith("00") && !time.endsWith("15") && !time.endsWith("30") && !time.endsWith("45") && "opacity-0"
                        )}>
                          {time}
                        </div>
                        <div className="flex-1 grid" style={{ 
                          gridTemplateColumns: `repeat(${filteredProfessionals.length}, minmax(200px, 1fr))` 
                        }}>
                          {filteredProfessionals.map(professional => {
                            const isAvailable = isWithinAvailableHours(professional, time);
                            return (
                              <div 
                                key={`${professional.professional_id}-${time}`}
                                className={cn(
                                  "border-r relative",
                                  isAvailable ? "bg-white hover:bg-gray-50 cursor-pointer" : "bg-gray-100"
                                )}
                                onClick={() => isAvailable && handleTimeSlotClick(time, professional.professional_id)}
                              >
                                {timeIndex === 0 && getBookingsForProfessional(professional.professional_id).map(booking => 
                                  convertBookingToSpanningCell(booking, professional)
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  {workingProfessionals.length === 0 ? 
                    "No hay profesionales trabajando este día." : 
                    "Selecciona al menos un profesional para ver su agenda."}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Color legend for bookings - updated with new colors */}
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-indigo-100 border-2 border-indigo-300"></div>
              <span className="text-xs text-gray-600">Reserva de cliente</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-300"></div>
              <span className="text-xs text-gray-600">Bloqueo de calendario</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-gray-100"></div>
              <span className="text-xs text-gray-600">Fuera de horario laboral</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dialog for creating/editing bookings */}
      <BookingDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveBooking}
        booking={currentBooking}
        date={format(selectedDate, 'yyyy-MM-dd')}
        professionals={workingProfessionals}
        services={services}
        defaultProfessionalId={selectedTimeSlot?.professionalId}
        isEditing={isEditing}
      />
    </div>
  );
};
