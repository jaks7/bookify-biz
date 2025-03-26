
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from 'axios';
import { ENDPOINTS } from '@/config/api';
import { AppSidebarWrapper } from '@/components/layout/AppSidebar';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Plus, Trash2, Clock } from 'lucide-react';
import { useAuth } from "@/stores/authContext";
import { toast } from "@/components/ui/use-toast";
import { BusinessHours, TimeRange } from '@/types/availability';
import { Business, BusinessConfig as BusinessConfigType } from '@/types/business';

// Business types list
const businessTypes = [
  { value: 'barberia', label: 'Barbería' },
  { value: 'peluqueria', label: 'Peluquería' },
  { value: 'psicologia', label: 'Psicología' },
  { value: 'nutricion', label: 'Nutrición' },
  { value: 'masajes', label: 'Masajes' },
  { value: 'fisioterapia', label: 'Fisioterapia' },
  { value: 'estetica', label: 'Estética' },
  { value: 'dermatologia', label: 'Dermatología' },
  { value: 'medicina', label: 'Medicina' },
  { value: 'odontologia', label: 'Odontología' },
  { value: 'otros', label: 'Otros' }
];

// Días de la semana
const daysOfWeek = [
  { value: "1", label: "Lun" },
  { value: "2", label: "Mar" },
  { value: "3", label: "Mié" },
  { value: "4", label: "Jue" },
  { value: "5", label: "Vie" },
  { value: "6", label: "Sáb" },
  { value: "7", label: "Dom" },
];

// Opciones de tiempo para los selectores
const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

// Schema para todo el formulario
const businessConfigSchema = z.object({
  // Pestaña de información básica
  name: z.string().min(1, { message: "El nombre es obligatorio" }),
  type_of_business: z.string().min(1, { message: "El tipo de negocio es obligatorio" }),
  postal_code: z.string().min(1, { message: "El código postal es obligatorio" }),
  city: z.string().optional(),
  cif: z.string().optional(),
  address: z.string().optional(),
  
  // Pestaña de configuración avanzada
  days_advance_booking: z.coerce.number().min(1).max(90).default(30),
  time_advance_cancel_reschedule: z.coerce.number().min(1).max(72).default(12),
  new_clients_can_book: z.boolean().default(true),
  new_clients_ask_sms_confirmation: z.boolean().default(true),
  public_list_business: z.boolean().default(false),
  public_list_services: z.boolean().default(false),
  allow_choose_professional: z.boolean().default(false),
  professional_schedule_enabled: z.boolean().default(false),
});

type BusinessConfigFormValues = z.infer<typeof businessConfigSchema>;

