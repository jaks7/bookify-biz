
import React from 'react';
import { format, parse } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  step?: number; // Minutes between options (default: 30)
  label?: string;
  id?: string;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({ 
  value, 
  onChange, 
  step = 30, 
  label, 
  id,
  className 
}) => {
  // Generate time options from 00:00 to 23:59 with specified step
  const generateTimeOptions = () => {
    const options: string[] = [];
    const totalMinutesInDay = 24 * 60;
    
    for (let minutes = 0; minutes < totalMinutesInDay; minutes += step) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      options.push(
        `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
      );
    }
    
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select value={value} onValueChange={onChange} id={id}>
        <SelectTrigger className={cn("w-full", className)}>
          <SelectValue placeholder="Seleccionar hora" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {timeOptions.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
