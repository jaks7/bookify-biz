
import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Filter } from "lucide-react";
import { BusinessHours } from "@/components/calendar/BusinessHours";
import { ProfessionalSchedule } from "@/components/calendar/ProfessionalSchedule";
import { ProfessionalTimeline } from "@/components/calendar/ProfessionalTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Mock data for demonstrations
const generateMockData = () => {
  // Mock business hours
  const businessHours = [
    { start: "09:00", end: "14:00" },
    { start: "16:00", end: "20:00" }
  ];

  // Mock professionals with random data
  const professionals = [
    {
      id: "prof1",
      name: "María García",
      isWorking: true,
      workingHours: [{ start: "09:00", end: "14:00" }],
      appointments: [
        { id: "apt1", time: "10:00", duration: 60, clientName: "Laura Martínez", service: "Consulta" },
        { id: "apt2", time: "12:30", duration: 30, clientName: "Carlos Ruiz", service: "Revisión" }
      ]
    },
    {
      id: "prof2",
      name: "Juan Pérez",
      isWorking: true,
      workingHours: [
        { start: "09:00", end: "14:00" },
        { start: "16:00", end: "20:00" }
      ],
      appointments: [
        { id: "apt3", time: "09:30", duration: 45, clientName: "Ana López", service: "Tratamiento" },
        { id: "apt4", time: "16:30", duration: 60, clientName: "Pedro Sánchez", service: "Consulta" },
        { id: "apt5", time: "18:00", duration: 30, clientName: "Lucía Torres", service: "Revisión" }
      ]
    },
    {
      id: "prof3",
      name: "Sofía Rodríguez",
      isWorking: false,
      workingHours: [{ start: "16:00", end: "20:00" }],
      appointments: []
    }
  ];

  return { businessHours, professionals };
};

interface DayCalendarProps {
  selectedDate: Date;
}

export const DayCalendar: React.FC<DayCalendarProps> = ({ selectedDate }) => {
  const { businessHours: initialBusinessHours, professionals: initialProfessionals } = generateMockData();
  
  const [businessHours, setBusinessHours] = useState(initialBusinessHours);
  const [professionals, setProfessionals] = useState(initialProfessionals);
  const [activeTab, setActiveTab] = useState("agenda");
  const [showAllProfessionals, setShowAllProfessionals] = useState(true);
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>(
    professionals.filter(p => p.isWorking).map(p => p.id)
  );

  const handleBusinessHoursChange = (hours: { start: string; end: string }[]) => {
    setBusinessHours(hours);
  };

  const handleProfessionalStatusChange = (id: string, isWorking: boolean) => {
    setProfessionals(professionals.map(prof => 
      prof.id === id ? { ...prof, isWorking } : prof
    ));

    // Update selected professionals
    if (isWorking && !selectedProfessionals.includes(id)) {
      setSelectedProfessionals([...selectedProfessionals, id]);
    } else if (!isWorking && selectedProfessionals.includes(id)) {
      setSelectedProfessionals(selectedProfessionals.filter(profId => profId !== id));
    }
  };

  const handleProfessionalHoursChange = (id: string, hours: { start: string; end: string }[]) => {
    setProfessionals(professionals.map(prof => 
      prof.id === id ? { ...prof, workingHours: hours } : prof
    ));
  };

  const handleProfessionalSelection = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedProfessionals([...selectedProfessionals, id]);
    } else {
      setSelectedProfessionals(selectedProfessionals.filter(profId => profId !== id));
    }
  };

  const handleSelectAllProfessionals = (selected: boolean) => {
    setShowAllProfessionals(selected);
    if (selected) {
      setSelectedProfessionals(professionals.filter(p => p.isWorking).map(p => p.id));
    } else {
      setSelectedProfessionals([]);
    }
  };

  const workingProfessionals = professionals.filter(p => p.isWorking);
  
  return (
    <div>
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-4"
      >
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="configuration">Configuración</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration" className="space-y-4 mt-4">
          <BusinessHours 
            initialHours={businessHours} 
            onSave={handleBusinessHoursChange} 
          />
          
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
              <CardTitle className="text-md flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-600" />
                Profesionales {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {professionals.map(professional => (
                  <ProfessionalSchedule
                    key={professional.id}
                    professional={professional}
                    onStatusChange={handleProfessionalStatusChange}
                    onHoursChange={handleProfessionalHoursChange}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agenda" className="space-y-4 mt-4">
          <Card className="border-gray-200 shadow-sm mb-4">
            <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-md flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-gray-600" />
                  <span className="capitalize">{format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</span>
                </CardTitle>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="show-all-professionals"
                      checked={showAllProfessionals}
                      onCheckedChange={handleSelectAllProfessionals}
                    />
                    <Label htmlFor="show-all-professionals" className="text-sm cursor-pointer">
                      Mostrar todos
                    </Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Filtrar</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              {!showAllProfessionals && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {workingProfessionals.map(professional => (
                    <label
                      key={professional.id}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProfessionals.includes(professional.id)}
                        onChange={(e) => handleProfessionalSelection(professional.id, e.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{professional.name}</span>
                    </label>
                  ))}
                </div>
              )}
              
              <div className="space-y-6">
                {workingProfessionals
                  .filter(prof => selectedProfessionals.includes(prof.id))
                  .map(professional => (
                    <ProfessionalTimeline
                      key={professional.id}
                      professional={professional}
                      selectedDate={selectedDate}
                    />
                  ))}
                  
                {workingProfessionals.length === 0 && (
                  <div className="text-center p-6 text-gray-500">
                    No hay profesionales trabajando este día.
                  </div>
                )}
                
                {workingProfessionals.length > 0 && selectedProfessionals.length === 0 && (
                  <div className="text-center p-6 text-gray-500">
                    Selecciona al menos un profesional para ver su agenda.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
