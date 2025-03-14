
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Simplified mock data for the preview
const timeSlots = [
  { id: "1", time: "9:00", reserved: false },
  { id: "2", time: "9:30", reserved: true, clientName: "María García", service: "Consulta" },
  { id: "3", time: "10:00", reserved: false },
  { id: "4", time: "10:30", reserved: true, clientName: "Juan López", service: "Revisión" },
  { id: "5", time: "11:00", reserved: false },
  { id: "6", time: "11:30", reserved: false },
];

export const AgendaPreview = () => {
  const today = new Date();
  
  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="bg-gray-100 rounded-t-xl flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-600" />
          <CardTitle className="text-lg">
            {format(today, "EEEE, d 'de' MMMM", { locale: es })}
          </CardTitle>
        </div>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-2">
          {timeSlots.map((slot) => (
            <div 
              key={slot.id}
              className={cn(
                "p-3 rounded-md border flex items-center justify-between",
                slot.reserved 
                  ? "bg-rose-50 border-rose-200" 
                  : "bg-emerald-50 border-emerald-200"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="text-gray-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="font-medium">{slot.time}</div>
              </div>
              
              <div className="flex items-center gap-2">
                {slot.reserved ? (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-4">
                      {slot.clientName} - {slot.service}
                    </span>
                    <XCircle className="h-5 w-5 text-rose-500" />
                  </div>
                ) : (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
