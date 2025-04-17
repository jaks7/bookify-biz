
import React, { useState, useEffect } from "react";
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
  isSameMonth,
  parse,
  parseISO,
  addMinutes
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
  Mail,
  CheckCircle2
} from "lucide-react";
import { 
  Dialog, 
  DialogContent,
  DialogFooter,
  DialogHeader, 
  DialogTitle,
  DialogClose 
} from "@/components/ui/dialog";
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Sheet,
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetClose 
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Service, DailyAvailability, AvailableSlot, Professional } from "@/types/service";
import { BusinessDetail } from "@/types/booking";

const services: Service[] = [
  { id: 1, name: "Corte de pelo", duration: 30, price: 15 },
  { id: 2, name: "Tinte", duration: 90, price: 40 },
  { id: 3, name: "Manicura", duration: 45, price: 20 },
  { id: 4, name: "Pedicura", duration: 45, price: 25 },
  { id: 5, name: "Tratamiento facial", duration: 60, price: 35 },
];

const professionals: Professional[] = [
  {
    id: 1, 
    name: "Sara", 
    fullname: "Sara López", 
    isWorking: true,
    workingHours: [{ start: "09:00", end: "17:00" }],
    appointments: []
  },
  {
    id: 2, 
    name: "Carlos", 
    fullname: "Carlos García", 
    isWorking: true,
    workingHours: [{ start: "10:00", end: "18:00" }],
    appointments: []
  },
];

// Generar datos de disponibilidad para un mes
const generateMonthAvailability = () => {
  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 1 });
  const endDate = addDays(endOfWeek(addWeeks(today, 3), { weekStartsOn: 1 }), 1);
  
  const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });
  
  return daysInRange.map(day => {
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    const slots = isWeekend 
      ? (day.getDay() === 6 ? ["10:00", "11:00", "12:00"] : []) // Sábado limitado, domingo cerrado
      : ["09:00", "10:00", "11:00", "12:00", "13:00", "16:00", "17:00", "18:00"];
    
    return {
      date: format(day, "yyyy-MM-dd"),
      business_hours: isWeekend 
        ? (day.getDay() === 6 ? [{ start: "10:00", end: "13:00" }] : []) 
        : [{ start: "09:00", end: "14:00" }, { start: "16:00", end: "19:00" }],
      available_slots: slots.map(time => ({
        start: time,
        end: format(addMinutes(parse(time, "HH:mm", day), 30), "HH:mm")
      }))
    };
  });
};

const reservationFormSchema = z.object({
  phone: z.string().min(9, { message: "El teléfono debe tener al menos 9 dígitos" }),
  fullname: z.string().optional(),
  email: z.string().email({ message: "Por favor introduce un email válido" }).optional(),
});

interface ReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessDetail;
}

