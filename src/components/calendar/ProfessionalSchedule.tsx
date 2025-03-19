
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/calendar/TimePicker";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";

interface ProfessionalScheduleProps {
  professional: {
    id: string;
    name: string;
    isWorking: boolean;
    workingHours: { start: string; end: string }[];
  };
  onStatusChange: (id: string, isWorking: boolean) => void;
  onHoursChange: (id: string, hours: { start: string; end: string }[]) => void;
}

export const ProfessionalSchedule: React.FC<ProfessionalScheduleProps> = ({
  professional,
  onStatusChange,
  onHoursChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [workingHours, setWorkingHours] = useState(professional.workingHours);

  const handleAddTimeSlot = () => {
    setWorkingHours([...workingHours, { start: "09:00", end: "14:00" }]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    const newHours = [...workingHours];
    newHours.splice(index, 1);
    setWorkingHours(newHours);
  };

  const handleTimeChange = (index: number, type: "start" | "end", value: string) => {
    const newHours = [...workingHours];
    newHours[index][type] = value;
    setWorkingHours(newHours);
  };

  const handleSave = () => {
    onHoursChange(professional.id, workingHours);
    setIsEditing(false);
  };

  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white mb-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Switch
            id={`working-${professional.id}`}
            checked={professional.isWorking}
            onCheckedChange={(checked) => onStatusChange(professional.id, checked)}
          />
          <Label htmlFor={`working-${professional.id}`} className="font-medium">
            {professional.name}
          </Label>
        </div>
        
        {professional.isWorking && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Editar horario
              </>
            )}
          </Button>
        )}
      </div>

      {professional.isWorking && isEditing && (
        <div className="mt-2 space-y-2">
          {workingHours.map((hours, index) => (
            <div key={index} className="flex items-center gap-2">
              <TimePicker
                value={hours.start}
                onChange={(value) => handleTimeChange(index, "start", value)}
                label="Inicio"
              />
              <span className="mx-2">-</span>
              <TimePicker
                value={hours.end}
                onChange={(value) => handleTimeChange(index, "end", value)}
                label="Fin"
              />
              {workingHours.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
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
      )}

      {professional.isWorking && !isEditing && (
        <div className="mt-2">
          {workingHours.map((hours, index) => (
            <div key={index} className="text-sm text-gray-600">
              {hours.start} - {hours.end}
              {index < workingHours.length - 1 && ", "}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
