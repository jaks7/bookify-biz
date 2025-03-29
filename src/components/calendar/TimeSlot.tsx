
import React from "react";
import { CheckCircle, XCircle, Clock, User, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimeSlotProps {
  time: string;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ time }) => {
  return (
    <div className="p-2 font-medium text-gray-500 text-sm border-r">
      {time}
    </div>
  );
};
