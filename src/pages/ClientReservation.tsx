import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays, subDays, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay, isSameMonth, parse, parseISO, addMinutes } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Clock, Filter, Scissors, User, Phone, Mail, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Service, DailyAvailability, AvailableSlot, BusinessHours, BusinessDetail } from "@/types/service";
import { Professional, Appointment } from "@/types/professional";
import axios from "axios";

const clientFormSchema = z.object({
  phone: z.string().min(9, "El número de teléfono debe tener al menos 9 dígitos"),
  name: z.string().optional(),
  email: z.string().email("El email debe ser válido").optional()
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

const professionals: Professional[] = [
  {
    id: 1,
    professional_id: 1,
    name: "María García",
    surnames: null,
    fullname: "María García",
    isWorking: true,
    workingHours: [
      { start: "09:00", end: "14:00" },
      { start: "16:00", end: "20:00" }
    ],
    appointments: [
      { id: "apt1", time: "10:00", duration: 30, clientName: "Laura Martínez", service: "Corte de pelo" },
      { id: "apt2", time: "12:30", duration: 30, clientName: "Carlos Ruiz", service: "Corte de pelo" },
      { id: "apt3", time: "17:00", duration: 60, clientName: "Ana López", service: "Tinte" }
    ]
  },
  {
    id: 2,
    professional_id: 2,
    name: "Juan Pérez",
    surnames: null,
    fullname: "Juan Pérez",
    isWorking: true,
    workingHours: [
      { start: "09:00", end: "14:00" },
      { start: "16:00", end: "20:00" }
    ],
    appointments: [
      { id: "apt4", time: "09:30", duration: 45, clientName: "Ana López", service: "Manicura" },
      { id: "apt5", time: "16:30", duration: 60, clientName: "Pedro Sánchez", service: "Tinte" },
      { id: "apt6", time: "18:00", duration: 30, clientName: "Lucía Torres", service: "Corte de pelo" }
    ]
  },
  {
    id: 3,
    professional_id: 3,
    name: "Elena Martínez",
    surnames: null,
    fullname: "Elena Martínez",
    isWorking: true,
    workingHours: [
      { start: "09:00", end: "14:00" }
    ],
    appointments: [
      { id: "apt7", time: "09:00", duration: 45, clientName: "Pablo Díaz", service: "Pedicura" },
      { id: "apt8", time: "11:30", duration: 30, clientName: "Carmen Ruiz", service: "Corte de pelo" }
    ]
  }
];

const generateTimeSlots = (availableSlots: AvailableSlot[], serviceDuration: number): string[] => {
  let timeSlots: string[] = [];
  
  availableSlots.forEach(slot => {
    const startTime = parseISO(`2023-01-01T${slot.start}`);
    const endTime = parseISO(`2023-01-01T${slot.end}`);
    
    let currentTime = startTime;
    while (currentTime < endTime) {
      timeSlots.push(format(currentTime, 'HH:mm'));
      currentTime = addMinutes(currentTime, serviceDuration);
    }
  });
  
  return [...new Set(timeSlots)].sort();
};

const findAvailabilityForDate = (date: Date, availabilityData: DailyAvailability[]): DailyAvailability | null => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return availabilityData.find(day => day.date === dateStr) || null;
};

const generateMonthAvailability = (availabilityData: DailyAvailability[], month: Date) => {
  const start = startOfWeek(month, { weekStartsOn: 1 });
  const end = endOfWeek(addWeeks(start, 5), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });
  
  return days.reduce((acc, day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    
    const dayAvailability = availabilityData.find(d => d.date === dateStr);
    
    let percentage = 0;
    if (dayAvailability) {
      let totalAvailableMinutes = 0;
      dayAvailability.available_slots.forEach(slot => {
        const startTime = parseISO(`2023-01-01T${slot.start}`);
        const endTime = parseISO(`2023-01-01T${slot.end}`);
        totalAvailableMinutes += (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      });
      
      let totalBusinessMinutes = 0;
      dayAvailability.business_hours.forEach(hours => {
        const startTime = parseISO(`2023-01-01T${hours.start}`);
        const endTime = parseISO(`2023-01-01T${hours.end}`);
        totalBusinessMinutes += (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      });
      
      percentage = totalBusinessMinutes > 0 ? 
        Math.floor((totalAvailableMinutes / totalBusinessMinutes) * 100) : 0;
    }
    
    acc[dateStr] = percentage;
    return acc;
  }, {} as Record<string, number>);
};

const fetchAvailableSlots = async (businessId: string, startDate: string, endDate: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/client_portal/${businessId}/available-slots/`,
      {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching available slots:", error);
    throw error;
  }
};

interface DailyAvailability {
  date: string;
  business_hours: BusinessHours[];
  available_slots: AvailableSlot[];
  percentage?: number;
}

interface ReservationState {
  service_id?: number;
  professional_id?: number;
  start_datetime?: string;
  end_datetime?: string;
  phone?: string;
  name?: string;
  email?: string;
}

interface ClientReservationProps {
  businessData: BusinessDetail;
  inDialog?: boolean;
  onComplete?: (formData: any) => void;
  showConfirmationAsStep?: boolean;
  initialAvailability?: DailyAvailability[];
}

const ClientReservation = ({ 
  businessData, 
  inDialog = false,
  onComplete,
  showConfirmationAsStep = true,
  initialAvailability = []
}: ClientReservationProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [currentMonthDisplay, setCurrentMonthDisplay] = useState<string>(
    format(currentWeek, "MMMM yyyy", { locale: es })
  );
  const [availabilityData, setAvailabilityData] = useState<DailyAvailability[]>(initialAvailability);
  const [dayPeriod, setDayPeriod] = useState<string>("all");
  const [reservationData, setReservationData] = useState<ReservationState>({});
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null);
  const [step, setStep] = useState<number>(1);
  const [firstAvailableSlots, setFirstAvailableSlots] = useState<Record<number, {date: Date, time: string, professional: string} | null>>({});
  const [dailySlots, setDailySlots] = useState<string[]>([]);
  const [showProfessionalsSelection, setShowProfessionalsSelection] = useState<boolean>(false);

  const clientForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      phone: "",
      name: "",
      email: ""
    }
  });

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 1 }),
    end: endOfWeek(currentWeek, { weekStartsOn: 1 })
  });

  const findFirstAvailableSlot = (serviceId: number, availabilityData: DailyAvailability[]): {date: Date, time: string, professional: string} | null => {
    const service = businessData.services.find(s => s.service_id === serviceId);
    if (!service) return null;
    
    for (let i = 0; i < 14; i++) {
      const day = addDays(new Date(), i);
      const dateStr = format(day, 'yyyy-MM-dd');
      
      const dayAvailability = availabilityData.find(d => d.date === dateStr);
      if (dayAvailability && dayAvailability.available_slots.length > 0) {
        const timeSlots = generateTimeSlots(dayAvailability.available_slots, service.duration);
        
        if (timeSlots.length > 0) {
          return {
            date: day,
            time: timeSlots[0],
            professional: "Primer disponible"
          };
        }
      }
    }
    
    return null;
  };

  useEffect(() => {
    const slots: Record<number, {date: Date, time: string, professional: string} | null> = {};
    businessData.services.forEach(service => {
      slots[service.service_id] = findFirstAvailableSlot(service.service_id, availabilityData);
    });
    setFirstAvailableSlots(slots);
  }, [businessData.services, availabilityData]);

  const handleServiceSelect = (service: Service) => {
    console.log("Service selected:", service);
    const serviceId = service.service_id || service.id;
    
    if (!serviceId) {
      console.error("Service ID is missing:", service);
      toast({
        title: "Error",
        description: "No se pudo seleccionar el servicio. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
      return;
    }

    setReservationData(prev => {
      const newData = {
        ...prev,
        service_id: serviceId
      };
      console.log("Updated reservation data:", newData);
      return newData;
    });

    setSelectedDate(new Date());
    setSelectedSlot("");
    setStep(2);

    const startDate = format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const endDate = format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
    axios.get(
      `${apiBaseUrl}/client_portal/${businessData.business_id}/available-slots/`,
      {
        params: {
          start_date: startDate,
          end_date: endDate,
          service_id: serviceId
        }
      }
    ).then(response => {
      const processedData = response.data.map((day: DailyAvailability) => {
        let totalAvailableMinutes = 0;
        let totalBusinessMinutes = 0;

        day.available_slots.forEach(slot => {
          const startTime = parseISO(`2023-01-01T${slot.start}`);
          const endTime = parseISO(`2023-01-01T${slot.end}`);
          totalAvailableMinutes += (endTime.getTime() - startTime.getTime()) / (1000 * 60);
        });

        day.business_hours.forEach(hours => {
          const startTime = parseISO(`2023-01-01T${hours.start}`);
          const endTime = parseISO(`2023-01-01T${hours.end}`);
          totalBusinessMinutes += (endTime.getTime() - startTime.getTime()) / (1000 * 60);
        });

        return {
          ...day,
          percentage: totalBusinessMinutes > 0 
            ? Math.floor((totalAvailableMinutes / totalBusinessMinutes) * 100) 
            : 0
        };
      });

      setAvailabilityData(processedData);
    }).catch(error => {
      console.error("Error loading initial availability:", error);
      toast({
        title: "Error al cargar disponibilidad",
        description: "No se pudo cargar la disponibilidad. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    });
  };

  const handlePrevWeek = () => {
    const newWeek = subWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);
    loadWeekAvailability(newWeek);
  };

  const handleNextWeek = () => {
    const newWeek = addWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);
    loadWeekAvailability(newWeek);
  };

  useEffect(() => {
    const firstDay = weekDays[0];
    const lastDay = weekDays[weekDays.length - 1];
    
    if (!isSameMonth(firstDay, new Date(currentMonthDisplay)) || 
        !isSameMonth(lastDay, new Date(currentMonthDisplay))) {
      const daysInCurrentMonth = weekDays.filter(day => 
        format(day, 'MMMM yyyy', { locale: es }) === currentMonthDisplay
      ).length;
      
      const daysInNewMonth = weekDays.length - daysInCurrentMonth;
      
      if (daysInNewMonth > daysInCurrentMonth) {
        setCurrentMonthDisplay(format(daysInNewMonth > 3 ? lastDay : firstDay, 'MMMM yyyy', { locale: es }));
      }
    }
  }, [currentWeek, weekDays, currentMonthDisplay]);

  useEffect(() => {
    if (reservationData.service_id && selectedDate) {
      const service = businessData.services.find(s => s.service_id === reservationData.service_id);
      if (service) {
        const dayAvailability = findAvailabilityForDate(selectedDate, availabilityData);
        if (dayAvailability) {
          const slots = generateTimeSlots(dayAvailability.available_slots, service.duration);
          setDailySlots(slots);
        } else {
          setDailySlots([]);
        }
      }
    }
  }, [selectedDate, reservationData.service_id, businessData.services, availabilityData]);

  const getFilteredSlots = () => {
    return dailySlots.filter(timeSlot => {
      const hour = parseInt(timeSlot.split(':')[0]);
      if (dayPeriod === "morning" && hour < 14) return true;
      if (dayPeriod === "afternoon" && hour >= 14) return true;
      if (dayPeriod === "all") return true;
      return false;
    });
  };

  const filteredSlots = getFilteredSlots();

  const getDayAvailabilityClass = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const availability = availabilityData.find(d => d.date === dateStr)?.percentage || 0;
    
    if (availability === 0) return "bg-gray-200 text-gray-700";
    if (availability < 25) return "bg-rose-400 text-white hover:bg-rose-500";
    if (availability < 50) return "bg-amber-400 text-white hover:bg-amber-500";
    return "bg-emerald-400 text-white hover:bg-emerald-500";
  };

  const getWeekDayAvailabilityColor = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const availability = availabilityData.find(d => d.date === dateStr)?.percentage || 0;
    
    if (availability === 0) return "bg-gray-200";
    if (availability < 25) return "bg-yellow-400";
    if (availability < 50) return "bg-green-400";
    return "bg-green-600";
  };

  const handleWeekDaySelect = (day: Date) => {
    setSelectedDate(day);
  };

  const handleSlotSelect = (time: string, professionalId: number | null = null) => {
    const selectedDateTime = new Date(selectedDate);
    const [hours, minutes] = time.split(':');
    selectedDateTime.setHours(parseInt(hours), parseInt(minutes));

    const service = businessData.services.find(s => s.service_id === reservationData.service_id);
    const endDateTime = new Date(selectedDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + (service?.duration || 0));

    setReservationData(prev => ({
      ...prev,
      start_datetime: selectedDateTime.toISOString(),
      end_datetime: endDateTime.toISOString(),
      professional_id: professionalId || undefined
    }));

    setSelectedSlot(time);
    setStep(3);
  };

  const onClientFormSubmit = async (data: ClientFormValues) => {
    try {
      // Actualizar el estado de reservationData con los datos del formulario
      const updatedReservationData = {
        ...reservationData,
        phone: data.phone,
        name: data.name,
        email: data.email
      };

      // Formatear las fechas al formato que espera el backend (YYYY-MM-DDTHH:mm)
      const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "yyyy-MM-dd'T'HH:mm");
      };

      // Preparar los datos para la API
      const bookingData = {
        start_datetime: formatDateTime(updatedReservationData.start_datetime!),
        end_datetime: formatDateTime(updatedReservationData.end_datetime!),
        service_id: updatedReservationData.service_id,
        professional_id: updatedReservationData.professional_id,
        phone: data.phone,
        name: data.name,
        email: data.email
      };

      console.log("Sending booking data:", bookingData);

      // Hacer la llamada a la API
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
      const response = await axios.post(
        `${apiBaseUrl}/client_portal/${businessData.business_id}/bookings/`,
        bookingData
      );

      console.log("Booking created:", response.data);

      // Si la reserva se creó correctamente
      if (response.status === 201) {
        if (onComplete) {
          onComplete(updatedReservationData);
        }

        toast({
          title: "Reserva confirmada",
          description: "Tu cita ha sido reservada correctamente.",
          variant: "default",
        });
        
        setStep(4);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      
      // Manejar errores específicos
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "No se pudo crear la reserva. Por favor, inténtalo de nuevo.";
        toast({
          title: "Error al crear la reserva",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    }
  };

  const resetAndGoHome = () => {
    navigate("/");
  };

  const renderTimeSlots = () => {
    if (filteredSlots.length === 0) {
      return (
        <div className="text-center p-6 text-gray-500 bg-gray-50 rounded-lg">
          No hay horas disponibles para esta fecha y filtro.
        </div>
      );
    }
    
    if (!showProfessionalsSelection) {
      return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {filteredSlots.map((timeSlot) => (
            <Button
              key={timeSlot}
              variant="outline"
              className="h-auto py-3 justify-center"
              onClick={() => handleSlotSelect(timeSlot)}
            >
              <Clock className="h-4 w-4 mr-2 text-emerald-500" />
              <div>{timeSlot}</div>
            </Button>
          ))}
        </div>
      );
    } else {
      return professionals.map((professional) => (
        <div key={professional.id} className="mb-6">
          <h3 className="font-medium text-sm mb-2">{professional.fullname}</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {filteredSlots.map((timeSlot) => (
              <Button
                key={`${professional.id}-${timeSlot}`}
                variant="outline"
                className="h-auto py-3 justify-center"
                onClick={() => handleSlotSelect(timeSlot, professional.id)}
              >
                <Clock className="h-4 w-4 mr-2 text-emerald-500" />
                <div>{timeSlot}</div>
              </Button>
            ))}
          </div>
        </div>
      ));
    }
  };

  const loadWeekAvailability = async (week: Date) => {
    if (!reservationData.service_id || !businessData?.business_id) {
      console.log("No service selected or no business ID:", { 
        selectedService: reservationData.service_id, 
        businessId: businessData?.business_id 
      });
      return;
    }

    try {
      const startDate = format(startOfWeek(week, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const endDate = format(endOfWeek(week, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      
      console.log("Fetching availability for week:", {
        startDate,
        endDate,
        selectedService: reservationData.service_id,
        businessId: businessData.business_id
      });

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
      const response = await axios.get(
        `${apiBaseUrl}/client_portal/${businessData.business_id}/available-slots/`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
            service_id: reservationData.service_id
          }
        }
      );

      const processedData = response.data.map((day: DailyAvailability) => {
        let totalAvailableMinutes = 0;
        let totalBusinessMinutes = 0;

        day.available_slots.forEach(slot => {
          const startTime = parseISO(`2023-01-01T${slot.start}`);
          const endTime = parseISO(`2023-01-01T${slot.end}`);
          totalAvailableMinutes += (endTime.getTime() - startTime.getTime()) / (1000 * 60);
        });

        day.business_hours.forEach(hours => {
          const startTime = parseISO(`2023-01-01T${hours.start}`);
          const endTime = parseISO(`2023-01-01T${hours.end}`);
          totalBusinessMinutes += (endTime.getTime() - startTime.getTime()) / (1000 * 60);
        });

        return {
          ...day,
          percentage: totalBusinessMinutes > 0 
            ? Math.floor((totalAvailableMinutes / totalBusinessMinutes) * 100) 
            : 0
        };
      });

      setAvailabilityData(processedData);
    } catch (error) {
      console.error("Error loading availability:", error);
      toast({
        title: "Error al cargar disponibilidad",
        description: "No se pudo cargar la disponibilidad. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadWeekAvailability(currentWeek);
  }, [currentWeek, reservationData.service_id, businessData?.business_id]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Reserva tu cita</h1>
      
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full bg-emerald-500 transition-all" 
            style={{ width: `${(step - 1) * 33.33}%` }}
          ></div>
        </div>
        
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={cn(
              "z-10 rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium transition-colors",
              step >= s 
                ? "bg-emerald-500 text-white" 
                : "bg-gray-200 text-gray-500"
            )}
          >
            {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Selecciona un servicio</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {businessData.services.map((service, index) => (
              <Card 
                key={service.service_id || `service-${index}`}
                className={cn(
                  "cursor-pointer hover:bg-gray-50 transition-colors",
                  reservationData.service_id === (service.service_id || service.id) && "ring-2 ring-emerald-500"
                )}
                onClick={() => {
                  console.log("Clicking service:", service);
                  handleServiceSelect(service);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Scissors className="h-5 w-5 text-emerald-500" />
                      <h3 className="font-medium">{service.name}</h3>
                    </div>
                    <div className="text-sm text-gray-500 flex justify-between">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration} min
                      </span>
                      <span>{service.price} €</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Elige día y hora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-md border mb-4">
                  <div className="bg-gray-50 border-b p-3 flex justify-between items-center">
                    <h3 className="font-medium capitalize">{currentMonthDisplay}</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={handlePrevWeek}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleNextWeek}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 p-2 gap-2">
                    {weekDays.map((day) => {
                      const isSelected = isSameDay(day, selectedDate);
                      const dayNumber = format(day, 'd');
                      const dayName = format(day, 'EEE', { locale: es });
                      const bgColor = getWeekDayAvailabilityColor(day);
                      
                      return (
                        <Button
                          key={day.toString()}
                          variant="outline"
                          className={cn(
                            "h-auto py-3 px-1 flex flex-col items-center justify-center border",
                            isSelected && "ring-2 ring-emerald-500",
                            isToday(day) && "bg-emerald-50"
                          )}
                          onClick={() => handleWeekDaySelect(day)}
                        >
                          <span className="text-xs uppercase">{dayName}.</span>
                          <span className="text-lg font-medium">{dayNumber}</span>
                          <div className={cn("w-10 h-1.5 mt-1 rounded-full", bgColor)}></div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      locale={es}
                      className="pointer-events-auto"
                      classNames={{
                        day: getDayAvailabilityClass as unknown as string
                      }}
                    />
                  </PopoverContent>
                </Popover>

                <div className="space-y-2">
                  <Label>Filtrar por horario</Label>
                  <ToggleGroup type="single" value={dayPeriod} onValueChange={(value) => value && setDayPeriod(value)}>
                    <ToggleGroupItem value="all" className="flex-1">
                      Todo el día
                    </ToggleGroupItem>
                    <ToggleGroupItem value="morning" className="flex-1">
                      Mañana
                    </ToggleGroupItem>
                    <ToggleGroupItem value="afternoon" className="flex-1">
                      Tarde
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    <span className="text-xs">Alta disponibilidad</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <span className="text-xs">Media disponibilidad</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <span className="text-xs">Baja disponibilidad</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm font-medium">
                  Horas disponibles para {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                </div>
                
                {renderTimeSlots()}
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end space-x-2">
            <Button variant="outline" onClick={() => setStep(1)}>Atrás</Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Tus datos de contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...clientForm}>
              <form onSubmit={clientForm.handleSubmit(onClientFormSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="border p-4 rounded-lg bg-gray-50">
                    <h3 className="font-medium mb-2">Resumen de la reserva</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Servicio:</span>
                        <span className="font-medium">
                          {businessData.services.find(s => s.service_id === reservationData.service_id)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fecha:</span>
                        <span className="font-medium">{format(selectedDate, "PPP", { locale: es })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Hora:</span>
                        <span className="font-medium">{selectedSlot}</span>
                      </div>
                      {reservationData.professional_id && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Profesional:</span>
                          <span className="font-medium">
                            {professionals.find(p => p.id === reservationData.professional_id)?.fullname}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <FormField
                    control={clientForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de teléfono</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-2 rounded-l-md border-y border-l">
                              <Phone className="h-5 w-5 text-gray-500" />
                            </div>
                            <Input 
                              className="rounded-l-none" 
                              placeholder="Ej. 612345678" 
                              type="tel"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={clientForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre y apellido (opcional)</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <div className="bg-gray-100 p-2 rounded-l-md border-y border-l">
                                <User className="h-5 w-5 text-gray-500" />
                              </div>
                              <Input 
                                className="rounded-l-none" 
                                placeholder="Ej. María García" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={clientForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (opcional)</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <div className="bg-gray-100 p-2 rounded-l-md border-y border-l">
                                <Mail className="h-5 w-5 text-gray-500" />
                              </div>
                              <Input 
                                className="rounded-l-none" 
                                placeholder="Ej. maria@example.com" 
                                type="email"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="sm:order-1"
                    onClick={() => setStep(2)}
                  >
                    Atrás
                  </Button>
                  <Button 
                    type="submit" 
                    className="order-first sm:order-2"
                  >
                    Reservar cita
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
              Reserva confirmada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Tu cita ha sido reservada correctamente. Hemos enviado los detalles a tu teléfono.</p>
              
              <div className="border p-4 rounded-lg bg-white">
                <h3 className="font-medium mb-2">Detalles de la reserva</h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Servicio:</span>
                    <span className="font-medium">
                      {businessData.services.find(s => s.service_id === reservationData.service_id)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha:</span>
                    <span className="font-medium">{format(selectedDate, "PPP", { locale: es })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hora:</span>
                    <span className="font-medium">{selectedSlot}</span>
                  </div>
                  {reservationData.professional_id && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Profesional:</span>
                      <span className="font-medium">
                        {professionals.find(p => p.id === reservationData.professional_id)?.fullname}
                      </span>
                    </div>
                  )}
                  {clientForm.getValues("name") && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cliente:</span>
                      <span className="font-medium">{clientForm.getValues("name")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={resetAndGoHome} className="w-full">
              Volver al inicio
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ClientReservation;
