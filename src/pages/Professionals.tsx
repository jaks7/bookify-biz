
import React, { useState, useEffect } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '@/config/api';
import { useAuth } from '@/stores/authContext';
import { Professional as ProfessionalType } from '@/types/professional';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  professional_id?: number; // Added for compatibility
  surnames?: string; // Added for compatibility 
  email?: string; // Added for compatibility
}



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
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<null | Professional>(null);
  const [scheduleProfessional, setScheduleProfessional] = useState<null | Professional>(null);
  const [schedules, setSchedules] = useState<Professional['schedules']>({});
  const { toast } = useToast();
  const { isAuthenticated, currentBusiness } = useAuth();
  const navigate = useNavigate();
  const businessId = currentBusiness?.business_id;

  const form = useForm({
    defaultValues: {
      name: "",
      surnames: "",
      email: "",
      phone: "",
    },
  });

  const fetchProfessionals = async () => {
    if (!businessId) return;
    try {
      const response = await axios.get<Professional[]>(ENDPOINTS.PROFESSIONALS(businessId));
      setProfessionals(response.data || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      setProfessionals([]);
      toast({
        title: "Error",
        description: "No se pudieron cargar los profesionales",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!businessId) {
      navigate('/businesses');
      return;
    }
    fetchProfessionals();
  }, [isAuthenticated, businessId, navigate]);

  const onSubmit = async (data: any) => {
    if (!businessId) return;
    try {
      if (editingProfessional) {
        await axios.put(
          ENDPOINTS.PROFESSIONAL_UPDATE(businessId, editingProfessional.professional_id),
          data
        );
        toast({
          title: "Profesional actualizado",
          description: `${data.name} ${data.surnames} ha sido actualizado correctamente.`,
        });
      } else {
        await axios.post(ENDPOINTS.PROFESSIONALS_CREATE(businessId), data);
        toast({
          title: "Profesional creado",
          description: `${data.name} ${data.surnames} ha sido añadido correctamente.`,
        });
      }
      setIsFormDialogOpen(false);
      form.reset();
      fetchProfessionals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "No se pudo procesar la operación",
        variant: "destructive",
      });
    }
  };

  const openNewProfessionalDialog = () => {
    setEditingProfessional(null);
    form.reset({
      name: "",
      surnames: "",
      email: "",
      phone: "",
    });
    setIsFormDialogOpen(true);
  };

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    form.reset({
      name: professional.name,
      surnames: professional.lastName,
      email: "",
      phone: "",
    });
    setIsFormDialogOpen(true);
  };

  const handleDeleteClick = (professional: Professional) => {
    setEditingProfessional(professional);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!businessId || !editingProfessional) return;
    try {
      await axios.delete(
        ENDPOINTS.PROFESSIONAL_DELETE(businessId, editingProfessional.id.toString())
      );
      toast({
        title: "Profesional eliminado",
        description: "El profesional ha sido eliminado correctamente.",
      });
      fetchProfessionals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "No se pudo eliminar el profesional",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setEditingProfessional(null);
    }
  };

  const openScheduleDialog = (professional: Professional) => {
    setScheduleProfessional(professional);
    setSchedules({ ...professional.schedules });
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
    fetchProfessionals();
    
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
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-3/4" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-1/2" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-2/3" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : professionals.length > 0 ? (
                    professionals.map((professional) => (
                      <TableRow key={professional.professional_id}>
                        <TableCell className="font-medium">{professional.name}</TableCell>
                        <TableCell>{professional.surnames}</TableCell>
                        <TableCell>{professional.email}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(professional)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteClick(professional)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No hay profesionales registrados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Professional Form Dialog */}
        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
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
                  name="surnames"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: ana@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 555-1234-567" {...field} />
                      </FormControl>
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
        <Dialog open={scheduleProfessional !== null} onOpenChange={() => setScheduleProfessional(null)}>
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente el profesional
                y todos sus datos asociados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppSidebarWrapper>
  );
};

export default Professionals;