export default function BusinessConfig() {
  const { currentBusiness } = useAuth();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessConfig, setBusinessConfig] = useState<BusinessConfigType | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Plantillas de horarios predefinidas
  const [selectedTemplate, setSelectedTemplate] = useState("weekdays");
  
  // State for business hours editor
  const [businessHours, setBusinessHours] = useState<BusinessHours>({});
  
  const form = useForm<BusinessConfigFormValues>({
    resolver: zodResolver(businessConfigSchema),
    defaultValues: {
      name: "",
      type_of_business: "",
      postal_code: "",
      city: "",
      cif: "",
      address: "",
      days_advance_booking: 30,
      time_advance_cancel_reschedule: 12,
      new_clients_can_book: true,
      new_clients_ask_sms_confirmation: true,
      public_list_business: false,
      public_list_services: false,
      allow_choose_professional: false,
      professional_schedule_enabled: false,
    }
  });

  // Get days that have any hours set
  const activeDays = Object.keys(businessHours).filter(
    day => businessHours[day]?.length > 0
  );

  useEffect(() => {
    if (currentBusiness) {
      loadBusinessAndConfig();
    }
  }, [currentBusiness]);

  const loadBusinessAndConfig = async () => {
    if (!currentBusiness) return;
    
    try {
      setLoading(true);
      
      // Load business information
      const businessResponse = await axios.get<Business>(
        ENDPOINTS.BUSINESS_DETAIL(currentBusiness.business_id)
      );
      setBusiness(businessResponse.data);
      
      // Load configuration
      const configResponse = await axios.get<BusinessConfigType>(
        ENDPOINTS.BUSINESS_CONFIG_DETAIL(currentBusiness.business_id)
      );
      
      setBusinessConfig(configResponse.data);
      
      // Set business hours from config
      if (configResponse.data.business_hours) {
        setBusinessHours(configResponse.data.business_hours);
      }
      
      // Update form with both data
      form.reset({
        // Business data
        name: businessResponse.data.name,
        type_of_business: businessResponse.data.type_of_business,
        postal_code: businessResponse.data.postal_code,
        city: businessResponse.data.city,
        cif: businessResponse.data.cif,
        address: businessResponse.data.address,
        
        // Config data
        days_advance_booking: configResponse.data?.days_advance_booking || 30,
        time_advance_cancel_reschedule: configResponse.data?.time_advance_cancel_reschedule || 12,
        new_clients_can_book: configResponse.data?.new_clients_can_book || true,
        new_clients_ask_sms_confirmation: configResponse.data?.new_clients_ask_sms_confirmation || true,
        public_list_business: configResponse.data?.public_list_business || false,
        public_list_services: configResponse.data?.public_list_services || false,
        allow_choose_professional: configResponse.data?.allow_choose_professional || false,
        professional_schedule_enabled: configResponse.data?.professional_schedule_enabled || false,
      });
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar la información"
      });
    } finally {
      setLoading(false);
    }
  };

  // Funciones para manejar los horarios comerciales
  const handleDayToggle = (dayId: string) => {
    const newHours = { ...businessHours };
    
    if (activeDays.includes(dayId)) {
      // Eliminar el día si ya está activo
      newHours[dayId] = [];
    } else {
      // Añadir horario por defecto si se activa un día
      newHours[dayId] = [{ start: "09:00", end: "18:00" }];
    }
    
    setBusinessHours(newHours);
  };

  const handleAddTimeRange = (day: string) => {
    const newHours = { ...businessHours };
    if (!newHours[day]) {
      newHours[day] = [];
    }
    newHours[day].push({ start: "09:00", end: "18:00" });
    setBusinessHours(newHours);
  };

  const handleRemoveTimeRange = (day: string, index: number) => {
    const newHours = { ...businessHours };
    if (newHours[day] && newHours[day].length > 1) {
      newHours[day].splice(index, 1);
      setBusinessHours(newHours);
    }
  };

  const handleTimeChange = (day: string, index: number, field: "start" | "end", value: string) => {
    const newHours = { ...businessHours };
    if (!newHours[day]) {
      newHours[day] = [];
    }
    newHours[day][index][field] = value;
    setBusinessHours(newHours);
  };
  
  const applyTemplate = (template: string) => {
    let newHours: BusinessHours = {};
    
    if (template === "weekdays") {
      // Lunes a viernes, 9-14 y 17-20
      for (let i = 1; i <= 5; i++) {
        newHours[i.toString()] = [
          { start: "09:00", end: "14:00" },
          { start: "17:00", end: "20:00" }
        ];
      }
      // Sábado, 9-14
      newHours["6"] = [{ start: "09:00", end: "14:00" }];
      // Domingo cerrado
      newHours["7"] = [];
    } else if (template === "continuous") {
      // Lunes a viernes, 9-18
      for (let i = 1; i <= 5; i++) {
        newHours[i.toString()] = [{ start: "09:00", end: "18:00" }];
      }
      // Fin de semana cerrado
      newHours["6"] = [];
      newHours["7"] = [];
    } else if (template === "weekend") {
      // Todos los días incluido fin de semana
      for (let i = 1; i <= 7; i++) {
        newHours[i.toString()] = [{ start: "10:00", end: "20:00" }];
      }
    }
    
    setBusinessHours(newHours);
  };

  const onSubmit = async (data: BusinessConfigFormValues) => {
    if (!currentBusiness) return;
    
    try {
      setLoading(true);
      
      // Update business information
      const businessData = {
        name: data.name,
        type_of_business: data.type_of_business,
        postal_code: data.postal_code,
        city: data.city,
        cif: data.cif,
        address: data.address,
      };
      
      await axios.put(
        ENDPOINTS.BUSINESS_UPDATE(currentBusiness.business_id),
        businessData
      );
      
      // Update configuration with integrated hours
      const configData = {
        days_advance_booking: data.days_advance_booking,
        time_advance_cancel_reschedule: data.time_advance_cancel_reschedule,
        new_clients_can_book: data.new_clients_can_book,
        new_clients_ask_sms_confirmation: data.new_clients_ask_sms_confirmation,
        public_list_business: data.public_list_business,
        public_list_services: data.public_list_services,
        allow_choose_professional: data.allow_choose_professional,
        professional_schedule_enabled: data.professional_schedule_enabled,
        business_hours: businessHours
      };
      
      // Check if config exists to determine POST or PUT
      if (businessConfig) {
        await axios.put(
          ENDPOINTS.BUSINESS_CONFIG_UPDATE(currentBusiness.business_id),
          configData
        );
      } else {
        await axios.post(
          ENDPOINTS.BUSINESS_CONFIG_CREATE(currentBusiness.business_id),
          configData
        );
      }
      
      toast({
        title: "Éxito",
        description: "Cambios guardados correctamente"
      });
      
      // Reload data to get the latest
      loadBusinessAndConfig();
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar los cambios"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppSidebarWrapper>
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Configuración del Negocio</h1>
            <p className="text-muted-foreground mt-1">
              Configura la información y ajustes de tu negocio
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center my-8">
            <p>Cargando...</p>
          </div>
        ) : (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                    <TabsTrigger value="basic">Información Básica</TabsTrigger>
                    <TabsTrigger value="advanced">Configuración Avanzada</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-6 mt-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl">Información del Negocio</CardTitle>
                        <CardDescription>
                          Datos generales de tu negocio
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex flex-col space-y-1.5">
                                  <FormLabel>Nombre *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Nombre del negocio" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="type_of_business"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex flex-col space-y-1.5">
                                  <FormLabel>Tipo de negocio *</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecciona tipo" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {businessTypes.map(type => (
                                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="postal_code"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex flex-col space-y-1.5">
                                  <FormLabel>C.P. *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Código postal" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex flex-col space-y-1.5">
                                  <FormLabel>Ciudad</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Ciudad" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cif"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex flex-col space-y-1.5">
                                  <FormLabel>CIF</FormLabel>
                                  <FormControl>
                                    <Input placeholder="CIF" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <div className="flex flex-col space-y-1.5">
                                  <FormLabel>Dirección</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Dirección completa"
                                      className="resize-none h-16"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Business Hours Editor - Integrado directamente */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Clock className="h-5 w-5" />
                          Horario Comercial
                        </CardTitle>
                        <CardDescription>
                          Define los días y horarios de apertura
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Plantillas de horarios */}
                        <div className="mb-4">
                          <FormLabel className="text-sm font-medium mb-2 block">Plantillas rápidas</FormLabel>
                          <div className="flex flex-wrap gap-2">
                            <Select 
                              value={selectedTemplate} 
                              onValueChange={setSelectedTemplate}
                            >
                              <SelectTrigger className="w-[250px]">
                                <SelectValue placeholder="Selecciona una plantilla" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="weekdays">L-V horario partido + Sábado mañana</SelectItem>
                                <SelectItem value="continuous">L-V horario continuo</SelectItem>
                                <SelectItem value="weekend">Toda la semana (incluye fin de semana)</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="outline" 
                              onClick={() => applyTemplate(selectedTemplate)}
                            >
                              Aplicar
                            </Button>
                          </div>
                        </div>
                        
                        {/* Selector de días */}
                        <div className="mb-4">
                          <FormLabel className="text-sm font-medium mb-2 block">Días laborables</FormLabel>
                          <div className="flex flex-wrap gap-2">
                            {daysOfWeek.map(day => (
                              <button
                                key={day.value}
                                type="button"
                                className={`
                                  px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                                  ${activeDays.includes(day.value) 
                                    ? 'bg-primary text-primary-foreground shadow-sm ring-1 ring-inset ring-primary' 
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'}
                                `}
                                onClick={() => handleDayToggle(day.value)}
                              >
                                {day.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Configuración de horarios por día */}
                        <div className="space-y-4">
                          {daysOfWeek.filter(day => 
                            activeDays.includes(day.value)
                          ).map((day) => (
                            <div key={day.value} className="border rounded-md p-3">
                              <div className="font-medium mb-2">{day.label}</div>
                              {businessHours[day.value]?.map((timeRange, index) => (
                                <div key={index} className="flex items-center gap-2 mb-2">
                                  <div className="grid grid-cols-2 gap-3 flex-1">
                                    <div>
                                      <FormLabel className="text-xs text-gray-500">Hora inicio</FormLabel>
                                      <Select
                                        value={timeRange.start}
                                        onValueChange={(value) => handleTimeChange(day.value, index, "start", value)}
                                      >
                                        <SelectTrigger className="h-9">
                                          <SelectValue placeholder="Inicio" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {timeOptions.map(time => (
                                            <SelectItem key={`start-${time}`} value={time}>{time}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <FormLabel className="text-xs text-gray-500">Hora fin</FormLabel>
                                      <Select
                                        value={timeRange.end}
                                        onValueChange={(value) => handleTimeChange(day.value, index, "end", value)}
                                      >
                                        <SelectTrigger className="h-9">
                                          <SelectValue placeholder="Fin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {timeOptions.map(time => (
                                            <SelectItem key={`end-${time}`} value={time}>{time}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  {businessHours[day.value].length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveTimeRange(day.value, index)}
                                      className="h-9 w-9 text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-1"
                                onClick={() => handleAddTimeRange(day.value)}
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Añadir franja horaria
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-6 mt-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl">Configuración de Reservas</CardTitle>
                        <CardDescription>
                          Ajustes para reservas y horarios de trabajo
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="days_advance_booking"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex flex-col space-y-1.5">
                                  <FormLabel>Días de antelación para reservas</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min={1} 
                                      max={90} 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    Máximo 90 días (predeterminado: 30)
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="time_advance_cancel_reschedule"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex flex-col space-y-1.5">
                                  <FormLabel>Horas para cancelar/reprogramar</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min={1} 
                                      max={72} 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    Mínimo 1 hora (predeterminado: 12)
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl">Configuración de Clientes</CardTitle>
                        <CardDescription>
                          Ajustes relacionados con los clientes y visibilidad
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="new_clients_can_book"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Nuevos clientes pueden reservar
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    Permite que clientes nuevos reserven servicios
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="new_clients_ask_sms_confirmation"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Confirmación SMS para nuevos
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    Solicitar confirmación SMS a nuevos clientes
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        
                          <FormField
                            control={form.control}
                            name="public_list_business"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Listado público del negocio
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    Mostrar el negocio en directorios públicos
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="public_list_services"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Listado público de servicios
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    Mostrar los servicios en directorios públicos
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        
                          <FormField
                            control={form.control}
                            name="allow_choose_professional"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Permitir elegir profesional
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    Los clientes pueden elegir el profesional
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="professional_schedule_enabled"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Horarios por profesional
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    Cada profesional puede tener su propio horario
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end">
                  <Button type="submit" className="w-full md:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Configuración
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>
    </AppSidebarWrapper>
  );
}
