
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSlot } from "@/components/calendar/TimeSlot";

// Mock data for demonstration
const generateTimeSlots = (date: Date) => {
  const slots = [];
  const startHour = 9;
  const endHour = 19;
  
  for (let hour = startHour; hour <= endHour; hour++) {
    // Morning slot
    slots.push({
      id: `${date.toISOString()}-${hour}-00`,
      time: `${hour}:00`,
      reserved: Math.random() > 0.7,
      clientName: Math.random() > 0.7 ? "Cliente Ejemplo" : null,
      service: Math.random() > 0.7 ? "Consulta" : null,
    });
    
    // Afternoon slot
    slots.push({
      id: `${date.toISOString()}-${hour}-30`,
      time: `${hour}:30`,
      reserved: Math.random() > 0.7,
      clientName: Math.random() > 0.7 ? "Cliente Ejemplo" : null,
      service: Math.random() > 0.7 ? "Consulta" : null,
    });
  }
  
  return slots;
};

interface DayCalendarProps {
  selectedDate: Date;
}

export const DayCalendar: React.FC<DayCalendarProps> = ({ selectedDate }) => {
  const timeSlots = generateTimeSlots(selectedDate);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {timeSlots.map((slot) => (
            <TimeSlot key={slot.id} slot={slot} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
