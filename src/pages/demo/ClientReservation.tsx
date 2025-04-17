
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  format, 
  addDays, 
  subDays, 
  addWeeks, 
  subWeeks, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isToday, 
  isSameDay, 
  parse
} from "date-fns";
import { es } from "date-fns/locale";
import { 
  Calendar as CalendarIcon, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Clock, 
  Filter, 
  Scissors, 
  User, 
  Phone,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Professional, Appointment } from "@/types/service";
import { BusinessDetail } from "@/types/booking";

// Mock data
const defaultServices = [
  { id: 1, service_id: 1, name: "Corte de pelo", duration: 30, price: 15 },
  { id: 2, service_id: 2, name: "Tinte", duration: 60, price: 35 },
  { id: 3, service_id: 3, name: "Manicura", duration: 45, price: 25 },
  { id: 4, service_id: 4, name: "Pedicura", duration: 45, price: 25 },
  { id: 5, service_id: 5, name: "Masaje facial", duration: 30, price: 20 },
];

// Create more detailed mock data for time slots and availability
const professionals: Professional[] = [
  {
    id: 1,
    professional_id: 1,
    name: "María García",
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

// Generate available time slots for each day
const generateAvailableSlots = (date: Date) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const baseSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "12:00", "12:30", "13:00", "13:30", "14:00", "16:00", 
    "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
  ];
  
  // Add random availability per professional per day
  const dayAvailability: { [key: string]: string[] } = {};
  
  professionals.forEach(prof => {
    // Randomly select slots to be available
    const availableSlots = baseSlots.filter(() => Math.random() > 0.3);
    dayAvailability[prof.id.toString()] = availableSlots;
  });
  
  return dayAvailability;
};

// Generate month availability data for calendar display
const generateMonthAvailability = (month: Date) => {
  const start = startOfWeek(month, { weekStartsOn: 1 }); // Start from Monday
  const end = endOfWeek(addWeeks(start, 5), { weekStartsOn: 1 }); // Show 6 weeks
  const days = eachDayOfInterval({ start, end });
  
  return days.reduce((acc, day) => {
    // Generate availability percentage
    const dateStr = format(day, 'yyyy-MM-dd');
    const professionalAvailability = professionals.length * 8; // 8 slots per professional on average
    const random = Math.random();
    const reservedSlots = Math.floor(random * professionalAvailability);
    const percentage = Math.max(0, Math.floor((professionalAvailability - reservedSlots) / professionalAvailability * 100));
    
    acc[dateStr] = percentage;
    return acc;
  }, {} as Record<string, number>);
};

// Find first available slot for a service
const findFirstAvailableSlot = (serviceId: number | string) => {
  // Loop through next 14 days to find first slot
  for (let i = 0; i < 14; i++) {
    const day = addDays(new Date(), i);
    const dateStr = format(day, 'yyyy-MM-dd');
    
    // For each professional, check if they can provide this service and have slots available
    for (const prof of professionals) {
      // Assume all professionals can do all services for demo
      if (prof.isWorking) {
        // Get working hours
        if (prof.workingHours) {
          for (const hours of prof.workingHours) {
            const startHour = parseInt(hours.start.split(':')[0]);
            const endHour = parseInt(hours.end.split(':')[0]);
            
            // Check each half hour slot
            for (let hour = startHour; hour < endHour; hour++) {
              for (const minute of ['00', '30']) {
                const timeSlot = `${hour.toString().padStart(2, '0')}:${minute}`;
                
                // Check if slot is not booked
                const isBooked = prof.appointments?.some(apt => apt.time === timeSlot);
                
                if (!isBooked) {
                  return {
                    date: day,
                    time: timeSlot,
                    professional: prof.fullname
                  };
                }
              }
            }
          }
        }
      }
    }
  }
  
  // If no slot found, return null
  return null;
};

interface ClientReservationProps {
  inDialog?: boolean;
  onComplete?: () => void;
  businessData?: BusinessDetail;
}

