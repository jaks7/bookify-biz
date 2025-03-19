
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/calendar/TimePicker";

interface BusinessHoursProps {
  initialHours: { start: string; end: string }[];
  onSave: (hours: { start: string; end: string }[]) => void;
}

export const BusinessHours: React.FC<BusinessHoursProps> = ({ initialHours, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hours, setHours] = useState(initialHours);

  const handleAddTimeSlot = () => {
    setHours([...hours, { start: "09:00", end: "18:00" }]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    const newHours = [...hours];
    newHours.splice(index, 1);
    setHours(newHours);
  };

  const handleTimeChange = (index: number, type: "start" | "end", value: string) => {
    const newHours = [...hours];
    newHours[index][type] = value;
    setHours(newHours);
  };

  const handleSave = () => {
    onSave(hours);
    setIsEditing(false);
  };

  return (
    <Card className="border-gray-200 shadow-sm mb-4">
      <CardHeader className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            Horario del negocio
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? "Guardar" : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Modificar
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            {hours.map((timeSlot, index) => (
              <div key={index} className="flex items-center gap-2">
                <TimePicker
                  value={timeSlot.start}
                  onChange={(value) => handleTimeChange(index, "start", value)}
                  label="Inicio"
                />
                <span className="mx-2">-</span>
                <TimePicker
                  value={timeSlot.end}
                  onChange={(value) => handleTimeChange(index, "end", value)}
                  label="Fin"
                />
                {hours.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 mt-6" 
                    onClick={() => handleRemoveTimeSlot(index)}
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={handleAddTimeSlot}
            >
              + Añadir franja horaria
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {hours.map((timeSlot, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1 rounded-md text-gray-800">
                {timeSlot.start} - {timeSlot.end}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
