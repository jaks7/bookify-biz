import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from 'axios';
import { ENDPOINTS } from '@/config/api';
import { Business } from '@/types/business';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { Save } from 'lucide-react';
import { useAuth } from "@/stores/authContext";
import { toast } from "@/components/ui/use-toast";

// Business types list - actualizar para coincidir con las opciones del backend
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

// Days of the week
const daysOfWeek = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
];

// Schema para todo el formulario (mantener el original)
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
  working_days: z.array(z.number()).default([1, 2, 3, 4, 5]),
  working_hours: z.array(z.array(z.coerce.number())).default([[9,0], [13,0], [14,0], [18,0]]),
  public_list_business: z.boolean().default(false),
  public_list_services: z.boolean().default(false),
});

type BusinessConfigFormValues = z.infer<typeof businessConfigSchema>;

interface BusinessConfig {
  uid: string;
  business: string;
  days_advance_booking: number;
  time_advance_cancel_reschedule: number;
  new_clients_can_book: boolean;
  new_clients_ask_sms_confirmation: boolean;
  working_days: number[];
  working_hours: number[][];
  public_list_business: boolean;
  public_list_services: boolean;
}

interface Business {
  business_id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  cif: string;
  type_of_business: string;
  configuration_is_completed: boolean;
}

// Schema para la información del negocio
const businessInfoSchema = z.object({
  name: z.string().min(1, { message: "El nombre es obligatorio" }),
  type_of_business: z.string().min(1, { message: "El tipo de negocio es obligatorio" }),
  postal_code: z.string().min(1, { message: "El código postal es obligatorio" }),
  city: z.string().optional(),
  cif: z.string().optional(),
  address: z.string().optional(),
});

type BusinessInfoFormValues = z.infer<typeof businessInfoSchema>;

export default function BusinessConfig() {
  const { currentBusiness } = useAuth();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  
  const form = useForm<z.infer<typeof businessConfigSchema>>({
    resolver: zodResolver(businessConfigSchema),
    defaultValues: {
      // Valores por defecto para ambas pestañas
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
      working_days: [1, 2, 3, 4, 5],
      working_hours: [[9,0], [13,0], [14,0], [18,0]],
      public_list_business: false,
      public_list_services: false,
    }
  });

  useEffect(() => {
    if (currentBusiness) {
      loadBusinessAndConfig();
    }
  }, [currentBusiness]);

  const loadBusinessAndConfig = async () => {
    try {
      setLoading(true);
      
      // Cargar información del negocio
      const businessResponse = await axios.get(
        ENDPOINTS.BUSINESS_DETAIL(currentBusiness?.business_id)
      );
      
      // Cargar configuración
      const configResponse = await axios.get(
        ENDPOINTS.BUSINESS_CONFIG_DETAIL(currentBusiness?.business_id)
      );
      
      setConfig(configResponse.data);
      
      // Actualizar el formulario con ambos datos
      form.reset({
        // Datos del negocio
        name: businessResponse.data.name,
        type_of_business: businessResponse.data.type_of_business,
        postal_code: businessResponse.data.postal_code,
        city: businessResponse.data.city,
        cif: businessResponse.data.cif,
        address: businessResponse.data.address,
        
        // Datos de configuración
        days_advance_booking: configResponse.data.days_advance_booking,
        time_advance_cancel_reschedule: configResponse.data.time_advance_cancel_reschedule,
        new_clients_can_book: configResponse.data.new_clients_can_book,
        new_clients_ask_sms_confirmation: configResponse.data.new_clients_ask_sms_confirmation,
        working_days: configResponse.data.working_days,
        working_hours: configResponse.data.working_hours.map(h => [h[0], h[1]]),
        public_list_business: configResponse.data.public_list_business,
        public_list_services: configResponse.data.public_list_services,
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

  const onSubmit = async (data: z.infer<typeof businessConfigSchema>) => {
    if (!currentBusiness) return;
    
    try {
      // Actualizar información del negocio
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
      
      // Actualizar configuración
      const configData = {
        days_advance_booking: data.days_advance_booking,
        time_advance_cancel_reschedule: data.time_advance_cancel_reschedule,
        new_clients_can_book: data.new_clients_can_book,
        new_clients_ask_sms_confirmation: data.new_clients_ask_sms_confirmation,
        working_days: data.working_days,
        working_hours: data.working_hours,
        public_list_business: data.public_list_business,
        public_list_services: data.public_list_services,
      };

      if (config) {
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
      
      await loadBusinessAndConfig();
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar los cambios"
      });
    }
  };

  return (
    <AppSidebarWrapper>
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Configuración del Negocio</h1>
          <p className="text-muted-foreground mt-1">
            Configura la información y ajustes de tu negocio
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <p>Cargando...</p>
          </div>
        ) : (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                    <TabsTrigger value="basic">Información Básica</TabsTrigger>
                    <TabsTrigger value="advanced">Configuración Avanzada</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Información del Negocio</CardTitle>
                        <CardDescription>
                          Datos generales de tu negocio
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre del negocio *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="type_of_business"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de negocio *</FormLabel>
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
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="postal_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código Postal *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ciudad</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cif"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CIF</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dirección</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Escribe la dirección completa"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Configuración de Reservas</CardTitle>
                        <CardDescription>
                          Ajustes para reservas y horarios de trabajo
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="days_advance_booking"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Días de antelación para reservas</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={1} 
                                  max={90} 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Máximo 90 días. Predeterminado: 30 días
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="time_advance_cancel_reschedule"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Horas de antelación para cancelar/reprogramar</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={1} 
                                  max={72} 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Mínimo 1 hora. Predeterminado: 12 horas
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Separator className="my-4" />
                        
                        <FormField
                          control={form.control}
                          name="working_days"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Días laborables</FormLabel>
                              <FormControl>
                                <ToggleGroup 
                                  type="multiple" 
                                  className="justify-start"
                                  value={field.value.map(String)}
                                  onValueChange={(value) => {
                                    field.onChange(value.map(v => parseInt(v)));
                                  }}
                                >
                                  {daysOfWeek.map((day) => (
                                    <ToggleGroupItem 
                                      key={day.value} 
                                      value={String(day.value)}
                                      aria-label={day.label}
                                    >
                                      {day.label}
                                    </ToggleGroupItem>
                                  ))}
                                </ToggleGroup>
                              </FormControl>
                              <FormDescription>
                                Selecciona los días en que tu negocio está abierto
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Configuración de Clientes</CardTitle>
                        <CardDescription>
                          Ajustes relacionados con los clientes y visibilidad
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="new_clients_can_book"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Nuevos clientes pueden reservar
                                </FormLabel>
                                <FormDescription>
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
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Confirmación SMS para nuevos clientes
                                </FormLabel>
                                <FormDescription>
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
                        
                        <Separator className="my-4" />
                        
                        <FormField
                          control={form.control}
                          name="public_list_business"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Listado público del negocio
                                </FormLabel>
                                <FormDescription>
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
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Listado público de servicios
                                </FormLabel>
                                <FormDescription>
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
