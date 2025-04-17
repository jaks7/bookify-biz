
import React, { useState, useEffect } from "react";
import { 
  addDays, 
  format, 
  parse, 
  parseISO, 
  addMinutes,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Scissors,
  User,
  Phone,
  Mail,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { 
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Service, DailyAvailability, AvailableSlot } from "@/types/service";
import { BusinessDetail } from "@/types/booking";
import axios from "axios";
import { ENDPOINTS } from "@/config/api";

// Interfaces
interface ClientReservationProps {
  inDialog?: boolean;
  onComplete?: () => void;
  businessData?: BusinessDetail;
  showConfirmationAsStep?: boolean;
}

const phoneRegex = /^[0-9]{9,}$/;

const reservationFormSchema = z.object({
  phone: z.string().regex(phoneRegex, { message: "El teléfono debe tener al menos 9 dígitos" }),
  fullname: z.string().optional(),
  email: z.string().email({ message: "Por favor introduce un email válido" }).optional(),
});

// Generar datos de disponibilidad para un mes
const generateMonthAvailability = () => {
  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 1 });
  const endDate = addDays(endOfWeek(addDays(today, 30), { weekStartsOn: 1 }), 1);
  
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

const ClientReservation = ({ 
  inDialog = false, 
  onComplete, 
  businessData,
  showConfirmationAsStep = true
}: ClientReservationProps) => {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [availabilityData, setAvailabilityData] = useState<DailyAvailability[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof reservationFormSchema>>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      phone: "",
      fullname: "",
      email: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    
    // Mostrar diálogo de verificación
    setShowVerificationDialog(true);
    
    // Simular envío de SMS (en una app real, esto sería una llamada a una API)
    console.log("Enviando SMS a:", data.phone);
    
    setIsSubmitting(false);
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

  // Determinar los servicios a mostrar
  const services = businessData?.services || [
    { id: 1, service_id: 1, name: "Consulta inicial", duration: 30, price: 40 },
    { id: 2, service_id: 2, name: "Masaje terapéutico", duration: 60, price: 55 },
    { id: 3, service_id: 3, name: "Fisioterapia deportiva", duration: 45, price: 50 },
    { id: 4, service_id: 4, name: "Rehabilitación", duration: 60, price: 60 }
  ];

  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleContinue = () => {
    if (step === 1 && !service) {
      toast.error("Por favor, selecciona un servicio");
      return;
    }

    if (step === 2 && (!selectedDate || !selectedSlot)) {
      toast.error("Por favor, selecciona fecha y hora");
      return;
    }

    if (step === 3) {
      // En el último paso, al dar a continuar iniciamos el proceso de validación del formulario
      handleSubmit();
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
      
      if (showConfirmationAsStep) {
        // Mostrar confirmación como un paso adicional
        setShowConfirmation(true);
      } else {
        // Mostrar confirmación como diálogo final y completar
        // Simular envío a backend
        console.log("Reserva completada:", {
          service,
          date: selectedDate,
          time: selectedSlot,
          client: form.getValues()
        });
        
        if (onComplete) {
          onComplete();
        }
      }
    } else {
      toast.error("Por favor, introduce el código de 6 dígitos");
    }
  };

  const handleConfirmationComplete = () => {
    // Simular envío a backend
    console.log("Reserva completada:", {
      service,
      date: selectedDate,
      time: selectedSlot,
      client: form.getValues()
    });
    
    if (onComplete) {
      onComplete();
    }
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
    <div className={cn("bg-white", inDialog ? "" : "container mx-auto py-8")}>
      {!inDialog && (
        <h1 className="text-2xl font-bold mb-6">Reservar cita</h1>
      )}
      
      <Tabs value={`${step}`} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="1" disabled>
            1. Servicio
          </TabsTrigger>
          <TabsTrigger value="2" disabled>
            2. Fecha y hora
          </TabsTrigger>
          <TabsTrigger value="3" disabled>
            3. Datos personales
          </TabsTrigger>
        </TabsList>
        
        {/* Paso 1: Selección de servicio */}
        <TabsContent value="1" className={cn(step === 1 ? "block" : "hidden")}>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((svc) => (
                <Card 
                  key={svc.id || svc.service_id} 
                  className={cn(
                    "cursor-pointer hover:shadow-md transition-all",
                    service?.id === svc.id || service?.service_id === svc.service_id ? "border-2 border-primary" : ""
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
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleContinue}>
              Continuar
            </Button>
          </div>
        </TabsContent>
        
        {/* Paso 2: Selección de fecha y hora */}
        <TabsContent value="2" className={cn(step === 2 ? "block" : "hidden")}>
          <div className="space-y-6 py-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
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
                    available: getDayClass
                  }}
                  className="rounded-md border"
                />
              </div>

              <div className="md:w-1/2">
                <Label className="mb-2 block">Selecciona una hora</Label>
                {selectedDate ? (
                  availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
          
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Atrás
            </Button>
            <Button onClick={handleContinue}>
              Continuar
            </Button>
          </div>
        </TabsContent>
        
        {/* Paso 3: Formulario de datos */}
        <TabsContent value="3" className={cn(step === 3 ? "block" : "hidden")}>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
                  <p><span className="font-medium">Fecha:</span> {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</p>
                  <p><span className="font-medium">Hora:</span> {selectedSlot}</p>
                  <p><span className="font-medium">Precio:</span> {service?.price}€</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Atrás
                </Button>
                <Button type="button" onClick={handleContinue} disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Confirmar reserva"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
      
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
                    <InputOTPSlot key={index} {...slot} index={index} />
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

      {/* Modal de confirmación (solo se muestra en modo paso extra) */}
      {showConfirmationAsStep && (
        <Dialog 
          open={showConfirmation} 
          onOpenChange={setShowConfirmation}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>¡Reserva confirmada!</DialogTitle>
            </DialogHeader>
            
            <div className="my-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Servicio:</span> {service?.name}</p>
                <p><span className="font-medium">Fecha:</span> {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</p>
                <p><span className="font-medium">Hora:</span> {selectedSlot}</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button className="w-full" onClick={handleConfirmationComplete}>
                Aceptar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClientReservation;
