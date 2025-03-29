import React, { useState, useEffect } from "react";
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
import { useAuth } from "@/stores/authContext";
import { useCalendarStore } from "@/stores/calendarStore";

const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { currentBusiness } = useAuth();
  const { fetchDailySchedule, schedule, loading } = useCalendarStore();

  // Cargar datos cuando cambie la fecha o el negocio
  useEffect(() => {
    if (currentBusiness?.business_id) {
      fetchDailySchedule(currentBusiness.business_id, selectedDate);
    }
  }, [currentBusiness?.business_id, selectedDate, fetchDailySchedule]);

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
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    locale={es}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
                Hoy
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <DayCalendar 
              selectedDate={selectedDate} 
              schedule={schedule}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </AppSidebarWrapper>
  );
};

export default Agenda;
