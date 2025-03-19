
import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Clock, User, Bookmark } from "lucide-react";
import { BusinessHours } from "@/components/calendar/BusinessHours";
import { ProfessionalSchedule } from "@/components/calendar/ProfessionalSchedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Professional } from "@/types/professional";

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
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals);
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
  const filteredProfessionals = workingProfessionals.filter(p => selectedProfessionals.includes(p.id));
  
  // Helper function to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Helper function to check if time is within working hours
  const isWithinWorkingHours = (professional: Professional, time: string) => {
    return professional.workingHours?.some(
      ({ start, end }) => time >= start && time < end
    ) || false;
  };
  
  // Helper function to get appointment end time
  const getAppointmentEndTime = (time: string, duration: number) => {
    const [hours, minutes] = time.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };
  
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
          <TabsTrigger value="horarios">Horarios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="horarios" className="space-y-4 mt-4">
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
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              {workingProfessionals.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {workingProfessionals.map(professional => (
                    <label
                      key={professional.id}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      <Checkbox
                        id={`prof-${professional.id}`}
                        checked={selectedProfessionals.includes(professional.id)}
                        onCheckedChange={(checked) => 
                          handleProfessionalSelection(professional.id, checked === true)
                        }
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{professional.name}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {workingProfessionals.length > 0 && selectedProfessionals.length > 0 ? (
                <div className="overflow-auto">
                  {/* Fixed header with professional names */}
                  <div className="flex border-b sticky top-0 bg-white z-10">
                    <div className="w-16"></div> {/* Empty space for time column */}
                    <div className="flex-1 grid" style={{ 
                      gridTemplateColumns: `repeat(${filteredProfessionals.length}, minmax(200px, 1fr))` 
                    }}>
                      {filteredProfessionals.map(professional => (
                        <div key={professional.id} className="p-3 text-center font-medium flex items-center justify-center gap-2 bg-gray-50 border-r">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                              {getInitials(professional.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{professional.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Generate time slots from 9:00 to 19:00 with 30 minute intervals */}
                  <div className="grid gap-0">
                    {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", 
                      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
                      "17:00", "17:30", "18:00", "18:30", "19:00"].map((time) => (
                      <div key={time} className="flex gap-0 border-b">
                        <div className="w-16 text-sm text-gray-500 p-3 border-r sticky left-0 bg-white">{time}</div>
                        <div className="flex-1 grid" style={{ 
                          gridTemplateColumns: `repeat(${filteredProfessionals.length}, minmax(200px, 1fr))` 
                        }}>
                          {filteredProfessionals.map(professional => {
                            const appointment = professional.appointments?.find(apt => apt.time === time);
                            const isAvailable = isWithinWorkingHours(professional, time);
                            
                            if (appointment) {
                              const endTime = getAppointmentEndTime(time, appointment.duration);
                              return (
                                <div 
                                  key={`${professional.id}-${time}`}
                                  className="p-3 border-r bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                                >
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-rose-500" />
                                    <div>
                                      <div className="text-sm font-medium">{`${time} - ${endTime}`}</div>
                                      <div className="flex flex-col text-xs text-gray-600 mt-1">
                                        {appointment.clientName && (
                                          <span className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {appointment.clientName}
                                          </span>
                                        )}
                                        {appointment.service && (
                                          <span className="flex items-center gap-1">
                                            <Bookmark className="h-3 w-3" />
                                            {appointment.service}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            } else if (isAvailable) {
                              return (
                                <div 
                                  key={`${professional.id}-${time}`}
                                  className="border-r bg-white hover:bg-emerald-50 transition-colors cursor-pointer p-3"
                                ></div>
                              );
                            } else {
                              return (
                                <div 
                                  key={`${professional.id}-${time}`}
                                  className="border-r bg-gray-100 p-3"
                                ></div>
                              );
                            }
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  {workingProfessionals.length === 0 ? 
                    "No hay profesionales trabajando este día." : 
                    "Selecciona al menos un profesional para ver su agenda."}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
