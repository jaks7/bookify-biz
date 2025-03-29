
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  step?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
}

// Generate time options in 15 (or custom) minute increments from 00:00 to 23:45
const generateTimeOptions = (step: number = 15) => {
  const options: string[] = [];
  const totalMinutesInDay = 24 * 60;
  
  for (let minutes = 0; minutes < totalMinutesInDay; minutes += step) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMins = mins.toString().padStart(2, '0');
    
    options.push(`${formattedHours}:${formattedMins}`);
  }
  
  return options;
};

export const TimePicker: React.FC<TimePickerProps> = ({ 
  value, 
  onChange, 
  step = 15,
  disabled = false,
  className,
  label
}) => {
  const timeOptions = generateTimeOptions(step);
  
  return (
    <Select 
      value={value} 
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <SelectValue placeholder={label || "Seleccionar hora"} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {timeOptions.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