const ClientReservation: React.FC<ClientReservationProps> = ({ 
  inDialog = false, 
  onComplete,
  businessData
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [availabilityData, setAvailabilityData] = useState(() => generateMonthAvailability(new Date()));
  const [dayPeriod, setDayPeriod] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [isNewClient, setIsNewClient] = useState<boolean | null>(null);
  const [otpValue, setOtpValue] = useState<string>("");
  const [firstAvailableSlots, setFirstAvailableSlots] = useState<Record<string, {date: Date, time: string, professional: string} | null>>({});
  const [dailyAvailableSlots, setDailyAvailableSlots] = useState<{[key: string]: string[]}>({});
  
  // Use either provided business services or default services
  const services = businessData?.services || defaultServices;

  const phoneForm = useForm<{ phone: string }>({
    resolver: zodResolver(z.object({
      phone: z.string().min(9, "El número de teléfono debe tener al menos 9 dígitos")
    })),
    defaultValues: {
      phone: ""
    }
  });

  // Generate week days for the week selector
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 1 }),
    end: endOfWeek(currentWeek, { weekStartsOn: 1 })
  });

  useEffect(() => {
    // Calculate first available slot for each service when component mounts
    const slots: Record<string, {date: Date, time: string, professional: string} | null> = {};
    services.forEach(service => {
      slots[service.service_id ? service.service_id.toString() : (service.id ? service.id.toString() : Math.random().toString())] = 
        findFirstAvailableSlot(service.service_id || service.id || 0);
    });
    setFirstAvailableSlots(slots);
  }, [services]);

  useEffect(() => {
    // Generate available slots for the selected date
    setDailyAvailableSlots(generateAvailableSlots(selectedDate));
  }, [selectedDate]);

  // Handle week navigation
  const handlePrevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  // Get available slots for selected date and service
  const getAvailableSlots = () => {
    let slots: Array<{time: string, professional: string}> = [];
    
    professionals.forEach(pro => {
      const proSlots = dailyAvailableSlots[pro.id.toString()] || [];
      
      proSlots.forEach(time => {
        // Check if slot is not already booked
        const isBooked = pro.appointments?.some(apt => apt.time === time);
        
        if (!isBooked) {
          // Check day period filter
          const hour = parseInt(time.split(':')[0]);
          if ((dayPeriod === "morning" && hour < 14) ||
              (dayPeriod === "afternoon" && hour >= 14) ||
              dayPeriod === "all") {
            slots.push({
              time,
              professional: pro.id.toString()
            });
          }
        }
      });
    });
    
    // Sort slots by time
    return slots.sort((a, b) => a.time.localeCompare(b.time));
  };

  const availableSlots = getAvailableSlots();

  const getDayAvailabilityClass = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const availability = availabilityData[dateStr] || 0;
    
    if (availability === 0) return "bg-gray-200 text-gray-700"; // No slots
    if (availability < 25) return "bg-rose-400 text-white hover:bg-rose-500"; // Very few slots
    if (availability < 50) return "bg-amber-400 text-white hover:bg-amber-500"; // Some slots
    return "bg-emerald-400 text-white hover:bg-emerald-500"; // Many slots
  };

  const getWeekDayAvailabilityColor = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const availability = availabilityData[dateStr] || 0;
    
    if (availability === 0) return "bg-gray-200"; // No slots
    if (availability < 25) return "bg-yellow-400"; // Very few slots
    if (availability < 50) return "bg-green-400"; // Some slots
    return "bg-green-600"; // Many slots
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setStep(2);
  };

  const handleWeekDaySelect = (day: Date) => {
    setSelectedDate(day);
  };

  const handleSlotSelect = (time: string, professionalId: string) => {
    setSelectedSlot(time);
    setSelectedProfessional(professionalId);
    setStep(3);
  };

  const onPhoneSubmit = (data: { phone: string }) => {
    // Mock check if client exists
    const clientExists = Math.random() > 0.5;
    setIsNewClient(!clientExists);
    
    if (clientExists) {
      // Existing client
      toast({
        title: "Reserva confirmada",
        description: "Tu cita ha sido reservada correctamente.",
        variant: "default",
      });
      setStep(5); // Confirmation
    } else {
      // New client, needs OTP
      toast({
        title: "Código de verificación enviado",
        description: "Te hemos enviado un código de verificación por SMS.",
        variant: "default",
      });
      setStep(4); // OTP verification
    }
  };

  const verifyOtp = () => {
    if (otpValue.length === 4) {
      toast({
        title: "Reserva confirmada",
        description: "Tu cita ha sido reservada correctamente.",
        variant: "default",
      });
      setStep(5); // Confirmation
    } else {
      toast({
        title: "Código incorrecto",
        description: "El código introducido no es válido.",
        variant: "destructive",
      });
    }
  };

  const resetAndGoHome = () => {
    if (inDialog && onComplete) {
      onComplete();
    } else {
      navigate("/");
    }
  };

  return (
    <div className={inDialog ? "px-0" : "container mx-auto px-4 py-8 max-w-4xl"}>
      {!inDialog && <h1 className="text-2xl font-bold mb-6">Reserva tu cita</h1>}
      
      {/* Progress steps */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full bg-emerald-500 transition-all" 
            style={{ width: `${(step - 1) * 25}%` }}
          ></div>
        </div>
        
        {[1, 2, 3, 4].map((s) => (
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
            {services.map(service => {
              const serviceId = service.service_id?.toString() || service.id?.toString() || "";
              const firstSlot = firstAvailableSlots[serviceId];
              
              return (
                <Card 
                  key={serviceId} 
                  className={cn(
                    "cursor-pointer hover:bg-gray-50 transition-colors",
                    selectedService === serviceId && "ring-2 ring-emerald-500"
                  )}
                  onClick={() => handleServiceSelect(serviceId)}
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
                      
                      {firstSlot && (
                        <div className="mt-2 text-xs border-t pt-2">
                          <p className="font-medium text-emerald-600">Primera cita disponible:</p>
                          <p>{format(firstSlot.date, "EEEE d 'de' MMMM", { locale: es })}</p>
                          <p>{firstSlot.time} ({firstSlot.professional})</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
                {/* Week day selector */}
                <div className="rounded-md border mb-4">
                  <div className="bg-gray-50 border-b p-3 flex justify-between items-center">
                    <h3 className="font-medium">Marzo 2025</h3>
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
                        day: (date) => {
                          return getDayAvailabilityClass(date);
                        }
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
                
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot, idx) => {
                      const professional = professionals.find(p => p.id.toString() === slot.professional);
                      return (
                        <Button
                          key={`${slot.professional}-${slot.time}`}
                          variant="outline"
                          className="h-auto py-3 justify-start"
                          onClick={() => handleSlotSelect(slot.time, slot.professional)}
                        >
                          <Clock className="h-4 w-4 mr-2 text-emerald-500" />
                          <div className="text-left">
                            <div>{slot.time}</div>
                            <div className="text-xs text-gray-500">{professional?.fullname}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center p-6 text-gray-500 bg-gray-50 rounded-lg">
                    No hay horas disponibles para esta fecha y filtro.
                  </div>
                )}
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
            <CardTitle>Introduce tu número de teléfono</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="border p-4 rounded-lg bg-gray-50">
                    <h3 className="font-medium mb-2">Resumen de la reserva</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Servicio:</span>
                        <span className="font-medium">
                          {services.find(s => 
                            (s.service_id?.toString() || s.id?.toString()) === selectedService
                          )?.name}
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
                      <div className="flex justify-between">
                        <span className="text-gray-500">Profesional:</span>
                        <span className="font-medium">
                          {professionals.find(p => p.id.toString() === selectedProfessional)?.fullname}
                        </span>
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={phoneForm.control}
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
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
                  <Button variant="outline" type="button" onClick={() => setStep(2)}>
                    Atrás
                  </Button>
                  <Button type="submit">
                    Reservar cita
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Verifica tu número de teléfono</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-gray-500">
                Hemos enviado un código de verificación a tu teléfono. 
                Introdúcelo para confirmar tu reserva.
              </p>

              <div className="flex flex-col items-center justify-center gap-4">
                <InputOTP maxLength={4} value={otpValue} onChange={setOtpValue}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>

                <Button 
                  variant="link" 
                  type="button" 
                  onClick={() => {
                    toast({
                      title: "Código reenviado",
                      description: "Te hemos enviado un nuevo código de verificación.",
                    });
                  }}
                >
                  Reenviar código
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStep(3)}>
              Atrás
            </Button>
            <Button onClick={verifyOtp}>
              Verificar
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 5 && (
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
                      {services.find(s => 
                        (s.service_id?.toString() || s.id?.toString()) === selectedService
                      )?.name}
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
                  <div className="flex justify-between">
                    <span className="text-gray-500">Profesional:</span>
                    <span className="font-medium">
                      {professionals.find(p => p.id.toString() === selectedProfessional)?.fullname}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={resetAndGoHome} className="w-full">
              {inDialog ? "Cerrar" : "Volver al inicio"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ClientReservation;
