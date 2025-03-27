
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
import { Professional } from "@/types/professional";
import { Service } from "@/types/service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock data for demonstrations
const generateMockProfessionals = (): Professional[] => {
  return [
    {
      id: 1,
      name: "María García",
      isWorking: true,
      workingHours: [{ start: "09:00", end: "14:00" }]
    },
    {
      id: 2,
      name: "Juan Pérez",
      isWorking: true,
      workingHours: [
        { start: "09:00", end: "14:00" },
        { start: "16:00", end: "20:00" }
      ]
    },
    {
      id: 3,
      name: "Sofía Rodríguez",
      isWorking: false,
      workingHours: [{ start: "16:00", end: "20:00" }]
    }
  ];
};

// Mock services data
const generateMockServices = (): Service[] => {
  return [
    { id: 1, name: "Consulta General", duration: 30, price: 50 },
    { id: 2, name: "Tratamiento Especializado", duration: 60, price: 80 },
    { id: 3, name: "Revisión", duration: 15, price: 30 }
  ];
};

// Mock bookings data to match backend format
const generateMockBookings = (date: Date): Booking[] => {
  const dateStr = format(date, 'yyyy-MM-dd');
  
  return [
    // Client reservation for María
    {
      booking_id: "b0ae0641-0cd4-4f7f-8550-dcd550941f4a",
      business: "business1",
      start_datetime: `${dateStr}T10:00:00Z`,
      end_datetime: `${dateStr}T10:30:00Z`,
      client: {
        client_id: 1001,
        name: "Laura",
        surnames: "Martínez",
        fullname: "Laura Martínez",
        phone: "600123456"
      },
      professional: {
        professional_id: 1,
        name: "María",
        surnames: "García",
        fullname: "María García"
      },
      service: {
        service_id: 1,
        name: "Consulta General"
      },
      cancelled: false,
      duration: 30
    },
    // Calendar block for María
    {
      booking_id: "c1bf1742-1de5-5f8g-9661-ecd661052f5b",
      business: "business1",
      start_datetime: `${dateStr}T12:30:00Z`,
      end_datetime: `${dateStr}T14:00:00Z`,
      professional: {
        professional_id: 1,
        name: "María",
        surnames: "García",
        fullname: "María García"
      },
      cancelled: false,
      duration: 90,
      title: "Reunión de equipo"
    },
    // Client reservation for Juan
    {
      booking_id: "d2cg2843-2ef6-6g9h-0772-fde772163g6c",
      business: "business1",
      start_datetime: `${dateStr}T09:30:00Z`,
      end_datetime: `${dateStr}T10:30:00Z`,
      client: {
        client_id: 1002,
        name: "Carlos",
        surnames: "Ruiz",
        fullname: "Carlos Ruiz",
        phone: "600789012"
      },
      professional: {
        professional_id: 2,
        name: "Juan",
        surnames: "Pérez",
        fullname: "Juan Pérez"
      },
      service: {
        service_id: 2,
        name: "Tratamiento Especializado"
      },
      cancelled: false,
      duration: 60
    },
    // Calendar block for Juan
    {
      booking_id: "e3dh3954-3fg7-7h0i-1883-gef883274h7d",
      business: "business1",
      start_datetime: `${dateStr}T17:00:00Z`,
      end_datetime: `${dateStr}T18:00:00Z`,
      professional: {
        professional_id: 2,
        name: "Juan",
        surnames: "Pérez",
        fullname: "Juan Pérez"
      },
      cancelled: false,
      duration: 60,
      title: "Descanso"
    },
    // Small 15-min client reservation to test visibility
    {
      booking_id: "f4ei4065-4gh8-8i1j-2994-hfg994385i8e",
      business: "business1",
      start_datetime: `${dateStr}T11:15:00Z`,
      end_datetime: `${dateStr}T11:30:00Z`,
      client: {
        client_id: 1003,
        name: "Isabel",
        surnames: "Gómez",
        fullname: "Isabel Gómez",
        phone: "600345678"
      },
      professional: {
        professional_id: 1,
        name: "María",
        surnames: "García",
        fullname: "María García"
      },
      service: {
        service_id: 3,
        name: "Revisión"
      },
      cancelled: false,
      duration: 15
    }
  ];
};

