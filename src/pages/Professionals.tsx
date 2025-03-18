import React, { useState } from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Types for our data model
interface Professional {
  id: number;
  name: string;
  lastName: string;
  workingDays: number[]; // 0 = Sunday, 6 = Saturday
  schedules: {
    [key: number]: { // Day of week (0-6)
      start: string; // Time format: "09:00"
      end: string; // Time format: "17:00"
    };
  };
}

// Mock data for professionals
const mockProfessionals: Professional[] = [
  { 
    id: 1, 
    name: "Ana", 
    lastName: "García",
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    schedules: {
      1: { start: "09:00", end: "17:00" },
      2: { start: "09:00", end: "17:00" },
      3: { start: "09:00", end: "17:00" },
      4: { start: "09:00", end: "17:00" },
      5: { start: "09:00", end: "14:00" }
    }
  },
  { 
    id: 2, 
    name: "Carlos", 
    lastName: "Rodríguez",
    workingDays: [1, 3, 5], // Monday, Wednesday, Friday
    schedules: {
      1: { start: "10:00", end: "18:00" },
      3: { start: "10:00", end: "18:00" },
      5: { start: "10:00", end: "18:00" }
    }
  },
];

// Schema for validating professional form
const professionalSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  lastName: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
  workingDays: z.array(z.number()).min(1, { message: "Selecciona al menos un día de trabajo" }),
});

type ProfessionalFormValues = z.infer<typeof professionalSchema>;

// Day names in Spanish
const dayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado"
];

// Time slots for select dropdowns
const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

const Professionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>(mockProfessionals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<null | Professional>(null);
  const [scheduleProfessional, setScheduleProfessional] = useState<null | Professional>(null);
  const [schedules, setSchedules] = useState<Professional['schedules']>({});
  const { toast } = useToast();

  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      name: "",
      lastName: "",
      workingDays: [],
    },
  });

  const onSubmit = (values: ProfessionalFormValues) => {
    if (editingProfessional) {
      // Update existing professional
      setProfessionals(professionals.map(professional => 
        professional.id === editingProfessional.id 
          ? { ...professional, ...values } 
          : professional
      ));
      toast({
        title: "Profesional actualizado",
        description: `${values.name} ${values.lastName} ha sido actualizado correctamente.`,
      });
    } else {
      // Add new professional
      const newProfessional: Professional = {
        id: professionals.length ? Math.max(...professionals.map(p => p.id)) + 1 : 1,
        name: values.name,
        lastName: values.lastName,
        workingDays: values.workingDays,
        schedules: {},
      };
      setProfessionals([...professionals, newProfessional]);
      toast({
        title: "Profesional creado",
        description: `${values.name} ${values.lastName} ha sido añadido correctamente.`,
      });
    }
    setIsDialogOpen(false);
    form.reset();
  };

  const openNewProfessionalDialog = () => {
    setEditingProfessional(null);
    form.reset({
      name: "",
      lastName: "",
      workingDays: [],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    form.reset({
      name: professional.name,
      lastName: professional.lastName,
      workingDays: professional.workingDays,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (professionalId: number) => {
    setProfessionals(professionals.filter(p => p.id !== professionalId));
    toast({
      title: "Profesional eliminado",
      description: "El profesional ha sido eliminado correctamente.",
    });
  };

  const openScheduleDialog = (professional: Professional) => {
    setScheduleProfessional(professional);
    setSchedules({ ...professional.schedules });
    setIsScheduleDialogOpen(true);
  };

  const handleScheduleChange = (day: number, field: 'start' | 'end', time: string) => {
    setSchedules(prev => {
      const newSchedules = { ...prev };
      if (!newSchedules[day]) {
        newSchedules[day] = { start: "09:00", end: "17:00" };
      }
      newSchedules[day][field] = time;
      return newSchedules;
    });
  };

  const saveSchedules = () => {
    if (!scheduleProfessional) return;
    
    // Update professional schedules
    setProfessionals(professionals.map(professional => 
      professional.id === scheduleProfessional.id 
        ? { ...professional, schedules } 
        : professional
    ));
    
    setIsScheduleDialogOpen(false);
    toast({
      title: "Horarios actualizados",
      description: `Los horarios de ${scheduleProfessional.name} ${scheduleProfessional.lastName} han sido actualizados.`,
    });
  };

  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Profesionales</h1>
            <Button onClick={openNewProfessionalDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Profesional
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Listado de Profesionales</CardTitle>
              <CardDescription>
                Gestiona los profesionales que trabajan en tu negocio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellidos</TableHead>
                    <TableHead>Días laborables</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {professionals.map((professional) => (
                    <TableRow key={professional.id}>
                      <TableCell className="font-medium">{professional.name}</TableCell>
                      <TableCell>{professional.lastName}</TableCell>
                      <TableCell>
                        {professional.workingDays
                          .map(day => dayNames[day])
                          .join(", ")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mr-2"
                          onClick={() => openScheduleDialog(professional)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Horarios
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(professional)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(professional.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Professional Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingProfessional ? "Editar Profesional" : "Nuevo Profesional"}
              </DialogTitle>
              <DialogDescription>
                Introduce los datos del profesional y selecciona sus días de trabajo.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Ana" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: García" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workingDays"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Días de trabajo</FormLabel>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                          <FormField
                            key={day}
                            control={form.control}
                            name="workingDays"
                            render={({ field }) => (
                              <FormItem
                                key={day}
                                className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, day])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== day
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="cursor-pointer">
                                  {dayNames[day]}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Guardar</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Schedule Management Dialog */}
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Horarios de {scheduleProfessional?.name} {scheduleProfessional?.lastName}
              </DialogTitle>
              <DialogDescription>
                Define los horarios específicos para cada día de trabajo.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {scheduleProfessional?.workingDays.map(day => (
                <Card key={day}>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{dayNames[day]}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FormLabel>Hora de inicio</FormLabel>
                        <Select 
                          value={schedules[day]?.start || "09:00"}
                          onValueChange={(value) => handleScheduleChange(day, 'start', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Hora de inicio" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map(time => (
                              <SelectItem key={`start-${time}`} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Hora de fin</FormLabel>
                        <Select 
                          value={schedules[day]?.end || "17:00"}
                          onValueChange={(value) => handleScheduleChange(day, 'end', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Hora de fin" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map(time => (
                              <SelectItem key={`end-${time}`} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(!scheduleProfessional?.workingDays.length) && (
                <div className="text-center p-6 text-muted-foreground">
                  Este profesional no tiene días de trabajo asignados.
                  Edita el profesional primero para asignar días de trabajo.
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={saveSchedules}>Guardar Horarios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppSidebarWrapper>
  );
};

export default Professionals;
