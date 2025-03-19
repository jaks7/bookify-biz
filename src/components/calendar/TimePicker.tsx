
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, label, className }) => {
  // Generate time options from 00:00 to 23:30 in 30 minute increments
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hourStr = hour.toString().padStart(2, "0");
      const minuteStr = minute.toString().padStart(2, "0");
      timeOptions.push(`${hourStr}:${minuteStr}`);
    }
  }

  return (
    <div className={className}>
      {label && <Label className="mb-1 block">{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-24">
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
