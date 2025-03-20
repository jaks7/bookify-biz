
import React, { useState, useEffect } from "react";
import { format, addDays, subDays, parseISO, startOfWeek, endOfWeek, addWeeks, subWeeks, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar as CalendarIcon, 
  Plus, 
  List,
  PlusCircle,
  Eye,
  EyeOff,
  Save
} from "lucide-react";
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/calendar/TimePicker";
import { Switch } from "@/components/ui/switch";

// This is a demo version that uses the same code as the main Turnos page
// We're reusing the exact same code for demonstration purposes

// Import the main components from the regular Turnos page
// Since this is a demo, we'll use the same mock data and functionality

// Mock data for professional slots
const generateMockAvailability = () => {
  const currentDate = new Date();
  const availabilities = [];
  const professionals = [
    { id: "prof1", name: "María García" },
    { id: "prof2", name: "Juan Pérez" },
    { id: "prof3", name: "Sofia Rodríguez" }
  ];

  // Generate availabilities for the next 14 days
  for (let i = 0; i < 14; i++) {
    const date = format(addDays(currentDate, i), 'yyyy-MM-dd');
    
    // Skip weekends (Saturday and Sunday)
    const dayOfWeek = addDays(currentDate, i).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    // Generate different availabilities for each professional
    professionals.forEach((professional) => {
      if (professional.id === "prof1") {
        // María works mornings
        availabilities.push({
          id: `avail-${professional.id}-${date}-1`,
          professional: professional.id,
          professionalName: professional.name,
          date,
          start_time: "09:00",
          end_time: "14:00"
        });
      } else if (professional.id === "prof2") {
        // Juan works full day
        availabilities.push({
          id: `avail-${professional.id}-${date}-1`,
          professional: professional.id,
          professionalName: professional.name,
          date,
          start_time: "09:00",
          end_time: "14:00"
        });
        availabilities.push({
          id: `avail-${professional.id}-${date}-2`,
          professional: professional.id,
          professionalName: professional.name,
          date,
          start_time: "16:00",
          end_time: "20:00"
        });
      } else if (professional.id === "prof3") {
        // Sofia works only some afternoons
        if (i % 2 === 0) {
          availabilities.push({
            id: `avail-${professional.id}-${date}-1`,
            professional: professional.id,
            professionalName: professional.name,
            date,
            start_time: "16:00",
            end_time: "20:00"
          });
        }
      }
    });
  }

  return availabilities;
};

// Mock data for availability patterns
const generateMockPatterns = () => {
  const patterns = [
    {
      id: "pattern1",
      professional: "prof1",
      professionalName: "María García",
      name: "Horario de mañanas",
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      days_of_week: "1111100", // Mon-Fri
      start_time: "09:00",
      end_time: "14:00"
    },
    {
      id: "pattern2",
      professional: "prof2",
      professionalName: "Juan Pérez",
      name: "Horario completo",
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      days_of_week: "1111100", // Mon-Fri
      start_time: "09:00",
      end_time: "20:00"
    },
    {
      id: "pattern3",
      professional: null,
      name: "Patrón general tardes",
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: format(addDays(new Date(), 60), 'yyyy-MM-dd'),
      days_of_week: "1111100", // Mon-Fri
      start_time: "16:00",
      end_time: "20:00"
    }
  ];

  return patterns;
};

// Mock business hours for the timeline
const BUSINESS_HOURS = {
  start: "09:00",
  end: "20:00",
  breakStart: "14:00",
  breakEnd: "16:00",
  daysOpen: [1, 2, 3, 4, 5], // Monday to Friday
};

// Convert time string to minutes for positioning
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Helper to check if a date is a working day
const isWorkingDay = (date) => {
  const day = date.getDay();
  return BUSINESS_HOURS.daysOpen.includes(day);
};

// Generate time slots for the timeline
const generateTimeSlots = () => {
  const slots = [];
  const start = timeToMinutes(BUSINESS_HOURS.start);
  const end = timeToMinutes(BUSINESS_HOURS.end);
  // Create slots every 30 minutes
  for (let time = start; time <= end; time += 30) {
    const hours = Math.floor(time / 60).toString().padStart(2, "0");
    const mins = (time % 60).toString().padStart(2, "0");
    slots.push(`${hours}:${mins}`);
  }
  return slots;
};

