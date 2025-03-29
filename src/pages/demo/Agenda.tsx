
import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, List, Grid } from "lucide-react";
import { DayCalendar } from "@/components/calendar/DayCalendar";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";
import { DailyScheduleData } from "@/types/professional";
import { BookingDialog } from "@/components/calendar/BookingDialog";
import { BookingFormData } from "@/types/booking";
import { toast } from "sonner";

// Mock data in the format expected by the DayCalendar component
const mockScheduleData: DailyScheduleData = {
  date: "2025-03-27",
  business_hours: [
    {
      datetime_start: "2025-03-27T09:00",
      datetime_end: "2025-03-27T17:00"
    }
  ],
  professionals: [
    {
      professional_id: 1,
      name: "Gema",
      surnames: null,
      fullname: "Gema None",
      availabilities: [
        {
          datetime_start: "2025-03-27T09:00:00Z",
          datetime_end: "2025-03-27T18:00:00Z"
        }
      ]
    },
    {
      professional_id: 2,
      name: "Ana",
      surnames: null,
      fullname: "Ana None",
      availabilities: []
    }
  ],
  bookings: [
    {
      booking_id: "123",
      client_name: "Carlos Rodríguez",
      service_name: "Consulta General",
      datetime_start: "2025-03-27T10:00:00Z",
      datetime_end: "2025-03-27T11:00:00Z",
      professional_id: 1,
      professional_name: "Gema None"
    },
    {
      booking_id: "124",
      client_name: "María López",
      service_name: "Revisión",
      datetime_start: "2025-03-27T14:00:00Z",
      datetime_end: "2025-03-27T15:00:00Z",
      professional_id: 1,
      professional_name: "Gema None"
    }
  ]
};

// Mock services data
const mockServices = [
  { id: 1, name: "Consulta General", duration: 60, price: 50 },
  { id: 2, name: "Revisión", duration: 30, price: 30 },
  { id: 3, name: "Consulta Especialista", duration: 45, price: 75 },
  { id: 4, name: "Tratamiento Completo", duration: 90, price: 120 }
];

// Function to generate mock data for a specific date
const generateMockDataForDate = (date: Date): DailyScheduleData => {
  const dateStr = format(date, 'yyyy-MM-dd');
  
  return {
    date: dateStr,
    business_hours: [
      {
        datetime_start: `${dateStr}T09:00`,
        datetime_end: `${dateStr}T17:00`
      }
    ],
    professionals: [
      {
        professional_id: 1,
        name: "Gema",
        surnames: null,
        fullname: "Gema None",
        availabilities: [
          {
            datetime_start: `${dateStr}T09:00:00Z`,
            datetime_end: `${dateStr}T18:00:00Z`
          }
        ]
      },
      {
        professional_id: 2,
        name: "Ana",
        surnames: null,
        fullname: "Ana None",
        availabilities: [
          {
            datetime_start: `${dateStr}T09:00:00Z`,
            datetime_end: `${dateStr}T14:00:00Z`
          }
        ]
      }
    ],
    bookings: [
      {
        booking_id: "123",
        client_name: "Carlos Rodríguez",
        service_name: "Consulta General",
        datetime_start: `${dateStr}T10:00:00Z`,
        datetime_end: `${dateStr}T11:00:00Z`,
        professional_id: 1,
        professional_name: "Gema None"
      },
      {
        booking_id: "124",
        client_name: "María López",
        service_name: "Revisión",
        datetime_start: `${dateStr}T14:00:00Z`,
        datetime_end: `${dateStr}T15:00:00Z`,
        professional_id: 1,
        professional_name: "Gema None"
      },
      {
        booking_id: "125",
        client_name: "Juan Pérez",
        service_name: "Consulta Especialista",
        datetime_start: `${dateStr}T11:30:00Z`,
        datetime_end: `${dateStr}T12:30:00Z`,
        professional_id: 2,
        professional_name: "Ana None"
      }
    ]
  };
};

const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [schedule, setSchedule] = useState<DailyScheduleData>(mockScheduleData);
  const [loading, setLoading] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  // Update mock data when selected date changes
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setSchedule(generateMockDataForDate(date));
        setSelectedDate(date);
        setLoading(false);
      }, 300);
    }
  };

  // Handle slot click to open booking dialog
  const handleSlotClick = (professionalId: number, time: string) => {
    setSelectedProfessionalId(professionalId);
    setSelectedTime(time);
    setEditingBooking(null);
    setBookingDialogOpen(true);
  };

  // Handle booking click to edit
  const handleBookingClick = (booking: any) => {
    setEditingBooking(booking);
    setSelectedProfessionalId(booking.professional_id);
    setBookingDialogOpen(true);
  };

  // Handle saving booking
  const handleSaveBooking = (data: BookingFormData) => {
    console.log("Booking data:", data);
    // Here you would normally send to API
    toast.success(editingBooking ? "Reserva actualizada" : "Reserva creada");
    setBookingDialogOpen(false);
    // Refresh calendar data
    handleDateChange(selectedDate);
  };

  return (
    <AppSidebarWrapper>
      <div className="bg-gray-50 flex-1">
        <div className="container px-4 py-8 mx-auto pt-20">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <h1 className="text-2xl font-bold">Agenda</h1>
            
            <div className="flex items-center gap-2">
              <Link to="/calendar">
                <Button variant="outline" className="flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  Ver Calendario
                </Button>
              </Link>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal w-[260px]",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    initialFocus
                    locale={es}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" onClick={() => handleDateChange(new Date())}>
                Hoy
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <DayCalendar 
              selectedDate={selectedDate} 
              schedule={schedule}
              loading={loading}
              onSlotClick={handleSlotClick}
              onBookingClick={handleBookingClick}
            />
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <BookingDialog
        isOpen={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        onSave={handleSaveBooking}
        booking={editingBooking}
        date={format(selectedDate, 'yyyy-MM-dd')}
        professionals={schedule?.professionals || []}
        services={mockServices}
        defaultProfessionalId={selectedProfessionalId}
        isEditing={!!editingBooking}
        selectedTime={selectedTime}
      />
    </AppSidebarWrapper>
  );
};

export default Agenda;