// Mock business hours
const generateMockBusinessHours = () => {
  return [
    { start: "09:00", end: "14:00" },
    { start: "16:00", end: "20:00" }
  ];
};

interface DayCalendarProps {
  selectedDate: Date;
}

// Time slots configuration - adding 15 minute increments
const TIME_SLOTS = [
  "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45",
  "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", 
  "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", 
  "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", 
  "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", 
  "19:00", "19:15", "19:30", "19:45", "20:00"
];

export const DayCalendar: React.FC<DayCalendarProps> = ({ selectedDate }) => {
  const [businessHours, setBusinessHours] = useState(generateMockBusinessHours());
  const [professionals, setProfessionals] = useState<Professional[]>(generateMockProfessionals());
  const [services, setServices] = useState<Service[]>(generateMockServices());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState("agenda");
  const [showAllProfessionals, setShowAllProfessionals] = useState(true);
  const [selectedProfessionals, setSelectedProfessionals] = useState<number[]>(
    professionals.filter(p => p.isWorking).map(p => p.id)
  );
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ time: string, professionalId: number } | null>(null);

  useEffect(() => {
    // Fetch mock bookings when date changes
    const mockedBookings = generateMockBookings(selectedDate);
    setBookings(mockedBookings);
  }, [selectedDate]);

  const handleBusinessHoursChange = (hours: { start: string; end: string }[]) => {
    setBusinessHours(hours);
  };

  const handleProfessionalStatusChange = (id: number, isWorking: boolean) => {
    setProfessionals(professionals.map(prof => 
      prof.id === id ? { ...prof, isWorking } : prof
    ));

    // Update selected professionals
    if (isWorking && !selectedProfessionals.includes(id)) {
      setSelectedProfessionals([...selectedProfessionals, id]);
    } else if (!isWorking && selectedProfessionals.includes(id)) {
      setSelectedProfessionals(selectedProfessionals.filter(profId => profId !== id));
    }
  };

  const handleProfessionalHoursChange = (id: number, hours: { start: string; end: string }[]) => {
    setProfessionals(professionals.map(prof => 
      prof.id === id ? { ...prof, workingHours: hours } : prof
    ));
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
      setSelectedProfessionals(professionals.filter(p => p.isWorking).map(p => p.id));
    } else {
      setSelectedProfessionals([]);
    }
  };

  const workingProfessionals = professionals.filter(p => p.isWorking);
  const filteredProfessionals = workingProfessionals.filter(p => selectedProfessionals.includes(p.id));
  
  // Handle click on empty time slot
  const handleTimeSlotClick = (time: string, professionalId: number) => {
    setSelectedTimeSlot({ time, professionalId });
    setCurrentBooking(undefined);
    setIsEditing(false);
    setDialogOpen(true);
  };
  
  // Handle click on existing booking
  const handleBookingClick = (booking: Booking) => {
    setCurrentBooking(booking);
    setSelectedTimeSlot(null);
    setIsEditing(true);
    setDialogOpen(true);
  };
  
  // Handle save booking
  const handleSaveBooking = (data: BookingFormData) => {
    if (isEditing && currentBooking) {
      // Update existing booking
      const updatedBookings = bookings.map(booking => 
        booking.booking_id === currentBooking.booking_id
          ? {
              ...booking,
              start_datetime: data.start_datetime,
              end_datetime: data.end_datetime,
              title: data.booking_type === 'block' ? data.title : undefined,
              professional: data.professional_id 
                ? { ...booking.professional, professional_id: data.professional_id }
                : booking.professional,
              service: data.service_id && data.booking_type === 'reservation'
                ? { ...booking.service, service_id: data.service_id }
                : booking.service
            }
          : booking
      );
      
      setBookings(updatedBookings);
      toast.success(`${data.booking_type === 'block' ? 'Bloqueo' : 'Reserva'} actualizado correctamente`);
    } else {
      // Create new booking
      const newBooking: Booking = {
        booking_id: `temp-${Date.now()}`, // This would be set by the backend
        business: "business1", // This would be set by the backend
        start_datetime: data.start_datetime,
        end_datetime: data.end_datetime,
        cancelled: false,
        duration: 0, // This would be calculated by the backend
        title: data.booking_type === 'block' ? data.title : undefined,
      };
      
      // Add professional
      if (data.professional_id) {
        const professional = professionals.find(p => p.id === data.professional_id);
        if (professional) {
          newBooking.professional = {
            professional_id: professional.id,
            name: professional.name.split(' ')[0],
            surnames: professional.name.split(' ').slice(1).join(' '),
            fullname: professional.name
          };
        }
      }
      
      // Add service for reservations
      if (data.booking_type === 'reservation' && data.service_id) {
        const service = services.find(s => s.id === data.service_id);
        if (service) {
          newBooking.service = {
            service_id: service.id,
            name: service.name
          };
        }
      }
      
      setBookings([...bookings, newBooking]);
      toast.success(`${data.booking_type === 'block' ? 'Bloqueo' : 'Reserva'} creado correctamente`);
    }
    
    setDialogOpen(false);
  };
  
  // Helper function to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Helper function to check if time is within working hours
  const isWithinWorkingHours = (professional: Professional, time: string) => {
    return professional.workingHours?.some(
      ({ start, end }) => time >= start && time < end
    ) || false;
  };
  
  // Helper function to format the time string
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // Extract time from ISO string if necessary
    if (timeString.includes('T')) {
      return timeString.split('T')[1].substring(0, 5);
    }
    return timeString.substring(0, 5); // Just get HH:MM
  };
  
  // Helper function to get formatted date for the API
  const getFormattedDate = () => {
    return format(selectedDate, 'yyyy-MM-dd');
  };

  // Helper function to find the booking that starts at a specific time for a professional
  const getBookingAtTime = (time: string, professionalId: number): Booking | undefined => {
    const formattedTime = `${time}:00Z`; // Add seconds and Z for matching
    
    return bookings.find(booking => {
      const startTime = booking.start_datetime.includes('T') 
        ? booking.start_datetime.split('T')[1] 
        : booking.start_datetime;
        
      const bookingProfessionalId = booking.professional?.professional_id;
      
      return startTime === formattedTime && bookingProfessionalId === professionalId;
    });
  };

  // Helper function to calculate the height of a booking in rows (for spanning multiple time slots)
  const calculateBookingRowSpan = (booking: Booking): number => {
    const startTime = booking.start_datetime.includes('T') 
      ? booking.start_datetime.split('T')[1].substring(0, 5) 
      : booking.start_datetime.substring(0, 5);
    
    const endTime = booking.end_datetime.includes('T') 
      ? booking.end_datetime.split('T')[1].substring(0, 5) 
      : booking.end_datetime.substring(0, 5);
    
    // Find indices in TIME_SLOTS array
    const startIndex = TIME_SLOTS.indexOf(startTime);
    const endIndex = TIME_SLOTS.indexOf(endTime);
    
    // Calculate row span (at least 1)
    return Math.max(1, endIndex - startIndex);
  };

  // Helper function to get color for different types of bookings
  const getBookingColor = (booking: Booking): { bg: string, border: string, text: string, hover: string } => {
    // Check if it's a block or a reservation
    const isBlock = !!booking.title;
    
    if (isBlock) {
      return {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
        hover: "hover:bg-blue-100"
      };
    } else {
      // Client reservation
      return {
        bg: "bg-violet-50",
        border: "border-violet-200",
        text: "text-violet-800",
        hover: "hover:bg-violet-100"
      };
    }
  };

  // Helper function to convert a booking to a spanning cell
  const convertBookingToSpanningCell = (booking: Booking, professional: Professional): React.ReactNode => {
    const startTime = formatTime(booking.start_datetime);
    const endTime = formatTime(booking.end_datetime);
    const isBlock = !!booking.title;
    
    const startIndex = TIME_SLOTS.indexOf(startTime);
    if (startIndex === -1) return null; // Skip if not found in our time slots
    
    const rowSpan = calculateBookingRowSpan(booking);
    if (rowSpan <= 0) return null; // Skip invalid bookings
    
    // Calculate height and determine if it's a small booking (15-30 min)
    const isSmallBooking = rowSpan <= 2; // 15-30 min bookings
    const colors = getBookingColor(booking);
    
    // Time slot height (updated to account for 15 min increments)
    const slotHeight = 36; // px
    
    return (
      <div 
        key={`booking-${booking.booking_id}`}
        className={cn(
          "absolute inset-x-0 rounded-md mx-1 p-2 cursor-pointer overflow-hidden border shadow-sm transition-all",
          colors.bg, 
          colors.border,
          colors.hover
        )}
        style={{
          top: `${startIndex * slotHeight}px`,
          height: `${rowSpan * slotHeight - 2}px`, // -2px for the border
          zIndex: 10
        }}
        onClick={() => handleBookingClick(booking)}
      >
        <div className={cn("flex flex-col h-full", colors.text)}>
          {/* Header - always visible */}
          <div className="text-sm font-medium">
            {startTime} - {endTime}
            {isSmallBooking && (isBlock ? `: ${booking.title}` : booking.client && `: ${booking.client.fullname.split(' ')[0]}`)}
          </div>
          
          {/* Details - only for bookings with enough height */}
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

  // Get all bookings for a professional
  const getBookingsForProfessional = (professionalId: number): Booking[] => {
    return bookings.filter(
      booking => booking.professional?.professional_id === professionalId
    );
  };

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
            initialHours={businessHours} 
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
                {professionals.map(professional => (
                  <ProfessionalSchedule
                    key={professional.id}
                    professional={professional}
                    onStatusChange={handleProfessionalStatusChange}
                    onHoursChange={handleProfessionalHoursChange}
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
                      key={professional.id}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      <Checkbox
                        id={`prof-${professional.id}`}
                        checked={selectedProfessionals.includes(professional.id)}
                        onCheckedChange={(checked) => 
                          handleProfessionalSelection(professional.id, checked === true)
                        }
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{professional.name}</span>
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
                        <div key={professional.id} className="p-3 text-center font-medium flex items-center justify-center gap-2 bg-gray-50 border-r">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                              {getInitials(professional.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{professional.name}</span>
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
                            const isAvailable = isWithinWorkingHours(professional, time);
                            return (
                              <div 
                                key={`${professional.id}-${time}`}
                                className={cn(
                                  "border-r relative",
                                  isAvailable ? "bg-white hover:bg-gray-50 cursor-pointer" : "bg-gray-100"
                                )}
                                onClick={() => isAvailable && handleTimeSlotClick(time, professional.id)}
                              >
                                {timeIndex === 0 && getBookingsForProfessional(professional.id).map(booking => 
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
          
          {/* Color legend for bookings */}
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-violet-50 border border-violet-200"></div>
              <span className="text-xs text-gray-600">Reserva de cliente</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-blue-50 border border-blue-200"></div>
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
        date={getFormattedDate()}
        professionals={professionals}
        services={services}
        defaultProfessionalId={selectedTimeSlot?.professionalId}
        isEditing={isEditing}
      />
    </div>
  );
};
