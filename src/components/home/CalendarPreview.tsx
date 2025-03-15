
import React from "react";
import { format, getDaysInMonth, startOfMonth, getDay, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

export const CalendarPreview = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // First day of the month
  const firstDayOfMonth = startOfMonth(new Date(currentYear, currentMonth));
  // Day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeekIndex = getDay(firstDayOfMonth);
  // Number of days in the month
  const daysInMonth = getDaysInMonth(new Date(currentYear, currentMonth));
  
  // Create an array with the days of the month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Array for weekday headers
  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  
  // Generate calendar grid with empty cells for the days before the first day of the month
  const calendarGrid = [];
  
  // Convert from Sunday-based to Monday-based (0 = Monday, 6 = Sunday)
  const adjustedFirstDay = firstDayOfWeekIndex === 0 ? 6 : firstDayOfWeekIndex - 1;
  
  // Add empty cells for the days before the first day of the month
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarGrid.push(null);
  }
  
  // Add the days of the month
  days.forEach(day => {
    calendarGrid.push(day);
  });
  
  // Get some random days for appointments (for demo purposes)
  const appointmentDays = [5, 12, 15, 20, 25].map(day => new Date(currentYear, currentMonth, day));
  
  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="bg-gray-100 rounded-t-xl flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-600" />
          <CardTitle className="text-lg">
            {format(today, "MMMM yyyy", { locale: es })}
          </CardTitle>
        </div>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday headers */}
          {weekDays.map((day, index) => (
            <div key={`header-${index}`} className="text-center py-2 text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Calendar grid */}
          {calendarGrid.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="p-2 text-center"></div>;
            }
            
            // Check if this day has an appointment
            const date = new Date(currentYear, currentMonth, day);
            const hasAppointment = appointmentDays.some(
              appointmentDay => appointmentDay.getDate() === day
            );
            
            // Determine if it's today
            const isToday = today.getDate() === day && 
                            today.getMonth() === currentMonth && 
                            today.getFullYear() === currentYear;
            
            return (
              <div 
                key={`day-${index}`} 
                className={cn(
                  "relative h-10 flex flex-col items-center justify-center rounded-md text-sm",
                  isToday && "bg-primary/10 font-bold",
                  hasAppointment && "font-medium"
                )}
              >
                <span>{day}</span>
                {hasAppointment && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary"></span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