const TimelineView = ({ 
  availabilities, 
  weekStart, 
  visibleProfessionals,
  professionals,
  onAvailabilityUpdate,
  onAvailabilityCreate,
  onAvailabilityDelete
}) => {
  const timeSlots = generateTimeSlots();
  const firstSlotTime = timeSlots[0];
  const lastSlotTime = timeSlots[timeSlots.length - 1];
  
  // Calculate total timeline width based on time range
  const startMinutes = timeToMinutes(firstSlotTime);
  const endMinutes = timeToMinutes(lastSlotTime);
  const totalMinutes = endMinutes - startMinutes;

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Filter availabilities for the current week
  const weekAvailabilities = availabilities.filter(avail => {
    const availDate = parseISO(avail.date);
    return isWithinInterval(availDate, {
      start: weekStart,
      end: addDays(weekStart, 6)
    });
  });

  // Get visible professionals with their availabilities
  const visibleProfessionalsData = professionals
    .filter(prof => visibleProfessionals.includes(prof.id))
    .map(prof => ({
      ...prof,
      availabilities: weekAvailabilities.filter(avail => avail.professional === prof.id)
    }));

  // Calculate position and width of an availability block
  const calculatePositioning = (startTime, endTime, date) => {
    const dayIndex = parseISO(date).getDay(); // 0 = Sunday, 1 = Monday, etc.
    const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Adjust to 0 = Monday, 6 = Sunday
    
    const startMinutes = timeToMinutes(startTime) - timeToMinutes(firstSlotTime);
    const endMinutes = timeToMinutes(endTime) - timeToMinutes(firstSlotTime);
    const width = ((endMinutes - startMinutes) / totalMinutes) * 100;
    const left = (startMinutes / totalMinutes) * 100;
    
    return {
      width: `${width}%`,
      left: `${left}%`,
      dayIndex: adjustedDayIndex
    };
  };

  // Handling click on timeline to create new availability
  const handleTimelineClick = (professionalId, dayIndex, time) => {
    const date = format(addDays(weekStart, dayIndex), 'yyyy-MM-dd');
    const endTimeMinutes = timeToMinutes(time) + 60; // Default 1 hour
    const endHours = Math.floor(endTimeMinutes / 60).toString().padStart(2, "0");
    const endMins = (endTimeMinutes % 60).toString().padStart(2, "0");
    const endTime = `${endHours}:${endMins}`;
    
    if (onAvailabilityCreate) {
      onAvailabilityCreate({
        professional: professionalId,
        date,
        start_time: time,
        end_time: endTime
      });
    }
  };

  return (
    <div className="mt-6 overflow-auto">
      {/* Days header */}
      <div className="grid grid-cols-7 mb-2 sticky top-0 z-10 bg-white">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className={cn(
              "p-2 text-center font-medium border-b",
              !isWorkingDay(day) && "bg-gray-100"
            )}
          >
            <div className="text-sm uppercase">{format(day, 'EEEE', { locale: es })}</div>
            <div className="text-lg">{format(day, 'd', { locale: es })}</div>
          </div>
        ))}
      </div>

      {/* Timeline for each professional */}
      {visibleProfessionalsData.map((prof) => (
        <div key={prof.id} className="mb-6">
          <div className="font-medium mb-1 px-2">{prof.name}</div>
          
          <div className="grid grid-cols-7 h-24 relative">
            {/* Day cells */}
            {weekDays.map((day, dayIndex) => (
              <div 
                key={dayIndex} 
                className={cn(
                  "border relative",
                  !isWorkingDay(day) && "bg-gray-100"
                )}
              >
                {/* Time guides */}
                <div className="absolute inset-0 flex">
                  {timeSlots.map((time, index) => (
                    <div 
                      key={index}
                      className="border-r border-gray-200 h-full"
                      style={{ 
                        width: `${100 / timeSlots.length}%`,
                        marginLeft: index === 0 ? 0 : '',
                      }}
                      onClick={() => isWorkingDay(day) && handleTimelineClick(prof.id, dayIndex, time)}
                    >
                      {index % 2 === 0 && (
                        <div className="text-xs text-gray-500 absolute bottom-0 -translate-x-1/2">
                          {time}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Rendered availabilities for this day */}
                {isWorkingDay(day) && prof.availabilities
                  .filter(avail => {
                    const availDate = parseISO(avail.date);
                    return format(availDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
                  })
                  .map(avail => {
                    const positioning = calculatePositioning(avail.start_time, avail.end_time, avail.date);
                    if (positioning.dayIndex !== dayIndex) return null;
                    
                    return (
                      <div 
                        key={avail.id}
                        className="absolute bg-blue-500 text-white text-xs p-1 rounded opacity-90 hover:opacity-100 cursor-pointer"
                        style={{ 
                          width: positioning.width, 
                          left: positioning.left,
                          top: '4px',
                          bottom: '4px'
                        }}
                        onClick={() => {
                          // Handle editing/deleting availability
                          console.log("Edit availability", avail);
                        }}
                      >
                        {avail.start_time} - {avail.end_time}
                      </div>
                    );
                  })
                }
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Create Slots from Pattern Dialog
const CreateFromPatternDialog = ({
  patterns,
  onCreateSlots
}) => {
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });

  return (
    <div className="space-y-4 p-1">
      <div className="space-y-2">
        <Label htmlFor="pattern">Selecciona una plantilla</Label>
        <div className="space-y-2">
          {patterns.map(pattern => (
            <label key={pattern.id} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
              <Checkbox 
                id={pattern.id} 
                checked={selectedPattern === pattern.id}
                onCheckedChange={(checked) => {
                  if (checked) setSelectedPattern(pattern.id);
                  else setSelectedPattern(null);
                }}
              />
              <div>
                <div className="font-medium">{pattern.name}</div>
                <div className="text-sm text-gray-500">
                  {pattern.professionalName ? `Para ${pattern.professionalName}` : 'General'} • 
                  {pattern.days_of_week === "1111100" ? " L-V" : " Personalizado"} • 
                  {pattern.start_time} a {pattern.end_time}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fecha inicio</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  format(dateRange.from, "PPP", { locale: es })
                ) : (
                  <span>Selecciona fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                initialFocus
                locale={es}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Fecha fin</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? (
                  format(dateRange.to, "PPP", { locale: es })
                ) : (
                  <span>Selecciona fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                initialFocus
                locale={es}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          disabled={!selectedPattern || !dateRange.from || !dateRange.to}
          onClick={() => {
            if (selectedPattern && dateRange.from && dateRange.to) {
              onCreateSlots(selectedPattern, dateRange);
            }
          }}
        >
          Crear turnos
        </Button>
      </div>
    </div>
  );
};

// Pattern Form Component
const PatternForm = ({
  pattern,
  professionals,
  onSave
}) => {
  const [name, setName] = useState(pattern?.name || "");
  const [selectedProfessional, setSelectedProfessional] = useState(pattern?.professional || null);
  const [startDate, setStartDate] = useState(pattern?.start_date ? parseISO(pattern.start_date) : new Date());
  const [endDate, setEndDate] = useState(pattern?.end_date ? parseISO(pattern.end_date) : addDays(new Date(), 30));
  const [startTime, setStartTime] = useState(pattern?.start_time || "09:00");
  const [endTime, setEndTime] = useState(pattern?.end_time || "18:00");
  
  const [daysOfWeek, setDaysOfWeek] = useState({
    1: pattern?.days_of_week?.[0] === "1" || true, // Monday
    2: pattern?.days_of_week?.[1] === "1" || true, // Tuesday
    3: pattern?.days_of_week?.[2] === "1" || true, // Wednesday
    4: pattern?.days_of_week?.[3] === "1" || true, // Thursday
    5: pattern?.days_of_week?.[4] === "1" || true, // Friday
    6: pattern?.days_of_week?.[5] === "1" || false, // Saturday
    0: pattern?.days_of_week?.[6] === "1" || false, // Sunday
  });

  const handleSave = () => {
    // Convert days of week to string format "1111100"
    const daysString = [1, 2, 3, 4, 5, 6, 0].map(day => daysOfWeek[day] ? "1" : "0").join("");
    
    onSave({
      id: pattern?.id,
      name,
      professional: selectedProfessional,
      start_date: startDate ? format(startDate, 'yyyy-MM-dd') : "",
      end_date: endDate ? format(endDate, 'yyyy-MM-dd') : "",
      days_of_week: daysString,
      start_time: startTime,
      end_time: endTime
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la plantilla</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Ej: Turno de mañana"
        />
      </div>

      <div className="space-y-2">
        <Label>Profesional (opcional)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant={selectedProfessional === null ? "default" : "outline"}
            onClick={() => setSelectedProfessional(null)}
          >
            General
          </Button>
          <div className="space-y-2">
            {professionals.map(prof => (
              <label key={prof.id} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox 
                  id={`prof-${prof.id}`} 
                  checked={selectedProfessional === prof.id}
                  onCheckedChange={(checked) => {
                    if (checked) setSelectedProfessional(prof.id);
                    else if (selectedProfessional === prof.id) setSelectedProfessional(null);
                  }}
                />
                <span>{prof.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fecha inicio validez</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? (
                  format(startDate, "PPP", { locale: es })
                ) : (
                  <span>Selecciona fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                locale={es}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Fecha fin validez</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? (
                  format(endDate, "PPP", { locale: es })
                ) : (
                  <span>Selecciona fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                locale={es}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Días de la semana</Label>
        <div className="flex flex-wrap gap-2">
          {[
            { day: 1, label: "L" },
            { day: 2, label: "M" },
            { day: 3, label: "X" },
            { day: 4, label: "J" },
            { day: 5, label: "V" },
            { day: 6, label: "S" },
            { day: 0, label: "D" }
          ].map(({ day, label }) => (
            <label 
              key={day} 
              className={cn(
                "cursor-pointer flex items-center justify-center w-10 h-10 rounded-full",
                daysOfWeek[day] ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
              )}
              onClick={() => setDaysOfWeek({...daysOfWeek, [day]: !daysOfWeek[day]})}
            >
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Hora inicio</Label>
          <TimePicker value={startTime} onChange={setStartTime} />
        </div>

        <div className="space-y-2">
          <Label>Hora fin</Label>
          <TimePicker value={endTime} onChange={setEndTime} />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave}>
          Guardar plantilla
        </Button>
      </div>
    </div>
  );
};

// Main Turnos component for demo
const DemoTurnos = () => {
  const [activeTab, setActiveTab] = useState("turnos");
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState(generateMockAvailability());
  const [patterns, setPatterns] = useState(generateMockPatterns());
  const [createPatternsOpen, setCreatePatternsOpen] = useState(false);
  const [createPatternOpen, setCreatePatternOpen] = useState(false);
  const [editPatternId, setEditPatternId] = useState(null);
  
  // Mock professionals data
  const professionals = [
    { id: "prof1", name: "María García" },
    { id: "prof2", name: "Juan Pérez" },
    { id: "prof3", name: "Sofia Rodríguez" }
  ];
  
  const [visibleProfessionals, setVisibleProfessionals] = useState(
    professionals.map(p => p.id)
  );

  useEffect(() => {
    if (selectedDate) {
      setWeekStart(startOfWeek(selectedDate, { weekStartsOn: 1 }));
    }
  }, [selectedDate]);

  const handlePreviousWeek = () => {
    setWeekStart(subWeeks(weekStart, 1));
    setSelectedDate(subWeeks(selectedDate, 1));
  };

  const handleNextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1));
    setSelectedDate(addWeeks(selectedDate, 1));
  };

  const toggleProfessionalVisibility = (id) => {
    if (visibleProfessionals.includes(id)) {
      setVisibleProfessionals(visibleProfessionals.filter(p => p !== id));
    } else {
      setVisibleProfessionals([...visibleProfessionals, id]);
    }
  };

  const handleSavePattern = (patternData) => {
    if (patternData.id) {
      // Update existing pattern
      setPatterns(patterns.map(p => 
        p.id === patternData.id ? { ...p, ...patternData } : p
      ));
    } else {
      // Create new pattern
      const newPattern = {
        id: `pattern-${Date.now()}`,
        professional: patternData.professional || null,
        professionalName: patternData.professional 
          ? professionals.find(p => p.id === patternData.professional)?.name 
          : undefined,
        name: patternData.name || "Nueva plantilla",
        start_date: patternData.start_date || format(new Date(), 'yyyy-MM-dd'),
        end_date: patternData.end_date || format(addDays(new Date(), 30), 'yyyy-MM-dd'),
        days_of_week: patternData.days_of_week || "1111100",
        start_time: patternData.start_time || "09:00",
        end_time: patternData.end_time || "18:00"
      };
      setPatterns([...patterns, newPattern]);
    }
    setCreatePatternOpen(false);
    setEditPatternId(null);
  };

  const handleDeletePattern = (id) => {
    setPatterns(patterns.filter(p => p.id !== id));
  };

  const handleCreateSlotsFromPattern = (patternId, dateRange) => {
    const pattern = patterns.find(p => p.id === patternId);
    if (!pattern) return;
    
    const newAvailabilities = [];
    const currentDate = new Date(dateRange.from);
    
    while (currentDate <= dateRange.to) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0 = Monday, 6 = Sunday
      
      // Check if this day is included in the pattern
      if (pattern.days_of_week[dayIndex] === "1") {
        // If pattern is for a specific professional or for all
        const professionalsToApply = pattern.professional 
          ? [pattern.professional] 
          : professionals.map(p => p.id);
        
        for (const profId of professionalsToApply) {
          newAvailabilities.push({
            id: `avail-${profId}-${format(currentDate, 'yyyy-MM-dd')}-${Date.now()}`,
            professional: profId,
            professionalName: professionals.find(p => p.id === profId)?.name,
            date: format(currentDate, 'yyyy-MM-dd'),
            start_time: pattern.start_time,
            end_time: pattern.end_time
          });
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setAvailabilities([...availabilities, ...newAvailabilities]);
    setCreatePatternsOpen(false);
  };

  const handleCreateAvailability = (newAvail) => {
    const professional = professionals.find(p => p.id === newAvail.professional);
    if (!professional) return;
    
    const newAvailability = {
      id: `avail-${Date.now()}`,
      professional: newAvail.professional,
      professionalName: professional.name,
      date: newAvail.date,
      start_time: newAvail.start_time,
      end_time: newAvail.end_time
    };
    
    setAvailabilities([...availabilities, newAvailability]);
  };

  return (
    <AppSidebarWrapper>
      <div className="bg-gray-50 flex-1">
        <div className="container px-4 py-8 mx-auto pt-20">
          <Tabs 
            defaultValue={activeTab} 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <h1 className="text-2xl font-bold">Turnos (Demo)</h1>
                <TabsList>
                  <TabsTrigger value="turnos">Turnos</TabsTrigger>
                  <TabsTrigger value="patrones">Patrones</TabsTrigger>
                </TabsList>
              </div>
              
              {activeTab === "turnos" ? (
                <div className="flex items-center gap-2">
                  <Dialog open={createPatternsOpen} onOpenChange={setCreatePatternsOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Crear turnos desde plantilla
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Crear turnos desde plantilla</DialogTitle>
                      </DialogHeader>
                      <CreateFromPatternDialog 
                        patterns={patterns}
                        onCreateSlots={handleCreateSlotsFromPattern}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" onClick={handlePreviousWeek}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="min-w-[240px]">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>
                          {format(weekStart, "'Semana del' d 'de' MMMM", { locale: es })}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                        locale={es}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Button variant="outline" onClick={handleNextWeek}>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Dialog open={createPatternOpen} onOpenChange={setCreatePatternOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Nueva plantilla
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Crear nueva plantilla</DialogTitle>
                    </DialogHeader>
                    <PatternForm 
                      professionals={professionals}
                      onSave={handleSavePattern}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <TabsContent value="turnos" className="mt-4">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Turnos de profesionales</CardTitle>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" className="h-8 text-sm gap-1">
                        <Save className="h-3.5 w-3.5" />
                        Guardar cambios
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {professionals.map(prof => (
                      <label 
                        key={prof.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Switch
                          checked={visibleProfessionals.includes(prof.id)}
                          onCheckedChange={() => toggleProfessionalVisibility(prof.id)}
                        />
                        <span className="text-sm font-medium">{prof.name}</span>
                      </label>
                    ))}
                  </div>
                </CardHeader>

                <CardContent>
                  <TimelineView 
                    availabilities={availabilities}
                    weekStart={weekStart}
                    visibleProfessionals={visibleProfessionals}
                    professionals={professionals}
                    onAvailabilityCreate={handleCreateAvailability}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patrones" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Plantillas de turnos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patterns.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No hay plantillas definidas. Crea una nueva plantilla para empezar.
                      </div>
                    ) : (
                      patterns.map(pattern => (
                        <div 
                          key={pattern.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{pattern.name}</h3>
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setEditPatternId(pattern.id)}
                                  >
                                    Editar
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Editar plantilla</DialogTitle>
                                  </DialogHeader>
                                  <PatternForm 
                                    pattern={pattern}
                                    professionals={professionals}
                                    onSave={handleSavePattern}
                                  />
                                </DialogContent>
                              </Dialog>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeletePattern(pattern.id)}
                              >
                                Eliminar
                              </Button>
                            </div>
                          </div>

                          <div className="text-sm text-gray-500 space-y-1">
                            <div>
                              {pattern.professionalName 
                                ? `Profesional: ${pattern.professionalName}` 
                                : "Aplicable a todos los profesionales"
                              }
                            </div>
                            <div>
                              Validez: {format(parseISO(pattern.start_date), "d MMM yyyy", { locale: es })} 
                              - {format(parseISO(pattern.end_date), "d MMM yyyy", { locale: es })}
                            </div>
                            <div>
                              Días: {pattern.days_of_week === "1111100" 
                                ? "Lunes a Viernes" 
                                : pattern.days_of_week === "1111110" 
                                  ? "Lunes a Sábado" 
                                  : "Personalizado"
                              }
                            </div>
                            <div>
                              Horario: {pattern.start_time} - {pattern.end_time}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppSidebarWrapper>
  );
};

export default DemoTurnos;
