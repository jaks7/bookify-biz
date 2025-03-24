
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker } from "@/components/calendar/TimePicker";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Clock, Plus, Trash } from "lucide-react";
import { BusinessHours, TimeRange } from "@/types/availability";

// Days of the week
const daysOfWeek = [
  { value: "1", label: "Lun" },
  { value: "2", label: "Mar" },
  { value: "3", label: "Mié" },
  { value: "4", label: "Jue" },
  { value: "5", label: "Vie" },
  { value: "6", label: "Sáb" },
  { value: "0", label: "Dom" },
];

interface BusinessHoursEditorProps {
  businessHours: BusinessHours;
  onChange: (hours: BusinessHours) => void;
}

const BusinessHoursEditor: React.FC<BusinessHoursEditorProps> = ({ 
  businessHours, 
  onChange 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState("weekdays");
  
  // Get days that have any hours set
  const activeDays = Object.keys(businessHours).filter(
    day => businessHours[day]?.length > 0
  );

  const handleDayToggle = (values: string[]) => {
    const newHours = { ...businessHours };
    
    // Remove any days that were deselected
    for (const day of Object.keys(newHours)) {
      if (!values.includes(day)) {
        newHours[day] = [];
      }
    }
    
    // Add empty time ranges for newly selected days
    for (const day of values) {
      if (!newHours[day] || newHours[day].length === 0) {
        newHours[day] = [{ start: "09:00", end: "18:00" }];
      }
    }
    
    onChange(newHours);
  };

  const handleAddTimeRange = (day: string) => {
    const newHours = { ...businessHours };
    if (!newHours[day]) {
      newHours[day] = [];
    }
    newHours[day].push({ start: "09:00", end: "18:00" });
    onChange(newHours);
  };

  const handleRemoveTimeRange = (day: string, index: number) => {
    const newHours = { ...businessHours };
    if (newHours[day] && newHours[day].length > 1) {
      newHours[day].splice(index, 1);
      onChange(newHours);
    }
  };

  const handleTimeChange = (day: string, index: number, field: "start" | "end", value: string) => {
    const newHours = { ...businessHours };
    if (!newHours[day]) {
      newHours[day] = [{ start: "09:00", end: "18:00" }];
    }
    newHours[day][index][field] = value;
    onChange(newHours);
  };
  
  const applyTemplate = (template: string) => {
    let newHours: BusinessHours = {};
    
    if (template === "weekdays") {
      // Monday to Friday, 9-14 and 17-20
      for (let i = 1; i <= 5; i++) {
        newHours[i.toString()] = [
          { start: "09:00", end: "14:00" },
          { start: "17:00", end: "20:00" }
        ];
      }
      // Saturday, 9-14
      newHours["6"] = [{ start: "09:00", end: "14:00" }];
    } else if (template === "continuous") {
      // Monday to Friday, 9-18
      for (let i = 1; i <= 5; i++) {
        newHours[i.toString()] = [{ start: "09:00", end: "18:00" }];
      }
    } else if (template === "weekend") {
      // Monday to Sunday
      for (let i = 0; i <= 6; i++) {
        newHours[i.toString()] = [{ start: "10:00", end: "20:00" }];
      }
    }
    
    onChange(newHours);
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
        <CardTitle className="text-md flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          Horario comercial
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Templates selector */}
        <div className="mb-4">
          <Label className="mb-2 block">Plantillas rápidas</Label>
          <div className="flex gap-2">
            <Select 
              value={selectedTemplate} 
              onValueChange={setSelectedTemplate}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecciona una plantilla" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekdays">L-V con horario partido + Sáb mañana</SelectItem>
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
        
        <Separator />
        
        {/* Days of week selector */}
        <div className="space-y-2">
          <Label className="mb-2 block">Días con horario comercial</Label>
          <ToggleGroup 
            type="multiple" 
            className="justify-start"
            value={activeDays}
            onValueChange={handleDayToggle}
          >
            {daysOfWeek.map((day) => (
              <ToggleGroupItem 
                key={day.value} 
                value={day.value}
                aria-label={day.label}
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:font-bold"
              >
                {day.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        
        <Separator />
        
        {/* Time ranges for each day */}
        <div className="space-y-4">
          {daysOfWeek.filter(day => 
            businessHours[day.value] && businessHours[day.value].length > 0
          ).map((day) => (
            <div key={day.value} className="border rounded-md p-3">
              <div className="font-medium mb-2">{day.label}</div>
              {businessHours[day.value]?.map((timeRange, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <div>
                      <Label className="text-xs text-gray-500">Hora inicio</Label>
                      <TimePicker
                        value={timeRange.start}
                        onChange={(value) => 
                          handleTimeChange(day.value, index, "start", value)
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Hora fin</Label>
                      <TimePicker
                        value={timeRange.end}
                        onChange={(value) => 
                          handleTimeChange(day.value, index, "end", value)
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                  {businessHours[day.value].length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveTimeRange(day.value, index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-1"
                onClick={() => handleAddTimeRange(day.value)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Añadir franja horaria
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessHoursEditor;
