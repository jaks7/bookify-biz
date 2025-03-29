
import React from "react";
import { CheckCircle, XCircle, Clock, User, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slot {
  id: string;
  time: string;
  reserved: boolean;
  clientName: string | null;
  service: string | null;
}

interface TimeSlotProps {
  slot: Slot;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ slot }) => {
  return (
    <div 
      className={cn(
        "p-4 rounded-lg border flex items-center justify-between shadow-sm transition-all",
        slot.reserved 
          ? "bg-rose-50 border-rose-200 hover:bg-rose-100" 
          : "bg-emerald-50 border-emerald-200 hover:bg-emerald-100 cursor-pointer"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-full",
          slot.reserved ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
        )}>
          <Clock className="h-4 w-4" />
        </div>
        <div>
          <div className="font-medium text-gray-800">{slot.time}</div>
          {slot.reserved && (
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <User className="h-3 w-3 mr-1" /> 
              {slot.clientName}
              {slot.service && (
                <>
                  <span className="mx-1">•</span>
                  <Bookmark className="h-3 w-3 mr-1" /> 
                  {slot.service}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        {slot.reserved ? (
          <div className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <XCircle className="h-4 w-4 mr-1" />
            Reservado
          </div>
        ) : (
          <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Disponible
          </div>
        )}
      </div>
    </div>
  );
};
