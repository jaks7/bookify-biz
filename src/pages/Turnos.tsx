import React, { useState, useEffect } from "react";
import { format, addDays, parseISO, startOfWeek, endOfWeek, addWeeks, subWeeks, isWithinInterval, parse } from "date-fns";
import { es } from "date-fns/locale";
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus,
  Save,
  Clock,
  Edit,
  Trash2,
  Calendar
} from "lucide-react";
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/calendar/TimePicker";
import { Switch } from "@/components/ui/switch";
import { 
  ProfessionalAvailability, 
  AvailabilityPattern, 
  BusinessHours, 
  BusinessAvailability,
  BusinessScheduleData,
  ShiftData
} from "@/types/availability";
import { AvailabilityDialog } from "@/components/calendar/AvailabilityDialog";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Helper to convert time string to minutes for positioning
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Helper to extract time from datetime string
const extractTime = (datetime: string) => {
  const parts = datetime.split('T');
  return parts[1];
};

// Helper to extract date from datetime string
const extractDate = (datetime: string) => {
  const parts = datetime.split('T');
  return parts[0];
};

// Mock business hours for the timeline (will be replaced by the API data)
const BUSINESS_HOURS: BusinessHours = {
  start: "09:00",
  end: "20:00",
  breakStart: "14:00",
  breakEnd: "16:00",
  daysOpen: [1, 2, 3, 4, 5, 6], // Monday to Saturday
};

// Helper to check if a date is a working day
const isWorkingDay = (date: Date) => {
  const day = date.getDay();
  return BUSINESS_HOURS.daysOpen.includes(day);
};

