
import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
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
        "p-3 rounded-md border flex items-center justify-between",
        slot.reserved 
          ? "bg-rose-50 border-rose-200" 
          : "bg-emerald-50 border-emerald-200 hover:bg-emerald-100 cursor-pointer"
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
  );
};
