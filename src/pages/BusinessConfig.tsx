
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { Save } from 'lucide-react';
import { useAuth } from "@/stores/authContext";
import { toast } from "@/components/ui/use-toast";
import BusinessHoursEditor from '@/components/calendar/BusinessHoursEditor';
import { BusinessHours } from '@/types/availability';
import { Business, BusinessConfig as BusinessConfigType } from '@/types/business';
import { useAvailabilityStore } from '@/stores/availabilityStore';

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
  const { businessConfig, businessHours, fetchBusinessConfig, updateBusinessConfig } = useAvailabilityStore();
  
  // State for business hours editor
  const [localBusinessHours, setLocalBusinessHours] = useState<BusinessHours>({});
  
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
      await fetchBusinessConfig(currentBusiness.business_id);
      
      // Set local business hours state
      setLocalBusinessHours(businessHours || {});
      
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
        days_advance_booking: businessConfig?.days_advance_booking || 30,
        time_advance_cancel_reschedule: businessConfig?.time_advance_cancel_reschedule || 12,
        new_clients_can_book: businessConfig?.new_clients_can_book || true,
        new_clients_ask_sms_confirmation: businessConfig?.new_clients_ask_sms_confirmation || true,
        public_list_business: businessConfig?.public_list_business || false,
        public_list_services: businessConfig?.public_list_services || false,
        allow_choose_professional: businessConfig?.allow_choose_professional || false,
        professional_schedule_enabled: businessConfig?.professional_schedule_enabled || false,
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
      };
      
      const success = await updateBusinessConfig(
        currentBusiness.business_id, 
        configData as Partial<BusinessConfigType>,
        localBusinessHours
      );
      
      if (success) {
        toast({
          title: "Éxito",
          description: "Cambios guardados correctamente"
        });
      }
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Configuración del Negocio</h1>
          <p className="text-muted-foreground mt-1">
            Configura la información y ajustes de tu negocio
          </p>
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
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-col space-y-1">
                                <FormLabel className="text-sm font-medium">Nombre del negocio *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
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
                              <div className="flex flex-col space-y-1">
                                <FormLabel className="text-sm font-medium">Tipo de negocio *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecciona el tipo de negocio" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {businessTypes.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                      </SelectItem>
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
                              <div className="flex flex-col space-y-1">
                                <FormLabel className="text-sm font-medium">Código Postal *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
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
                              <div className="flex flex-col space-y-1">
                                <FormLabel className="text-sm font-medium">Ciudad</FormLabel>
                                <FormControl>
                                  <Input {...field} />
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
                              <div className="flex flex-col space-y-1">
                                <FormLabel className="text-sm font-medium">CIF</FormLabel>
                                <FormControl>
                                  <Input {...field} />
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
                              <div className="flex flex-col space-y-1">
                                <FormLabel className="text-sm font-medium">Dirección</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Escribe la dirección completa"
                                    className="resize-none h-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    
                    {/* Business Hours Editor */}
                    <BusinessHoursEditor 
                      businessHours={localBusinessHours}
                      onChange={setLocalBusinessHours}
                    />
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-6 mt-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl">Configuración de Reservas</CardTitle>
                        <CardDescription>
                          Ajustes para reservas y horarios de trabajo
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="days_advance_booking"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-col space-y-1">
                                <FormLabel className="text-sm font-medium">Días de antelación para reservas</FormLabel>
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
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="time_advance_cancel_reschedule"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-col space-y-1">
                                <FormLabel className="text-sm font-medium">Horas para cancelar/reprogramar</FormLabel>
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
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl">Configuración de Clientes</CardTitle>
                        <CardDescription>
                          Ajustes relacionados con los clientes y visibilidad
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="new_clients_can_book"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-sm">
                                    Nuevos clientes pueden reservar
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    Permite que clientes nuevos reserven servicios
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="new_clients_ask_sms_confirmation"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-sm">
                                    Confirmación SMS para nuevos clientes
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    Solicitar confirmación por SMS para nuevos clientes
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="public_list_business"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-sm">
                                    Listado público del negocio
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    Mostrar el negocio en directorios públicos
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="public_list_services"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-sm">
                                    Listado público de servicios
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    Mostrar los servicios en directorios públicos
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="allow_choose_professional"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-sm">
                                    Permitir elegir profesional
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    Los clientes pueden elegir el profesional al reservar
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="professional_schedule_enabled"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-sm">
                                    Habilitar horarios por profesional
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    Cada profesional puede tener su propio horario
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
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
