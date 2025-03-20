
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, User, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Professional, Appointment } from "@/types/professional";

interface ProfessionalTimelineProps {
  professional: Professional;
  selectedDate: Date;
}

export const ProfessionalTimeline: React.FC<ProfessionalTimelineProps> = ({
  professional,
  selectedDate,
}) => {
  if (professional.isWorking === false) return null;

  // Generate time slots from 9:00 to 19:00 with 30 minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    const hours = ["09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];
    
    for (const hour of hours) {
      for (const minute of ["00", "30"]) {
        const time = `${hour}:${minute}`;
        const appointment = professional.appointments?.find(
          (apt) => apt.time === time
        );
        
        slots.push({
          id: `${selectedDate.toISOString()}-${time}`,
          time,
          reserved: !!appointment,
          appointment,
        });
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();
  
  // Check if the given time is within working hours
  const isWithinWorkingHours = (timeString: string) => {
    if (!professional.workingHours) return false;
    return professional.workingHours.some(({ start, end }) => {
      return timeString >= start && timeString <= end;
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="border-gray-200 shadow-sm mb-4">
      <CardHeader className="py-3 px-4 bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-md flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
              {getInitials(professional.name)}
            </AvatarFallback>
          </Avatar>
          {professional.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-2">
          {timeSlots.map((slot) => {
            const isAvailable = isWithinWorkingHours(slot.time);
            return (
              <div 
                key={slot.id}
                className={cn(
                  "p-3 rounded-lg border flex items-center justify-between transition-all",
                  slot.reserved 
                    ? "bg-rose-50 border-rose-200" 
                    : isAvailable 
                      ? "bg-emerald-50 border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                      : "bg-gray-100 border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-1.5 rounded-full",
                    slot.reserved ? "bg-rose-100 text-rose-600" : 
                    isAvailable ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-500"
                  )}>
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{slot.time}</div>
                    {slot.appointment && (
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <User className="h-3 w-3 mr-1" /> 
                        {slot.appointment.clientName}
                        <span className="mx-1">•</span>
                        <Bookmark className="h-3 w-3 mr-1" /> 
                        {slot.appointment.service}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  {slot.reserved ? (
                    <div className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                      <XCircle className="h-3 w-3 mr-1" />
                      Reservado
                    </div>
                  ) : isAvailable ? (
                    <div className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Disponible
                    </div>
                  ) : (
                    <div className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">
                      Fuera de horario
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
