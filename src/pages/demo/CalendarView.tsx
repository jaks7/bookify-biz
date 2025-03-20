import React, { useState } from "react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Grid, List } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { DayCalendar } from "@/components/calendar/DayCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";

const generateMonthOccupancy = (month: Date) => {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  
  return days.reduce((acc, day) => {
    acc[format(day, 'yyyy-MM-dd')] = Math.floor(Math.random() * 101); // 0-100%
    return acc;
  }, {} as Record<string, number>);
};

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [view, setView] = useState<"calendar" | "day">("calendar");
  const [occupancyData] = useState(() => generateMonthOccupancy(currentMonth));

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const getDayClass = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const occupancy = occupancyData[dateStr] || 0;
    
    if (occupancy > 80) return "bg-rose-400 text-white hover:bg-rose-500"; // >80% occupied
    if (occupancy > 50) return "bg-amber-400 text-white hover:bg-amber-500"; // >50% occupied
    if (occupancy > 20) return "bg-emerald-400 text-white hover:bg-emerald-500"; // >20% occupied
    return "bg-emerald-200 text-emerald-900 hover:bg-emerald-300"; // <20% occupied
  };

  return (
    <AppSidebarWrapper>
      <div className="bg-gray-50 flex-1">
        <div className="container px-4 py-8 mx-auto">
          <h1 className="text-2xl font-bold mb-6">Calendario de Disponibilidad</h1>
          
          <Tabs defaultValue="calendar" value={view} onValueChange={(v) => setView(v as "calendar" | "day")}>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
              <TabsList className="bg-white border border-gray-200">
                <TabsTrigger value="calendar" className="data-[state=active]:bg-bookify-500 data-[state=active]:text-white">
                  <Grid className="h-4 w-4 mr-2" />
                  Calendario
                </TabsTrigger>
                <TabsTrigger value="day" className="data-[state=active]:bg-bookify-500 data-[state=active]:text-white">
                  <List className="h-4 w-4 mr-2" />
                  Día
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
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

            <TabsContent value="calendar" className="mt-4">
              <Card className="border-gray-200 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy', { locale: es })}</h2>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                      <div key={day} className="text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {eachDayOfInterval({
                      start: startOfMonth(currentMonth),
                      end: endOfMonth(currentMonth)
                    }).map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const occupancy = occupancyData[dateStr] || 0;
                      
                      return (
                        <Button
                          key={day.toString()}
                          variant="ghost"
                          className={cn(
                            "h-16 relative rounded-md flex flex-col items-center justify-center p-0",
                            getDayClass(day),
                            format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') && "ring-2 ring-offset-2 ring-bookify-500"
                          )}
                          onClick={() => {
                            setSelectedDate(day);
                            setView("day");
                          }}
                        >
                          <span className="text-sm font-medium">{format(day, 'd')}</span>
                          <div className="mt-1 text-xs">{100 - occupancy}% libre</div>
                          <div className="absolute bottom-1 left-1 right-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-white opacity-60 rounded-full" 
                              style={{ width: `${100 - occupancy}%` }}
                            />
                          </div>
                        </Button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                      <span className="text-sm">Poco ocupado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <span className="text-sm">Medio ocupado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                      <span className="text-sm">Muy ocupado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="day" className="mt-4">
              <DayCalendar selectedDate={selectedDate} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppSidebarWrapper>
  );
};

export default CalendarView;
