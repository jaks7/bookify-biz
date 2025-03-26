
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { BusinessHours, TimeRange } from '@/types/availability';

interface BusinessHoursEditorProps {
  businessHours: BusinessHours;
  onChange: (updatedHours: BusinessHours) => void;
}

const daysOfWeek = [
  { id: '1', name: 'Lunes' },
  { id: '2', name: 'Martes' },
  { id: '3', name: 'Miércoles' },
  { id: '4', name: 'Jueves' },
  { id: '5', name: 'Viernes' },
  { id: '6', name: 'Sábado' },
  { id: '7', name: 'Domingo' },
];

const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

export function BusinessHoursEditor({ businessHours, onChange }: BusinessHoursEditorProps) {
  const [activeWorkingDays, setActiveWorkingDays] = useState<string[]>(
    Object.keys(businessHours).filter(day => businessHours[day]?.length > 0)
  );

  const handleDayToggle = (dayId: string, isActive: boolean) => {
    const updatedDays = isActive
      ? [...activeWorkingDays, dayId]
      : activeWorkingDays.filter(d => d !== dayId);
    
    setActiveWorkingDays(updatedDays);
    
    // Update business hours
    const updatedHours = { ...businessHours };
    
    if (!isActive) {
      // Remove the day if toggled off
      updatedHours[dayId] = [];
    } else if (!updatedHours[dayId] || updatedHours[dayId].length === 0) {
      // Add default hours if day is toggled on
      updatedHours[dayId] = [{ start: '09:00', end: '18:00' }];
    }
    
    onChange(updatedHours);
  };

  const handleAddTimeRange = (dayId: string) => {
    const updatedHours = { ...businessHours };
    if (!updatedHours[dayId]) {
      updatedHours[dayId] = [];
    }
    updatedHours[dayId] = [
      ...updatedHours[dayId],
      { start: '09:00', end: '18:00' }
    ];
    onChange(updatedHours);
  };

  const handleRemoveTimeRange = (dayId: string, rangeIndex: number) => {
    const updatedHours = { ...businessHours };
    updatedHours[dayId] = updatedHours[dayId].filter((_, i) => i !== rangeIndex);
    onChange(updatedHours);
  };

  const handleTimeChange = (dayId: string, rangeIndex: number, field: 'start' | 'end', value: string) => {
    const updatedHours = { ...businessHours };
    if (!updatedHours[dayId]) {
      updatedHours[dayId] = [];
    }
    updatedHours[dayId] = updatedHours[dayId].map((range, i) => 
      i === rangeIndex ? { ...range, [field]: value } : range
    );
    onChange(updatedHours);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horario Comercial</CardTitle>
        <CardDescription>Establece los días y horarios en los que tu negocio está abierto</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-3 mb-4">
          {daysOfWeek.map(day => (
            <div
              key={day.id}
              className={`
                px-3 py-2 rounded-full border border-gray-200 cursor-pointer transition-colors
                ${activeWorkingDays.includes(day.id) 
                  ? 'bg-primary text-primary-foreground font-medium' 
                  : 'bg-background hover:bg-muted'}
              `}
              onClick={() => handleDayToggle(day.id, !activeWorkingDays.includes(day.id))}
            >
              {day.name}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {daysOfWeek
            .filter(day => activeWorkingDays.includes(day.id))
            .map(day => (
              <div key={day.id} className="space-y-3 p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{day.name}</h3>
                </div>
                
                {(businessHours[day.id] || []).map((timeRange, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Select
                      value={timeRange.start}
                      onValueChange={(value) => handleTimeChange(day.id, index, 'start', value)}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder="Inicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map(time => (
                          <SelectItem key={`start-${time}`} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <span>a</span>
                    
                    <Select
                      value={timeRange.end}
                      onValueChange={(value) => handleTimeChange(day.id, index, 'end', value)}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder="Fin" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map(time => (
                          <SelectItem key={`end-${time}`} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTimeRange(day.id, index)}
                      disabled={(businessHours[day.id] || []).length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleAddTimeRange(day.id)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Añadir franja horaria
                </Button>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default BusinessHoursEditor;
