import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Calendar as CalendarIcon, 
  ChevronDown, 
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

// Mock data
const services = [
  { id: "s1", name: "Corte de pelo", duration: 30, price: 15 },
  { id: "s2", name: "Tinte", duration: 60, price: 35 },
  { id: "s3", name: "Manicura", duration: 45, price: 25 },
  { id: "s4", name: "Pedicura", duration: 45, price: 25 },
  { id: "s5", name: "Masaje facial", duration: 30, price: 20 },
];

const professionals = [
  {
    id: "prof1",
    name: "María García",
    isWorking: true,
    availability: [
      { day: "2024-04-24", slots: ["10:00", "11:00", "12:00", "17:00", "18:00"] },
      { day: "2024-04-25", slots: ["09:00", "10:00", "12:00", "16:00"] },
      { day: "2024-04-26", slots: ["10:00", "11:00", "12:00", "16:00", "17:00", "18:00"] },
    ]
  },
  {
    id: "prof2",
    name: "Juan Pérez",
    isWorking: true,
    availability: [
      { day: "2024-04-24", slots: ["09:00", "12:00", "13:00", "17:00", "18:00"] },
      { day: "2024-04-25", slots: ["09:00", "10:00", "11:00", "16:00", "18:00"] },
      { day: "2024-04-26", slots: ["09:00", "10:00", "12:00", "16:00", "18:00"] },
    ]
  },
];

const generateMonthAvailability = (month: Date) => {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  
  return days.reduce((acc, day) => {
    // Generate random availability percentage (0-100%)
    const dateStr = format(day, 'yyyy-MM-dd');
    const professionalAvailability = professionals.reduce((total, prof) => {
      const dayAvail = prof.availability.find(a => a.day === dateStr);
      return total + (dayAvail ? dayAvail.slots.length : 0);
    }, 0);
    
    const maxPossibleSlots = professionals.length * 16; // Assuming 8 hours * 2 slots per hour
    acc[dateStr] = Math.min(100, Math.floor((professionalAvailability / maxPossibleSlots) * 100));
    return acc;
  }, {} as Record<string, number>);
};

const ClientReservation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [availabilityData, setAvailabilityData] = useState(() => generateMonthAvailability(currentMonth));
  const [dayPeriod, setDayPeriod] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [isNewClient, setIsNewClient] = useState<boolean | null>(null);
  const [otpValue, setOtpValue] = useState<string>("");

  const phoneForm = useForm<{ phone: string }>({
    resolver: zodResolver(z.object({
      phone: z.string().min(9, "El número de teléfono debe tener al menos 9 dígitos")
    })),
    defaultValues: {
      phone: ""
    }
  });

  useEffect(() => {
    setAvailabilityData(generateMonthAvailability(currentMonth));
  }, [currentMonth]);

  // Get available slots for selected date and service
  const getAvailableSlots = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    let slots: Array<{time: string, professional: string}> = [];
    
    professionals.forEach(pro => {
      const dayAvail = pro.availability.find(a => a.day === dateStr);
      if (dayAvail) {
        dayAvail.slots.forEach(slot => {
          if ((dayPeriod === "morning" && parseInt(slot.split(":")[0]) < 14) ||
              (dayPeriod === "afternoon" && parseInt(slot.split(":")[0]) >= 14) ||
              dayPeriod === "all") {
            slots.push({
              time: slot,
              professional: pro.id
            });
          }
        });
      }
    });
    
    // Sort slots by time
    return slots.sort((a, b) => a.time.localeCompare(b.time));
  };

  const availableSlots = getAvailableSlots();

  const getDayAvailabilityClass = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const availability = availabilityData[dateStr] || 0;
    
    if (availability === 0) return "bg-gray-200 text-gray-700"; // No slots
    if (availability < 25) return "bg-rose-400 text-white hover:bg-rose-500"; // Very few slots
    if (availability < 50) return "bg-amber-400 text-white hover:bg-amber-500"; // Some slots
    return "bg-emerald-400 text-white hover:bg-emerald-500"; // Many slots
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setStep(2);
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
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Reserva tu cita</h1>
      
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
            {services.map(service => (
              <Card 
                key={service.id} 
                className={cn(
                  "cursor-pointer hover:bg-gray-50 transition-colors",
                  selectedService === service.id && "ring-2 ring-emerald-500"
                )}
                onClick={() => handleServiceSelect(service.id)}
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
                        day: (date) => cn(getDayAvailabilityClass(date))
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
                      const professional = professionals.find(p => p.id === slot.professional);
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
                            <div className="text-xs text-gray-500">{professional?.name}</div>
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
                        <span className="font-medium">{services.find(s => s.id === selectedService)?.name}</span>
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
                        <span className="font-medium">{professionals.find(p => p.id === selectedProfessional)?.name}</span>
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
                    <span className="font-medium">{services.find(s => s.id === selectedService)?.name}</span>
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
                    <span className="font-medium">{professionals.find(p => p.id === selectedProfessional)?.name}</span>
                  </div>
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
