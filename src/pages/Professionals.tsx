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
  professional_id: string;
  name: string;
  surnames: string;
  email: string;
  phone: string;
}

// Schema for validating professional form
const professionalSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  surnames: z.string().min(2, { message: "Los apellidos deben tener al menos 2 caracteres" }),
  email: z.string().email({ message: "El email debe ser válido" }),
  phone: z.string().min(9, { message: "El teléfono debe tener al menos 9 dígitos" }),
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
  const { toast } = useToast();
  const { isAuthenticated, currentBusiness } = useAuth();
  const navigate = useNavigate();
  const businessId = currentBusiness?.business_id;

  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalSchema),
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
      const response = await axios.get<Professional[]>(
        `http://127.0.0.1:8000/business/${businessId}/professionals/`
      );
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

  const onSubmit = async (data: ProfessionalFormValues) => {
    if (!businessId) return;
    try {
      if (editingProfessional) {
        // Actualizar profesional existente
        await axios.put(
          `http://127.0.0.1:8000/business/${businessId}/professionals/${editingProfessional.professional_id}/update/`,
          data
        );
        toast({
          title: "Profesional actualizado",
          description: `${data.name} ${data.surnames} ha sido actualizado correctamente.`,
        });
      } else {
        // Crear nuevo profesional
        await axios.post(
          `http://127.0.0.1:8000/business/${businessId}/professionals/create/`,
          data
        );
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
      surnames: professional.surnames,
      email: professional.email,
      phone: professional.phone,
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
        `http://127.0.0.1:8000/business/${businessId}/professionals/${editingProfessional.professional_id}/delete/`
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
                    <TableHead>Email</TableHead>
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
                Introduce los datos del profesional. Todos los campos son obligatorios.
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
                        <Input placeholder="Ej: García López" {...field} />
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
                        <Input type="email" placeholder="ana.garcia@example.com" {...field} />
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
                        <Input placeholder="Ej: 666123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingProfessional ? "Guardar cambios" : "Crear profesional"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
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
