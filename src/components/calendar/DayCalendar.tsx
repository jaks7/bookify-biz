
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSlot } from "@/components/calendar/TimeSlot";
import { CalendarDays, FileCheck } from "lucide-react";

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
  const reservedCount = timeSlots.filter(slot => slot.reserved).length;
  const totalSlots = timeSlots.length;
  const availabilityPercentage = Math.round(((totalSlots - reservedCount) / totalSlots) * 100);
  
  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-bookify-500" />
            <span className="capitalize">{format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}</span>
          </div>
          <div className="flex items-center text-sm">
            <FileCheck className="h-4 w-4 mr-1 text-bookify-500" />
            <span>{availabilityPercentage}% disponible</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-3">
          {timeSlots.map((slot) => (
            <TimeSlot key={slot.id} slot={slot} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