// Mock data for professional slots
const generateMockAvailability = () => {
  const currentDate = new Date();
  const availabilities: ProfessionalAvailability[] = [];
  const professionals = [
    { id: "prof1", name: "María García" },
    { id: "prof2", name: "Juan Pérez" },
    { id: "prof3", name: "Sofia Rodríguez" }
  ];

  // Generate availabilities for the next 14 days
  for (let i = 0; i < 14; i++) {
    const date = format(addDays(currentDate, i), 'yyyy-MM-dd');
    
    // Skip days when business is closed
    const dayOfWeek = addDays(currentDate, i).getDay();
    if (!BUSINESS_HOURS.daysOpen.includes(dayOfWeek)) continue;
    
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
  const patterns: AvailabilityPattern[] = [
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

// Mock API response data similar to the JSON format provided
const mockApiResponse: BusinessScheduleData = {
  exceptions: [],
  business_availability: [
    {
      biz_date_time_start: "2025-03-25T09:00",
      biz_date_time_end: "2025-03-25T13:00"
    },
    {
      biz_date_time_start: "2025-03-25T14:00",
      biz_date_time_end: "2025-03-25T18:00"
    },
    {
      biz_date_time_start: "2025-03-26T09:00",
      biz_date_time_end: "2025-03-26T13:00"
    },
    {
      biz_date_time_start: "2025-03-26T14:00",
      biz_date_time_end: "2025-03-26T18:00"
    },
    {
      biz_date_time_start: "2025-03-27T09:00",
      biz_date_time_end: "2025-03-27T13:00"
    },
    {
      biz_date_time_start: "2025-03-27T14:00",
      biz_date_time_end: "2025-03-27T18:00"
    },
    {
      biz_date_time_start: "2025-03-28T09:00",
      biz_date_time_end: "2025-03-28T13:00"
    },
    {
      biz_date_time_start: "2025-03-28T14:00",
      biz_date_time_end: "2025-03-28T18:00"
    }
  ],
  shifts: [
    {
      id: "8b878a8e",
      professional_id: 1,
      professional_name: "Gema None",
      datetime_start: "2025-03-24T09:00",
      datetime_end: "2025-03-24T13:00"
    }
  ]
};

// Function to convert api data to business hours format
const getBusinessHoursFromAPI = (apiData: BusinessScheduleData): Map<string, {start: string, end: string}[]> => {
  const businessHoursMap = new Map<string, {start: string, end: string}[]>();
  
  apiData.business_availability.forEach(availability => {
    const date = extractDate(availability.biz_date_time_start);
    const startTime = extractTime(availability.biz_date_time_start);
    const endTime = extractTime(availability.biz_date_time_end);
    
    if (businessHoursMap.has(date)) {
      businessHoursMap.get(date)?.push({ start: startTime, end: endTime });
    } else {
      businessHoursMap.set(date, [{ start: startTime, end: endTime }]);
    }
  });
  
  return businessHoursMap;
};

// Convert API shifts to ProfessionalAvailability format
const convertShiftsToAvailabilities = (shifts: ShiftData[]): ProfessionalAvailability[] => {
  return shifts.map(shift => ({
    id: shift.id,
    professional: shift.professional_id.toString(),
    professionalName: shift.professional_name,
    date: extractDate(shift.datetime_start),
    start_time: extractTime(shift.datetime_start),
    end_time: extractTime(shift.datetime_end)
  }));
};

// Helper class to manage business days and hours
class BusinessSchedule {
  private businessHoursMap: Map<string, {start: string, end: string}[]>;
  
  constructor(apiData: BusinessScheduleData) {
    this.businessHoursMap = getBusinessHoursFromAPI(apiData);
  }
  
  // Get all available dates
  getDates(): string[] {
    return Array.from(this.businessHoursMap.keys()).sort();
  }
  
  // Get hours for a specific date
  getHoursForDate(date: string): {start: string, end: string}[] {
    return this.businessHoursMap.get(date) || [];
  }
  
  // Check if a date has business hours
  hasBusinessHours(date: string): boolean {
    return this.businessHoursMap.has(date) && this.businessHoursMap.get(date)!.length > 0;
  }
  
  // Get min and max time for a date
  getTimeRangeForDate(date: string): {minTime: string, maxTime: string} {
    const hours = this.getHoursForDate(date);
    if (hours.length === 0) {
      return { minTime: "09:00", maxTime: "18:00" }; // Default
    }
    
    let minTime = hours[0].start;
    let maxTime = hours[0].end;
    
    hours.forEach(hour => {
      if (hour.start < minTime) minTime = hour.start;
      if (hour.end > maxTime) maxTime = hour.end;
    });
    
    return { minTime, maxTime };
  }
}

// Weekly header component showing only working days
const TimeScheduleHeader: React.FC<{ weekDays: Date[], businessSchedule: BusinessSchedule }> = ({ weekDays, businessSchedule }) => {
  // Filter to only show days with business hours
  const workingDays = weekDays.filter(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return businessSchedule.hasBusinessHours(dateStr);
  });
  
  return (
    <div className="flex mb-1 border-b relative bg-white sticky top-0 z-10">
      {/* Left sidebar spacer - for professional name column */}
      <div className="w-48 flex-shrink-0 border-r p-2"></div>
      
      {/* Day header */}
      <div className="flex-1 grid relative" style={{ 
        gridTemplateColumns: `repeat(${workingDays.length}, 1fr)` 
      }}>
        {workingDays.map((day, index) => (
          <div 
            key={index} 
            className="text-center font-medium p-2 border-r last:border-r-0"
          >
            <div className="text-sm uppercase">{format(day, 'EEEE', { locale: es })}</div>
            <div className="text-lg">{format(day, 'd', { locale: es })}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Improved time scale component showing business hours for specified days
const TimeScale: React.FC<{ 
  weekDays: Date[], 
  businessSchedule: BusinessSchedule 
}> = ({ weekDays, businessSchedule }) => {
  const workingDays = weekDays.filter(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return businessSchedule.hasBusinessHours(dateStr);
  });
  
  return (
    <div className="h-8 relative mb-2 border-b bg-gray-50">
      <div className="absolute inset-0 flex w-full">
        {workingDays.map((day, index) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const { minTime, maxTime } = businessSchedule.getTimeRangeForDate(dateStr);
          
          return (
            <div 
              key={index} 
              className="flex-1 relative border-r last:border-r-0 px-2"
            >
              <div className="flex justify-between items-center h-full">
                <span className="text-xs text-gray-500">{minTime}</span>
                <span className="text-xs text-gray-500">{maxTime}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface TimelineProps {
  availabilities: ProfessionalAvailability[];
  weekStart: Date;
  visibleProfessionals: string[];
  professionals: { id: string; name: string }[];
  businessSchedule: BusinessSchedule;
  onAvailabilityUpdate?: (updated: ProfessionalAvailability) => void;
  onAvailabilityCreate?: (newAvail: ProfessionalAvailability) => void;
  onAvailabilityDelete?: (id: string) => void;
}

const TimelineView: React.FC<TimelineProps> = ({ 
  availabilities, 
  weekStart, 
  visibleProfessionals,
  professionals,
  businessSchedule,
  onAvailabilityUpdate,
  onAvailabilityCreate,
  onAvailabilityDelete
}) => {
  // State for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAvailability, setCurrentAvailability] = useState<ProfessionalAvailability | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('');
  const [selectedProfessionalName, setSelectedProfessionalName] = useState<string>('');
  
  // Generate all days in week
  const allWeekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Filter to only working days with business hours
  const weekDays = allWeekDays.filter(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return businessSchedule.hasBusinessHours(dateStr);
  });

  // Filter availabilities for current week and only working days
  const weekAvailabilities = availabilities.filter(avail => {
    const availDate = parseISO(avail.date);
    return isWithinInterval(availDate, {
      start: weekStart,
      end: addDays(weekStart, 6)
    }) && weekDays.some(day => format(day, 'yyyy-MM-dd') === avail.date);
  });

  // Get visible professionals with their availabilities
  const visibleProfessionalsData = professionals
    .filter(prof => visibleProfessionals.includes(prof.id))
    .map(prof => ({
      ...prof,
      availabilities: weekAvailabilities.filter(avail => avail.professional === prof.id)
    }));

  // Calculate position and width of an availability block for a specific day
  const calculatePositioning = (startTime: string, endTime: string, date: string) => {
    // Find the date in our filtered working days array
    const dayIndex = weekDays.findIndex(day => 
      format(day, 'yyyy-MM-dd') === date
    );
    
    if (dayIndex === -1) return null; // Not in this week's days
    
    const { minTime, maxTime } = businessSchedule.getTimeRangeForDate(date);
    const startMinutes = timeToMinutes(minTime);
    const endMinutes = timeToMinutes(maxTime);
    const totalMinutes = endMinutes - startMinutes;
    
    const slotStartMinutes = timeToMinutes(startTime) - startMinutes;
    const slotEndMinutes = timeToMinutes(endTime) - startMinutes;
    
    // Calculate position as percentage of total minutes
    const left = (slotStartMinutes / totalMinutes) * 100;
    const width = ((slotEndMinutes - slotStartMinutes) / totalMinutes) * 100;
    
    return {
      dayIndex,
      left: `${left}%`,
      width: `${width}%`
    };
  };

  // Handle click on timeline to create new availability
  const handleTimelineClick = (professionalId: string, professionalName: string, date: string, time: string) => {
    // Calculate a default end time (1 hour after start)
    const startTimeMinutes = timeToMinutes(time);
    const endTimeMinutes = startTimeMinutes + 60;
    const endHours = Math.floor(endTimeMinutes / 60).toString().padStart(2, "0");
    const endMinutes = (endTimeMinutes % 60).toString().padStart(2, "0");
    const endTime = `${endHours}:${endMinutes}`;
    
    setCurrentAvailability(undefined);
    setIsEditing(false);
    setSelectedDate(date);
    setSelectedProfessionalId(professionalId);
    setSelectedProfessionalName(professionalName);
    
    // Initialize the new availability with the clicked time
    const newAvailability: ProfessionalAvailability = {
      id: '',
      professional: professionalId,
      professionalName: professionalName,
      date: date,
      start_time: time,
      end_time: endTime
    };
    
    setCurrentAvailability(newAvailability);
    setDialogOpen(true);
  };
  
  // Handle click on existing availability to edit
  const handleAvailabilityClick = (availability: ProfessionalAvailability) => {
    setCurrentAvailability(availability);
    setIsEditing(true);
    setSelectedDate(availability.date);
    setSelectedProfessionalId(availability.professional);
    setSelectedProfessionalName(availability.professionalName || '');
    setDialogOpen(true);
  };
  
  // Handle save of new or updated availability
  const handleSaveAvailability = (availability: ProfessionalAvailability) => {
    if (isEditing && onAvailabilityUpdate) {
      onAvailabilityUpdate(availability);
      toast.success("Disponibilidad actualizada correctamente");
    } else if (onAvailabilityCreate) {
      onAvailabilityCreate(availability);
      toast.success("Disponibilidad creada correctamente");
    }
  };
  
  // Handle delete availability
  const handleDeleteAvailability = (id: string) => {
    if (onAvailabilityDelete) {
      onAvailabilityDelete(id);
      toast.success("Disponibilidad eliminada correctamente");
    }
  };

  return (
    <div className="mt-4 relative overflow-x-auto">
      {/* Week days header showing only business days */}
      <TimeScheduleHeader weekDays={allWeekDays} businessSchedule={businessSchedule} />
      
      {/* Common time scale for all professionals */}
      <div className="flex sticky top-[60px] z-10 bg-white/95 border-b">
        <div className="w-48 flex-shrink-0"></div>
        <div className="flex-1">
          <TimeScale weekDays={allWeekDays} businessSchedule={businessSchedule} />
        </div>
      </div>

      {/* Timeline for each professional */}
      {visibleProfessionalsData.map((prof) => (
        <div key={prof.id} className="flex mb-4">
          {/* Professional name */}
          <div className="w-48 flex-shrink-0 p-2 text-sm font-medium border-r flex items-center">
            {prof.name}
          </div>
          
          {/* Timeline grid for the week - only showing business days */}
          <div className="flex-1 grid relative" style={{ 
            gridTemplateColumns: `repeat(${weekDays.length}, 1fr)` 
          }}>
            {weekDays.map((day, dayIndex) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const { minTime, maxTime } = businessSchedule.getTimeRangeForDate(dateStr);
              
              return (
                <div 
                  key={dayIndex} 
                  className="relative h-16 border-r last:border-r-0"
                >
                  {/* Background div for the timeline */}
                  <div className="absolute inset-0 bg-gray-50" />
                  
                  {/* Rendered availabilities for this day */}
                  {prof.availabilities
                    .filter(avail => avail.date === dateStr)
                    .map(avail => {
                      const positioning = calculatePositioning(avail.start_time, avail.end_time, avail.date);
                      if (!positioning) return null;
                      
                      return (
                        <div 
                          key={avail.id}
                          className="absolute bg-blue-500 text-white text-xs p-1 rounded opacity-90 hover:opacity-100 cursor-pointer flex items-center justify-between group"
                          style={{ 
                            width: positioning.width, 
                            left: positioning.left,
                            top: '4px',
                            bottom: '4px',
                            zIndex: 10
                          }}
                          onClick={() => handleAvailabilityClick(avail)}
                        >
                          <div className="flex items-center gap-1 overflow-hidden">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                              {avail.start_time}-{avail.end_time}
                            </span>
                          </div>
                          
                          <div className="hidden group-hover:flex items-center">
                            <button 
                              className="p-1 hover:bg-blue-600 rounded-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAvailabilityClick(avail);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button 
                              className="p-1 hover:bg-blue-600 rounded-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAvailability(avail.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  }
                  
                  {/* Clickable area for creating new availability */}
                  <div 
                    className="absolute inset-0 cursor-pointer z-5" 
                    onClick={(e) => {
                      // Only handle click if target is this div (not a child element)
                      if (e.currentTarget === e.target) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const relativeX = e.clientX - rect.left;
                        const percentX = relativeX / rect.width;
                        
                        // Calculate time based on click position
                        const startMinutes = timeToMinutes(minTime);
                        const endMinutes = timeToMinutes(maxTime);
                        const totalMinutes = endMinutes - startMinutes;
                        
                        const minuteOffset = totalMinutes * percentX;
                        const clickMinutes = startMinutes + minuteOffset;
                        
                        // Round to nearest 30-minute interval
                        const roundedMinutes = Math.round(clickMinutes / 30) * 30;
                        const hours = Math.floor(roundedMinutes / 60).toString().padStart(2, "0");
                        const minutes = (roundedMinutes % 60).toString().padStart(2, "0");
                        const time = `${hours}:${minutes}`;
                        
                        handleTimelineClick(prof.id, prof.name, dateStr, time);
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Dialog for creating/editing availability */}
      <AvailabilityDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveAvailability}
        availability={currentAvailability}
        date={selectedDate}
        professionalId={selectedProfessionalId}
        professionalName={selectedProfessionalName}
        isEditing={isEditing}
      />
    </div>
  );
};

// Create Slots from Pattern Dialog
const CreateFromPatternDialog: React.FC<{
  patterns: AvailabilityPattern[];
  onCreateSlots: (patternId: string, dateRange: { from: Date, to: Date }) => void;
}> = ({ patterns, onCreateSlots }) => {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | { from: Date; to?: Date } | undefined>({
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
          <Input 
            type="date"
            value={dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : ""}
            onChange={(e) => setDateRange({ from: new Date(e.target.value), to: dateRange?.to })}
          />
        </div>

        <div className="space-y-2">
          <Label>Fecha fin</Label>
          <Input 
            type="date"
            value={dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : ""}
            onChange={(e) => setDateRange({ from: dateRange?.from || new Date(), to: new Date(e.target.value) })}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          disabled={!selectedPattern || !dateRange?.from || !dateRange?.to}
          onClick={() => {
            if (selectedPattern && dateRange?.from && dateRange?.to) {
              onCreateSlots(selectedPattern, { from: dateRange.from, to: dateRange.to });
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
const PatternForm: React.FC<{
  pattern?: AvailabilityPattern;
  professionals: { id: string; name: string }[];
  onSave: (pattern: Partial<AvailabilityPattern>) => void;
}> = ({ pattern, professionals, onSave }) => {
  const [name, setName] = useState(pattern?.name || "");
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(pattern?.professional || null);
  const [startDate, setStartDate] = useState<Date | undefined>(pattern?.start_date ? parseISO(pattern.start_date) : new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(pattern?.end_date ? parseISO(pattern.end_date) : addDays(new Date(), 30));
  const [startTime, setStartTime] = useState(pattern?.start_time || "09:00");
  const [endTime, setEndTime] = useState(pattern?.end_time || "18:00");
  
  const [daysOfWeek, setDaysOfWeek] = useState<{ [key: number]: boolean }>({
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
          <Input 
            type="date"
            value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Fecha fin validez</Label>
          <Input 
            type="date"
            value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
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

// Main Turnos component
const Turnos = () => {
  const [activeTab, setActiveTab] = useState("turnos");
  const [weekStart, setWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [availabilities, setAvailabilities] = useState<ProfessionalAvailability[]>(generateMockAvailability());
  const [patterns, setPatterns] = useState<AvailabilityPattern[]>(generateMockPatterns());
  const [createPatternsOpen, setCreatePatternsOpen] = useState(false);
  const [createPatternOpen, setCreatePatternOpen] = useState(false);
  const [editPatternId, setEditPatternId] = useState<string | null>(null);
  const [apiData, setApiData] = useState<BusinessScheduleData>(mockApiResponse);
  
  // Create business schedule from API data
  const businessSchedule = new BusinessSchedule(apiData);
  
  // Mock professionals data
  const professionals = [
    { id: "prof1", name: "María García" },
    { id: "prof2", name: "Juan Pérez" },
    { id: "prof3", name: "Sofia Rodríguez" }
  ];
  
  const [visibleProfessionals, setVisibleProfessionals] = useState<string[]>(
    professionals.map(p => p.id)
  );

  useEffect(() => {
    // Simulate API call to get the data
    // In a real app, you would call your API here
    setApiData(mockApiResponse);
    
    // Convert shifts to availabilities
    const apiAvailabilities = convertShiftsToAvailabilities(mockApiResponse.shifts);
    setAvailabilities([...generateMockAvailability(), ...apiAvailabilities]);
  }, []);

  const handlePreviousWeek = () => {
    setWeekStart(subWeeks(weekStart, 1));
  };

  const handleNextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1));
  };

  const toggleProfessionalVisibility = (id: string) => {
    if (visibleProfessionals.includes(id)) {
      setVisibleProfessionals(visibleProfessionals.filter(p => p !== id));
    } else {
      setVisibleProfessionals([...visibleProfessionals, id]);
    }
  };

  const handleSavePattern = (patternData: Partial<AvailabilityPattern>) => {
    if (patternData.id) {
      // Update existing pattern
      setPatterns(patterns.map(p => 
        p.id === patternData.id ? { ...p, ...patternData } as AvailabilityPattern : p
      ));
    } else {
      // Create new pattern
      const newPattern: AvailabilityPattern = {
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

  const handleDeletePattern = (id: string) => {
    setPatterns(patterns.filter(p => p.id !== id));
  };

  const handleCreateSlotsFromPattern = (patternId: string, dateRange: { from: Date, to: Date }) => {
    const pattern = patterns.find(p => p.id === patternId);
    if (!pattern) return;
    
    const newAvailabilities: ProfessionalAvailability[] = [];
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
    toast.success("Turnos creados correctamente");
  };

  const handleCreateAvailability = (newAvail: ProfessionalAvailability) => {
    const generatedId = `avail-${newAvail.professional}-${newAvail.date}-${Date.now()}`;
    const availabilityWithId = { ...newAvail, id: generatedId };
    setAvailabilities([...availabilities, availabilityWithId]);
  };
  
  const handleUpdateAvailability = (updated: ProfessionalAvailability) => {
    setAvailabilities(availabilities.map(avail => 
      avail.id === updated.id ? updated : avail
    ));
  };
  
  const handleDeleteAvailability = (id: string) => {
    setAvailabilities(availabilities.filter(avail => avail.id !== id));
  };

  return (
    <AppSidebarWrapper>
      <div className="bg-gray-50 flex-1">
        <div className="container px-4 py-8 mx-auto">
          <Tabs 
            defaultValue={activeTab} 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <h1 className="text-2xl font-bold">Turnos</h1>
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
                  
                  <div className="min-w-[240px] text-center">
                    <span className="text-sm font-medium">
                      {format(weekStart, "'Semana del' d 'de' MMMM", { locale: es })}
                    </span>
                  </div>
                  
                  <Button variant="outline" onClick={handleNextWeek}>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Dialog open={createPatternOpen} onOpenChange={setCreatePatternOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
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

                <CardContent className="overflow-x-auto">
                  <TimelineView 
                    availabilities={availabilities}
                    weekStart={weekStart}
                    visibleProfessionals={visibleProfessionals}
                    professionals={professionals}
                    businessSchedule={businessSchedule}
                    onAvailabilityCreate={handleCreateAvailability}
                    onAvailabilityUpdate={handleUpdateAvailability}
                    onAvailabilityDelete={handleDeleteAvailability}
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

export default Turnos;
