
import React from "react";
import { cn } from "@/lib/utils";
import { Booking } from "@/types/booking";

export interface ProfessionalTimelineProps {
  time?: string;
  booking?: Booking | undefined;
  isAvailable: boolean;
  onAddBooking: () => void;
  onEditBooking: (booking: Booking) => void;
}

export const ProfessionalTimeline: React.FC<ProfessionalTimelineProps> = ({
  time,
  booking,
  isAvailable,
  onAddBooking,
  onEditBooking,
}) => {
  const handleClick = () => {
    if (booking) {
      onEditBooking(booking);
    } else if (isAvailable) {
      onAddBooking();
    }
  };

  return (
    <div 
      className={cn(
        "h-10 border-l relative",
        booking 
          ? "bg-blue-50 cursor-pointer" 
          : isAvailable 
            ? "hover:bg-green-50 cursor-pointer" 
            : "bg-gray-50"
      )}
      onClick={handleClick}
    >
      {booking && (
        <div className="absolute inset-0 p-1 overflow-hidden">
          <div className="bg-blue-100 text-blue-800 text-xs rounded h-full flex items-center px-2 truncate">
            {booking.client_name || booking.service_name || "Reservado"}
          </div>
        </div>
      )}
    </div>
  );
};
