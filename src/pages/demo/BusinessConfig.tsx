
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { ArrowLeft, Save } from 'lucide-react';
import BusinessHoursEditor from '@/components/calendar/BusinessHoursEditor';
import { BusinessHours } from '@/types/availability';

// Business types list
const businessTypes = [
  "Peluquería",
  "Barbería",
  "Centro de estética",
  "Spa",
  "Centro de masajes",
  "Clínica dental",
  "Centro médico",
  "Gimnasio",
  "Centro deportivo",
  "Otros"
];

// Form validation schema
const businessConfigSchema = z.object({
  name: z.string().min(1, { message: "El nombre es obligatorio" }),
  type_of_business: z.string().min(1, { message: "El tipo de negocio es obligatorio" }),
  postal_code: z.string().min(1, { message: "El código postal es obligatorio" }),
  city: z.string().optional(),
  cif: z.string().optional(),
  address: z.string().optional(),
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

export default function DemoBusinessConfig() {
  const { businessId } = useParams<{ businessId: string }>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for business hours
  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    "1": [
      { start: "09:00", end: "14:00" },
      { start: "17:00", end: "20:00" }
    ],
    "2": [
      { start: "09:00", end: "14:00" },
      { start: "17:00", end: "20:00" }
    ],
    "3": [
      { start: "09:00", end: "14:00" },
      { start: "17:00", end: "20:00" }
    ],
    "4": [
      { start: "09:00", end: "14:00" },
      { start: "17:00", end: "20:00" }
    ],
    "5": [
      { start: "09:00", end: "14:00" },
      { start: "17:00", end: "20:00" }
    ],
    "6": [
      { start: "09:00", end: "14:00" }
    ]
  });
  
  // Mock business data for demo
  const mockBusiness = {
    business_id: businessId || "demo-123",
    name: "Peluquería Demo",
    type_of_business: "Peluquería",
    postal_code: "28001",
    city: "Madrid",
    cif: "B12345678",
    address: "Calle Gran Vía 1, Madrid",
    days_advance_booking: 30,
    time_advance_cancel_reschedule: 12,
    new_clients_can_book: true,
    new_clients_ask_sms_confirmation: true,
    public_list_business: false,
    public_list_services: false,
    allow_choose_professional: false,
    professional_schedule_enabled: false,
  };
  
  // Initialize the form with demo values
  const form = useForm<BusinessConfigFormValues>({
    resolver: zodResolver(businessConfigSchema),
    defaultValues: {
      name: mockBusiness.name,
      type_of_business: mockBusiness.type_of_business,
      postal_code: mockBusiness.postal_code,
      city: mockBusiness.city,
      cif: mockBusiness.cif,
      address: mockBusiness.address,
      days_advance_booking: mockBusiness.days_advance_booking,
      time_advance_cancel_reschedule: mockBusiness.time_advance_cancel_reschedule,
      new_clients_can_book: mockBusiness.new_clients_can_book,
      new_clients_ask_sms_confirmation: mockBusiness.new_clients_ask_sms_confirmation,
      public_list_business: mockBusiness.public_list_business,
      public_list_services: mockBusiness.public_list_services,
      allow_choose_professional: mockBusiness.allow_choose_professional,
      professional_schedule_enabled: mockBusiness.professional_schedule_enabled,
    },
  });

  // Submit handler for demo
  const onSubmit = async (data: BusinessConfigFormValues) => {
    // Simulate API call delay
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Demo - Configuración guardada",
        description: "Los cambios se han guardado correctamente (modo demo)",
      });
    }, 1000);
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
            <h1 className="text-2xl font-bold">Demo - Configuración del Negocio</h1>
            <p className="text-muted-foreground mt-1">
              Configura la información y ajustes de tu negocio (modo demo)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center my-8">
            <p>Cargando configuración...</p>
          </div>
        ) : (
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el tipo de negocio" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {businessTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
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
                    businessHours={businessHours}
                    onChange={setBusinessHours}
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
        )}
      </div>
    </AppSidebarWrapper>
  );
}
