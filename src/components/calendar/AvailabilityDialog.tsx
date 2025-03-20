
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/calendar/TimePicker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ProfessionalAvailability, AvailabilityDialogProps } from "@/types/availability";

export const AvailabilityDialog: React.FC<AvailabilityDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  availability,
  date,
  professionalId,
  professionalName,
  isEditing
}) => {
  const [startTime, setStartTime] = useState(availability?.start_time || "09:00");
  const [endTime, setEndTime] = useState(availability?.end_time || "10:00");
  const [formattedDate, setFormattedDate] = useState("");

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      setStartTime(availability?.start_time || "09:00");
      setEndTime(availability?.end_time || "10:00");
      
      try {
        // Format the date for display
        const dateObj = new Date(date);
        setFormattedDate(format(dateObj, "EEEE, d 'de' MMMM", { locale: es }));
      } catch (error) {
        console.error("Error formatting date:", error);
        setFormattedDate(date);
      }
    }
  }, [isOpen, availability, date]);

  const handleSave = () => {
    const newAvailability: ProfessionalAvailability = {
      id: availability?.id || `avail-${Date.now()}`,
      professional: professionalId,
      professionalName: professionalName,
      date: date,
      start_time: startTime,
      end_time: endTime
    };
    
    onSave(newAvailability);
    onClose();
  };

  const isValidTime = () => {
    // Basic validation to ensure end time is after start time
    return startTime < endTime;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar disponibilidad" : "Crear disponibilidad"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <Label>Profesional</Label>
            <div className="p-2 bg-gray-100 rounded">{professionalName}</div>
          </div>
          
          <div className="space-y-1">
            <Label>Fecha</Label>
            <div className="p-2 bg-gray-100 rounded capitalize">{formattedDate}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <TimePicker
                value={startTime}
                onChange={setStartTime}
                label="Hora de inicio"
                id="start-time"
              />
            </div>
            
            <div className="space-y-1">
              <TimePicker
                value={endTime}
                onChange={setEndTime}
                label="Hora de fin"
                id="end-time"
              />
            </div>
          </div>
          
          {!isValidTime() && (
            <div className="text-red-500 text-sm">
              La hora de fin debe ser posterior a la hora de inicio
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isValidTime()}>
            {isEditing ? "Actualizar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
