
import React, { useState } from "react";
import { format, parseISO, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import { BookingDialog } from "./BookingDialog";
import { TimeSlot } from "./TimeSlot";
import { ProfessionalTimeline } from "./ProfessionalTimeline";
import { Skeleton } from "@/components/ui/skeleton";
import { DailyScheduleData } from "@/types/professional";
import { Booking, BookingFormData } from "@/types/booking";
import { Service } from "@/types/service";

// Generate time slots from 09:00 to 21:00 in 15-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 21; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      slots.push(time);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

export interface DayCalendarProps {
  selectedDate: Date;
  schedule: DailyScheduleData;
  loading: boolean;
}

export const DayCalendar: React.FC<DayCalendarProps> = ({ selectedDate, schedule, loading }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined); // Add state for selected time
  
  // Mock data for services
  const mockServices: Service[] = [
    { id: 1, name: "Corte de pelo", price: 15, duration: 30 },
    { id: 2, name: "Tinte", price: 40, duration: 90 },
    { id: 3, name: "Manicura", price: 25, duration: 45 },
  ];
  
  const handleAddBooking = (time: string, professionalId?: number) => {
    setSelectedBooking(undefined);
    setIsEditing(false);
    setSelectedTime(time); // Set the selected time
    setIsDialogOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditing(true);
    setSelectedTime(undefined); // No specific time for editing
    setIsDialogOpen(true);
  };

  const handleSaveBooking = (data: BookingFormData) => {
    console.log("Saving booking:", data);
    // In a real app, this would call an API to save the booking
    setIsDialogOpen(false);
  };

  // Format the date for display
  const formattedDate = format(selectedDate, "EEEE, d 'de' MMMM", { locale: es });

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex space-x-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 flex-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium capitalize">{formattedDate}</h2>
      
      <div className="border rounded-md">
        <div className="grid grid-cols-[100px_1fr] border-b bg-gray-50">
          <div className="p-2 font-medium text-gray-500 text-sm">Hora</div>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${schedule.professionals.length}, 1fr)` }}>
            {schedule.professionals.map(professional => (
              <div 
                key={professional.professional_id} 
                className="p-2 font-medium text-sm border-l text-center"
              >
                {professional.name}
              </div>
            ))}
          </div>
        </div>
        
        <div className="divide-y">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-[100px_1fr]">
              <TimeSlot time={time} />
              <div className="grid" style={{ gridTemplateColumns: `repeat(${schedule.professionals.length}, 1fr)` }}>
                {schedule.professionals.map(professional => {
                  // Find any booking for this professional at this time
                  const booking = schedule.bookings.find(b => {
                    if (b.professional_id !== professional.professional_id) return false;
                    
                    const startTime = b.datetime_start.split('T')[1].substring(0, 5);
                    const endTime = b.datetime_end.split('T')[1].substring(0, 5);
                    
                    return time >= startTime && time < endTime;
                  });
                  
                  // Check if professional is available at this time
                  const isAvailable = professional.availabilities?.some(availability => {
                    const startTime = availability.datetime_start.split('T')[1].substring(0, 5);
                    const endTime = availability.datetime_end.split('T')[1].substring(0, 5);
                    
                    return time >= startTime && time < endTime;
                  }) ?? false;
                  
                  return (
                    <ProfessionalTimeline
                      key={professional.professional_id}
                      time={time}
                      booking={booking}
                      isAvailable={isAvailable}
                      onAddBooking={() => handleAddBooking(time, professional.professional_id)}
                      onEditBooking={handleEditBooking}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <BookingDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveBooking}
        booking={selectedBooking}
        date={format(selectedDate, "yyyy-MM-dd")}
        professionals={schedule.professionals}
        services={mockServices}
        isEditing={isEditing}
        selectedTime={selectedTime}
      />
    </div>
  );
};
