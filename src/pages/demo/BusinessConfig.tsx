
import React, { useState } from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Tipos para los horarios comerciales
interface TimeRange {
  start: string;
  end: string;
}

interface BusinessHours {
  [key: string]: TimeRange[];
}

// Tipos para la configuración del negocio
interface BusinessConfig {
  uid?: string;
  business?: string;
  days_advance_booking: number;
  time_advance_cancel_reschedule: number;
  new_clients_can_book: boolean;
  new_clients_ask_sms_confirmation: boolean;
  business_hours: BusinessHours;
  public_list_business: boolean;
  public_list_services: boolean;
  allow_choose_professional: boolean;
  professional_schedule_enabled: boolean;
}

// Datos mock para el negocio
const mockBusiness = {
  business_id: "9cb26cd955d2",
  name: "Clínica Dental Sonrisa",
  address: "Calle Doctor Fleming 12",
  city: "Madrid",
  postal_code: "28036",
  cif: "B12345678",
  type_of_business: "clinica_dental",
  main_contact_user: "ca921839-be7b-4e09-bd36-8c4ddfafa631",
  configuration_is_completed: true
};

// Datos mock para la configuración del negocio
const mockBusinessConfig: BusinessConfig = {
  uid: "a25b3bb3-9b14-43c1-8fab-18a6d2bc3099",
  business: "9cb26cd955d2",
  days_advance_booking: 30,
  time_advance_cancel_reschedule: 12,
  new_clients_can_book: true,
  new_clients_ask_sms_confirmation: true,
  business_hours: {
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
    ],
    "7": []
  },
  public_list_business: false,
  public_list_services: false,
  allow_choose_professional: false,
  professional_schedule_enabled: false
};

// Días de la semana para el selector de horarios
const weekDays = [
  { id: "1", name: "Lunes" },
  { id: "2", name: "Martes" },
  { id: "3", name: "Miércoles" },
  { id: "4", name: "Jueves" },
  { id: "5", name: "Viernes" },
  { id: "6", name: "Sábado" },
  { id: "7", name: "Domingo" }
];

// Lista de tipos de negocio para el selector
const businessTypes = [
  { value: "peluqueria", label: "Peluquería" },
  { value: "barberia", label: "Barbería" },
  { value: "clinica_dental", label: "Clínica dental" },
  { value: "fisioterapia", label: "Fisioterapia" },
  { value: "estetica", label: "Centro de estética" },
  { value: "psicologia", label: "Psicología" },
  { value: "nutricion", label: "Nutrición" },
  { value: "gimnasio", label: "Gimnasio" },
  { value: "yoga", label: "Yoga" },
  { value: "masajes", label: "Masajes" },
  { value: "otros", label: "Otros" }
];

