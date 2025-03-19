
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
import { Separator } from "@/components/ui/separator";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { ArrowLeft, Save } from 'lucide-react';

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
  working_days: z.array(z.number()).default([1, 2, 3, 4, 5]),
  public_list_business: z.boolean().default(false),
  public_list_services: z.boolean().default(false),
});

type BusinessConfigFormValues = z.infer<typeof businessConfigSchema>;

export default function DemoBusinessConfig() {
  const { businessId } = useParams<{ businessId: string }>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
    working_days: [1, 2, 3, 4, 5],
    public_list_business: false,
    public_list_services: false,
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
      working_days: mockBusiness.working_days,
      public_list_business: mockBusiness.public_list_business,
      public_list_services: mockBusiness.public_list_services,
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
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Demo - Configuración del Negocio</h1>
            <p className="text-muted-foreground mt-1">
              Configura la información y ajustes de tu negocio (modo demo)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <p>Cargando configuración...</p>
          </div>
        ) : (
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
        )}
      </div>
    </AppSidebarWrapper>
  );
}
