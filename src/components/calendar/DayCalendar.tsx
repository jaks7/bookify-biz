
import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
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
  
  // Helper function to check if a booking exists at a specific time and professional
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
  
  // Helper function to check if time slot is during a booking
  const isTimeDuringBooking = (time: string, professionalId: number): Booking | undefined => {
    // Convert time to minutes for easier comparison
    const timeToMinutes = (t: string) => {
      const [hours, minutes] = t.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const timeMinutes = timeToMinutes(time);
    
    return bookings.find(booking => {
      if (booking.professional?.professional_id !== professionalId) return false;
      
      const startTime = booking.start_datetime.includes('T') 
        ? booking.start_datetime.split('T')[1].substring(0, 5) 
        : booking.start_datetime.substring(0, 5);
        
      const endTime = booking.end_datetime.includes('T') 
        ? booking.end_datetime.split('T')[1].substring(0, 5) 
        : booking.end_datetime.substring(0, 5);
      
      const startMinutes = timeToMinutes(startTime);
      const endMinutes = timeToMinutes(endTime);
      
      return timeMinutes >= startMinutes && timeMinutes < endMinutes;
    });
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
                  <div className="flex border-b sticky top-0 bg-white z-10">
                    <div className="w-16"></div> {/* Empty space for time column */}
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
                  
                  {/* Generate time slots from 9:00 to 19:00 with 30 minute intervals */}
                  <div className="grid gap-0">
                    {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", 
                      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
                      "17:00", "17:30", "18:00", "18:30", "19:00"].map((time) => (
                      <div key={time} className="flex gap-0 border-b">
                        <div className="w-16 text-sm text-gray-500 p-3 border-r sticky left-0 bg-white">{time}</div>
                        <div className="flex-1 grid" style={{ 
                          gridTemplateColumns: `repeat(${filteredProfessionals.length}, minmax(200px, 1fr))` 
                        }}>
                          {filteredProfessionals.map(professional => {
                            const isAvailable = isWithinWorkingHours(professional, time);
                            const booking = isTimeDuringBooking(time, professional.id);
                            const isBookingStart = getBookingAtTime(time, professional.id);
                            
                            if (isBookingStart) {
                              // This is the start of a booking
                              const startTime = formatTime(isBookingStart.start_datetime);
                              const endTime = formatTime(isBookingStart.end_datetime);
                              const isBlock = !!isBookingStart.title;
                              
                              return (
                                <div 
                                  key={`${professional.id}-${time}`}
                                  className={cn(
                                    "p-3 border-r cursor-pointer transition-colors",
                                    isBlock 
                                      ? "bg-amber-50 hover:bg-amber-100" 
                                      : "bg-rose-50 hover:bg-rose-100"
                                  )}
                                  onClick={() => handleBookingClick(isBookingStart)}
                                >
                                  <div className="flex items-center gap-2">
                                    {isBlock ? (
                                      <Calendar className="h-4 w-4 text-amber-500" />
                                    ) : (
                                      <Clock className="h-4 w-4 text-rose-500" />
                                    )}
                                    <div>
                                      <div className="text-sm font-medium">{`${startTime} - ${endTime}`}</div>
                                      <div className="flex flex-col text-xs text-gray-600 mt-1">
                                        {isBlock ? (
                                          <span className="flex items-center gap-1">
                                            <FileText className="h-3 w-3" />
                                            {isBookingStart.title}
                                          </span>
                                        ) : (
                                          <>
                                            {isBookingStart.client && (
                                              <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {isBookingStart.client.fullname}
                                              </span>
                                            )}
                                            {isBookingStart.service && (
                                              <span className="flex items-center gap-1">
                                                <Bookmark className="h-3 w-3" />
                                                {isBookingStart.service.name}
                                              </span>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            } else if (booking) {
                              // This time is within a booking (but not the start)
                              return (
                                <div 
                                  key={`${professional.id}-${time}`}
                                  className={cn(
                                    "border-r cursor-pointer p-3",
                                    booking.title 
                                      ? "bg-amber-50/50" 
                                      : "bg-rose-50/50"
                                  )}
                                  onClick={() => handleBookingClick(booking)}
                                ></div>
                              );
                            } else if (isAvailable) {
                              // Available time slot
                              return (
                                <div 
                                  key={`${professional.id}-${time}`}
                                  className="border-r bg-white hover:bg-emerald-50 transition-colors cursor-pointer p-3"
                                  onClick={() => handleTimeSlotClick(time, professional.id)}
                                ></div>
                              );
                            } else {
                              // Unavailable time slot
                              return (
                                <div 
                                  key={`${professional.id}-${time}`}
                                  className="border-r bg-gray-100 p-3"
                                ></div>
                              );
                            }
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