const DemoBusinessConfig = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState(mockBusiness);
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(mockBusinessConfig);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    Object.keys(mockBusinessConfig.business_hours).filter(day => 
      mockBusinessConfig.business_hours[day] && mockBusinessConfig.business_hours[day].length > 0
    )
  );

  // Función para manejar cambios en la selección de días
  const handleDayToggle = (dayId: string) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter(id => id !== dayId));
      
      // Actualizar horarios
      const updatedHours = {...businessConfig.business_hours};
      updatedHours[dayId] = [];
      setBusinessConfig({
        ...businessConfig,
        business_hours: updatedHours
      });
    } else {
      setSelectedDays([...selectedDays, dayId]);
      
      // Si no tiene horarios, añadir uno por defecto
      if (!businessConfig.business_hours[dayId] || businessConfig.business_hours[dayId].length === 0) {
        const updatedHours = {...businessConfig.business_hours};
        updatedHours[dayId] = [{ start: "09:00", end: "14:00" }];
        setBusinessConfig({
          ...businessConfig,
          business_hours: updatedHours
        });
      }
    }
  };

  // Función para añadir un nuevo rango horario a un día
  const addTimeRange = (dayId: string) => {
    const updatedHours = {...businessConfig.business_hours};
    if (!updatedHours[dayId]) {
      updatedHours[dayId] = [];
    }
    updatedHours[dayId] = [...updatedHours[dayId], { start: "09:00", end: "14:00" }];
    
    setBusinessConfig({
      ...businessConfig,
      business_hours: updatedHours
    });
  };

  // Función para eliminar un rango horario
  const removeTimeRange = (dayId: string, index: number) => {
    const updatedHours = {...businessConfig.business_hours};
    updatedHours[dayId] = updatedHours[dayId].filter((_, i) => i !== index);
    
    setBusinessConfig({
      ...businessConfig,
      business_hours: updatedHours
    });
  };

  // Función para actualizar un rango horario
  const updateTimeRange = (dayId: string, index: number, field: 'start' | 'end', value: string) => {
    const updatedHours = {...businessConfig.business_hours};
    if (updatedHours[dayId] && updatedHours[dayId][index]) {
      updatedHours[dayId][index] = {
        ...updatedHours[dayId][index],
        [field]: value
      };
      
      setBusinessConfig({
        ...businessConfig,
        business_hours: updatedHours
      });
    }
  };

  // Función para copiar horarios
  const copyScheduleFrom = (sourceDayId: string, targetDayIds: string[]) => {
    const sourceSchedule = businessConfig.business_hours[sourceDayId] || [];
    
    const updatedHours = {...businessConfig.business_hours};
    targetDayIds.forEach(dayId => {
      updatedHours[dayId] = [...sourceSchedule];
    });
    
    setBusinessConfig({
      ...businessConfig,
      business_hours: updatedHours
    });
    
    toast({
      title: "Horarios copiados",
      description: `Se han copiado los horarios correctamente`
    });
  };

  // Función para guardar la configuración
  const handleSave = async () => {
    setLoading(true);
    
    // Simulación de guardado con delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Configuración guardada",
        description: "Los cambios se han guardado correctamente"
      });
    }, 1000);
  };

  // Función para manejar cambios en la configuración
  const handleConfigChange = (key: keyof BusinessConfig, value: any) => {
    setBusinessConfig({
      ...businessConfig,
      [key]: value
    });
  };

  // Función para manejar cambios en los datos del negocio
  const handleBusinessChange = (key: keyof typeof business, value: any) => {
    setBusiness({
      ...business,
      [key]: value
    });
  };

  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-4 lg:p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{business.name}</h1>
            <p className="text-muted-foreground mt-1">
              Configuración del negocio
            </p>
          </div>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full md:w-[600px] grid-cols-3">
              <TabsTrigger value="basic">Información Básica</TabsTrigger>
              <TabsTrigger value="schedule">Horarios Comerciales</TabsTrigger>
              <TabsTrigger value="advanced">Configuración Avanzada</TabsTrigger>
            </TabsList>
            
            {/* Pestaña de Información Básica */}
            <TabsContent value="basic" className="space-y-6 mt-6">
              {/* Información básica del negocio */}
              <Card>
                <CardHeader>
                  <CardTitle>Datos del negocio</CardTitle>
                  <CardDescription>
                    Información básica de tu negocio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del negocio</Label>
                      <Input 
                        id="name" 
                        value={business.name} 
                        onChange={(e) => handleBusinessChange('name', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de negocio</Label>
                      <Select
                        value={business.type_of_business}
                        onValueChange={(value) => handleBusinessChange('type_of_business', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo de negocio" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input 
                        id="address" 
                        value={business.address} 
                        onChange={(e) => handleBusinessChange('address', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input 
                          id="city" 
                          value={business.city} 
                          onChange={(e) => handleBusinessChange('city', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="postal_code">Código Postal</Label>
                        <Input 
                          id="postal_code" 
                          value={business.postal_code} 
                          onChange={(e) => handleBusinessChange('postal_code', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cif">CIF/NIF</Label>
                    <Input 
                      id="cif" 
                      value={business.cif} 
                      onChange={(e) => handleBusinessChange('cif', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pestaña de Horarios Comerciales */}
            <TabsContent value="schedule" className="space-y-6 mt-6">
              {/* Horarios comerciales */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Horarios comerciales</CardTitle>
                  <CardDescription>
                    Define los días y horas en los que tu negocio está abierto
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 mt-4">
                  {/* Selector de días */}
                  <div className="space-y-2">
                    <Label>Días laborables</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {weekDays.map((day) => (
                        <Button
                          key={day.id}
                          type="button"
                          variant={selectedDays.includes(day.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleDayToggle(day.id)}
                          className={selectedDays.includes(day.id) ? "bg-primary text-primary-foreground" : ""}
                        >
                          {day.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Horarios por día */}
                  <div className="space-y-6 mt-4">
                    {selectedDays.length > 0 ? (
                      selectedDays.map(dayId => {
                        const day = weekDays.find(d => d.id === dayId);
                        const timeRanges = businessConfig.business_hours[dayId] || [];
                        
                        return (
                          <div key={dayId} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="font-medium">{day?.name}</h3>
                              
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => addTimeRange(dayId)}
                                >
                                  <Plus className="h-3.5 w-3.5 mr-1" />
                                  Añadir franja
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const otherDays = selectedDays.filter(d => d !== dayId);
                                    if (otherDays.length > 0) {
                                      copyScheduleFrom(dayId, otherDays);
                                    } else {
                                      toast({
                                        title: "No hay otros días seleccionados",
                                        description: "Selecciona otros días para copiar este horario"
                                      });
                                    }
                                  }}
                                >
                                  <Copy className="h-3.5 w-3.5 mr-1" />
                                  Copiar a otros días
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              {timeRanges.length > 0 ? (
                                timeRanges.map((range, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <div className="grid grid-cols-2 gap-2 flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground w-12">Desde</span>
                                        <Input
                                          type="time"
                                          value={range.start}
                                          onChange={(e) => updateTimeRange(dayId, index, 'start', e.target.value)}
                                          className="w-full"
                                        />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground w-12">Hasta</span>
                                        <Input
                                          type="time"
                                          value={range.end}
                                          onChange={(e) => updateTimeRange(dayId, index, 'end', e.target.value)}
                                          className="w-full"
                                        />
                                      </div>
                                    </div>
                                    
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => removeTimeRange(dayId, index)}
                                      disabled={timeRanges.length === 1}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground italic">Sin horario definido</p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center p-4 border rounded-lg bg-muted/30">
                        <p className="text-muted-foreground">Selecciona los días en los que tu negocio está abierto</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Pestaña de Configuración Avanzada */}
            <TabsContent value="advanced" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de reservas</CardTitle>
                  <CardDescription>
                    Opciones para gestionar cómo funcionan las reservas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="days_advance">Días de antelación para reservar</Label>
                      <Input 
                        id="days_advance" 
                        type="number"
                        value={businessConfig.days_advance_booking}
                        onChange={(e) => handleConfigChange('days_advance_booking', parseInt(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Cuántos días hacia el futuro se puede reservar
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cancel_hours">Horas de antelación para cancelar</Label>
                      <Input 
                        id="cancel_hours" 
                        type="number"
                        value={businessConfig.time_advance_cancel_reschedule}
                        onChange={(e) => handleConfigChange('time_advance_cancel_reschedule', parseInt(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Tiempo mínimo para cancelar o reprogramar
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="new_clients_can_book">Nuevos clientes pueden reservar</Label>
                        <p className="text-xs text-muted-foreground">
                          Permitir que nuevos clientes hagan reservas online
                        </p>
                      </div>
                      <Switch
                        id="new_clients_can_book"
                        checked={businessConfig.new_clients_can_book}
                        onCheckedChange={(checked) => handleConfigChange('new_clients_can_book', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="new_clients_sms">Confirmar nuevos clientes por SMS</Label>
                        <p className="text-xs text-muted-foreground">
                          Solicitar confirmación por SMS para nuevos clientes
                        </p>
                      </div>
                      <Switch
                        id="new_clients_sms"
                        checked={businessConfig.new_clients_ask_sms_confirmation}
                        onCheckedChange={(checked) => handleConfigChange('new_clients_ask_sms_confirmation', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Visibilidad y opciones</CardTitle>
                  <CardDescription>
                    Configura cómo aparece tu negocio online
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="public_list_business">Mostrar negocio públicamente</Label>
                        <p className="text-xs text-muted-foreground">
                          Mostrar tu negocio en el directorio público
                        </p>
                      </div>
                      <Switch
                        id="public_list_business"
                        checked={businessConfig.public_list_business}
                        onCheckedChange={(checked) => handleConfigChange('public_list_business', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="public_list_services">Mostrar servicios públicamente</Label>
                        <p className="text-xs text-muted-foreground">
                          Mostrar los servicios en el directorio público
                        </p>
                      </div>
                      <Switch
                        id="public_list_services"
                        checked={businessConfig.public_list_services}
                        onCheckedChange={(checked) => handleConfigChange('public_list_services', checked)}
                      />
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allow_choose_professional">Permitir elegir profesional</Label>
                        <p className="text-xs text-muted-foreground">
                          Permitir que los clientes elijan un profesional específico
                        </p>
                      </div>
                      <Switch
                        id="allow_choose_professional"
                        checked={businessConfig.allow_choose_professional}
                        onCheckedChange={(checked) => handleConfigChange('allow_choose_professional', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="professional_schedule">Habilitar horarios por profesional</Label>
                        <p className="text-xs text-muted-foreground">
                          Permitir que cada profesional tenga su propio horario
                        </p>
                      </div>
                      <Switch
                        id="professional_schedule"
                        checked={businessConfig.professional_schedule_enabled}
                        onCheckedChange={(checked) => handleConfigChange('professional_schedule_enabled', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </div>
    </AppSidebarWrapper>
  );
};

export default DemoBusinessConfig;