export const ReservationDialog = ({ isOpen, onClose, business }: ReservationDialogProps) => {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<Service | null>(null);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [availabilityData, setAvailabilityData] = useState<DailyAvailability[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof reservationFormSchema>>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      phone: "",
      fullname: "",
      email: "",
    },
  });

  useEffect(() => {
    // Cargar datos de disponibilidad
    const monthData = generateMonthAvailability();
    setAvailabilityData(monthData);
  }, []);

  // Actualizar slots disponibles cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const dayData = availabilityData.find(d => d.date === dateStr);
      if (dayData) {
        setAvailableSlots(dayData.available_slots);
      } else {
        setAvailableSlots([]);
      }
      setSelectedSlot(null);
    }
  }, [selectedDate, availabilityData]);

  // Filtrar servicios basados en el negocio
  const availableServices = business?.services || services;

  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleContinue = () => {
    if (step === 1 && !service) {
      toast({
        title: "Por favor, selecciona un servicio",
        variant: "destructive",
      });
      return;
    }

    if (step === 2 && !professional) {
      toast({
        title: "Por favor, selecciona un profesional",
        variant: "destructive",
      });
      return;
    }

    if (step === 3 && (!selectedDate || !selectedSlot)) {
      toast({
        title: "Por favor, selecciona fecha y hora",
        variant: "destructive",
      });
      return;
    }

    if (step === 4) {
      const isValid = form.trigger();
      if (!isValid) return;
      
      // Mostrar diálogo de verificación
      setShowVerificationDialog(true);
      return;
    }

    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleVerificationSubmit = () => {
    // Validar código (para demo siempre correcto)
    if (verificationCode.length === 6) {
      setShowVerificationDialog(false);
      setShowConfirmation(true);
    } else {
      toast({
        title: "Código incompleto",
        description: "Por favor, introduce el código de 6 dígitos",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    // Reiniciar estado
    setStep(1);
    setService(null);
    setProfessional(null);
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setShowVerificationDialog(false);
    setShowConfirmation(false);
    setVerificationCode("");
    form.reset();
    onClose();
  };

  const handleReset = () => {
    // Reiniciar todo para una nueva reserva
    setStep(1);
    setService(null);
    setProfessional(null);
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setShowVerificationDialog(false);
    setShowConfirmation(false);
    setVerificationCode("");
    form.reset();
  };

  // Función para colorear fechas en el calendario
  const getDayClass = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = availabilityData.find(d => d.date === dateStr);
    
    if (!dayData || dayData.available_slots.length === 0) {
      return "bg-gray-200 text-gray-700"; // Día sin disponibilidad
    }
    
    // Disponibilidad alta, media o baja basada en cantidad de slots
    if (dayData.available_slots.length > 6) {
      return "bg-emerald-400 text-white hover:bg-emerald-500";
    } else if (dayData.available_slots.length > 3) {
      return "bg-amber-400 text-white hover:bg-amber-500";
    } else {
      return "bg-rose-400 text-white hover:bg-rose-500";
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md md:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {step === 1 ? "Elige un servicio" : 
               step === 2 ? "Elige un profesional" :
               step === 3 ? "Elige fecha y hora" :
               "Completa tus datos"}
            </DialogTitle>
          </DialogHeader>

          {/* Paso 1: Selección de servicio */}
          {step === 1 && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                {availableServices.map((svc) => (
                  <Card 
                    key={svc.id || svc.service_id} 
                    className={cn(
                      "cursor-pointer hover:shadow-md transition-all",
                      service?.id === svc.id ? "border-2 border-primary" : ""
                    )}
                    onClick={() => setService(svc)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Scissors className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{svc.name}</h3>
                          <p className="text-sm text-muted-foreground">{svc.duration} minutos</p>
                        </div>
                      </div>
                      <div className="font-bold">{svc.price}€</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Paso 2: Selección de profesional */}
          {step === 2 && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                {professionals.map((prof) => (
                  <Card 
                    key={prof.id} 
                    className={cn(
                      "cursor-pointer hover:shadow-md transition-all",
                      professional?.id === prof.id ? "border-2 border-primary" : ""
                    )}
                    onClick={() => setProfessional(prof)}
                  >
                    <CardContent className="flex items-center p-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{prof.fullname}</h3>
                          <p className="text-sm text-muted-foreground">Disponible hoy</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Paso 3: Selección de fecha y hora */}
          {step === 3 && (
            <div className="grid gap-6 py-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:flex-1">
                  <Label className="mb-2 block">Selecciona un día</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={es}
                    disabled={(date) => {
                      // Deshabilitar fechas pasadas
                      return date < new Date(new Date().setHours(0, 0, 0, 0));
                    }}
                    modifiers={{
                      available: (date) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const dayData = availabilityData.find(d => d.date === dateStr);
                        return !!dayData && dayData.available_slots.length > 0;
                      }
                    }}
                    modifiersClassNames={{
                      available: (date) => getDayClass(date)
                    }}
                    className="rounded-md border"
                  />
                </div>

                <div className="md:flex-1">
                  <Label className="mb-2 block">Selecciona una hora</Label>
                  {selectedDate ? (
                    availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.map((slot) => (
                          <Button
                            key={slot.start}
                            variant={selectedSlot === slot.start ? "default" : "outline"}
                            className="justify-start"
                            onClick={() => handleSelectSlot(slot.start)}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {slot.start}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4 border rounded-md bg-gray-50">
                        No hay horas disponibles para este día
                      </div>
                    )
                  ) : (
                    <div className="text-center p-4 border rounded-md bg-gray-50">
                      Selecciona primero una fecha
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Paso 4: Formulario de datos */}
          {step === 4 && (
            <Form {...form}>
              <form className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono*</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="bg-gray-100 p-2 rounded-l-md border-y border-l">
                            <Phone className="h-5 w-5 text-gray-500" />
                          </div>
                          <Input 
                            placeholder="Ej: 612345678" 
                            className="rounded-l-none" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre y apellidos</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <div className="bg-gray-100 p-2 rounded-l-md border-y border-l">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <Input 
                              placeholder="Ej: Juan Pérez" 
                              className="rounded-l-none" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <div className="bg-gray-100 p-2 rounded-l-md border-y border-l">
                              <Mail className="h-5 w-5 text-gray-500" />
                            </div>
                            <Input 
                              placeholder="Ej: email@ejemplo.com" 
                              className="rounded-l-none" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Resumen de la reserva</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Servicio:</span> {service?.name}</p>
                    <p><span className="font-medium">Profesional:</span> {professional?.fullname}</p>
                    <p><span className="font-medium">Fecha:</span> {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</p>
                    <p><span className="font-medium">Hora:</span> {selectedSlot}</p>
                    <p><span className="font-medium">Precio:</span> {service?.price}€</p>
                  </div>
                </div>
              </form>
            </Form>
          )}

          <DialogFooter className="sm:justify-between flex-row-reverse sm:flex-row">
            {step === 1 ? (
              <div className="w-full sm:w-auto">
                <Button onClick={handleContinue} className="w-full">
                  Continuar
                </Button>
              </div>
            ) : (
              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="sm:order-first order-last"
                >
                  Atrás
                </Button>
                <Button onClick={handleContinue}>
                  {step === 4 ? "Confirmar reserva" : "Continuar"}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de verificación por SMS */}
      <AlertDialog 
        open={showVerificationDialog} 
        onOpenChange={setShowVerificationDialog}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Verifica tu número</AlertDialogTitle>
            <AlertDialogDescription>
              Hemos enviado un código de verificación a tu teléfono.
              Introdúcelo a continuación para confirmar tu reserva.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Label htmlFor="verification-code" className="block mb-2">
              Código de verificación
            </Label>
            <InputOTP 
              maxLength={6}
              value={verificationCode}
              onChange={setVerificationCode}
              render={({ slots }) => (
                <div className="flex gap-2 justify-center">
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} />
                  ))}
                </div>
              )}
            />
            <p className="text-sm text-gray-500 mt-2 text-center">
              (Para esta demo, cualquier código de 6 dígitos es válido)
            </p>
          </div>
          
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowVerificationDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleVerificationSubmit}>
              Verificar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmación */}
      <AlertDialog 
        open={showConfirmation} 
        onOpenChange={setShowConfirmation}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>¡Reserva confirmada!</AlertDialogTitle>
            <AlertDialogDescription>
              Tu cita ha sido reservada correctamente. Recibirás un mensaje de confirmación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Servicio:</span> {service?.name}</p>
              <p><span className="font-medium">Profesional:</span> {professional?.fullname}</p>
              <p><span className="font-medium">Fecha:</span> {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</p>
              <p><span className="font-medium">Hora:</span> {selectedSlot}</p>
            </div>
          </div>
          
          <AlertDialogFooter>
            <Button className="w-full" onClick={handleClose}>
              Volver al negocio
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
