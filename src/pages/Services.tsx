import React, { useState, useEffect } from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '@/config/api';
import { useAuth } from '@/stores/authContext';
import { Service } from '@/types/service';
import { Skeleton } from "@/components/ui/skeleton";

// Solo necesitamos una interfaz Professional
interface Professional {
  professional_id: string;
  name: string;
  surnames: string;
}

// Schema for validating service form
const serviceSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  duration: z.coerce.number().min(5, { message: "La duración mínima es de 5 minutos" }),
  price: z.coerce.number().min(0, { message: "El precio no puede ser negativo" })
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { isAuthenticated, currentBusiness } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const businessId = currentBusiness?.business_id;
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>([]);

  const fetchServices = async () => {
    if (!businessId) return;
    try {
      const response = await axios.get<Service[]>(ENDPOINTS.SERVICES(businessId));
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los servicios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessionals = async () => {
    if (!businessId) return;
    try {
      const response = await axios.get<Professional[]>(ENDPOINTS.PROFESSIONALS(businessId));
      setProfessionals(response.data);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los profesionales",
        variant: "destructive",
      });
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
    fetchServices();
    fetchProfessionals();
  }, [isAuthenticated, businessId, navigate]);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      duration: 30,
      price: 0
    }
  });

  const onSubmit = async (values: ServiceFormValues) => {
    if (!businessId) return;

    try {
      const formData = {
        name: values.name,
        duration: values.duration,
        price: values.price.toString(),
        professional_ids: selectedProfessionals
      };

      if (editingService) {
        await axios.put(
          ENDPOINTS.SERVICE_UPDATE(businessId, editingService.service_id),
          formData
        );
      } else {
        await axios.post(ENDPOINTS.SERVICES_CREATE(businessId), formData);
      }

      setIsDialogOpen(false);
      form.reset();
      setSelectedProfessionals([]);
      fetchServices();
      
    } catch (error: any) {
      console.error('Error en submit:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "No se pudo procesar la operación",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!businessId) return;
    try {
      await axios.delete(ENDPOINTS.SERVICE_DELETE(businessId, serviceId));
      toast({
        title: "Servicio eliminado",
        description: "El servicio ha sido eliminado correctamente",
      });
      fetchServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "No se pudo eliminar el servicio",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (service: Service) => {
    const professionalIds = service.professionals.map(p => p.professional_id);
    setSelectedProfessionals(professionalIds);
    form.reset({
      name: service.name,
      duration: service.duration,
      price: parseFloat(service.price)
    });
    setEditingService(service);
    setIsDialogOpen(true);
    fetchProfessionals();
  };

  const openNewServiceDialog = () => {
    setSelectedProfessionals([]);
    form.reset({
      name: "",
      duration: 30,
      price: 0
    });
    setEditingService(null);
    setIsDialogOpen(true);
    fetchProfessionals();
  };

  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Servicios</h1>
            <Button onClick={openNewServiceDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Servicio
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Listado de Servicios </CardTitle>
              <CardDescription>
                Gestiona los servicios que ofrece tu negocio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Duración (min)</TableHead>
                    <TableHead>Precio (€)</TableHead>
                    <TableHead>Profesionales</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Skeletons para carga
                    Array(3).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-3/4" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-1/2" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-1/4" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-20 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : services.length > 0 ? (
                    services.map((service) => (
                      <TableRow key={service.service_id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>{service.duration}</TableCell>
                        <TableCell>{service.price} €</TableCell>
                        <TableCell>
                          {service.professionals.map(p => p.fullname).join(", ")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(service.service_id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No hay servicios registrados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Editar Servicio" : "Nuevo Servicio"}
              </DialogTitle>
              <DialogDescription>
                Completa los detalles del servicio y selecciona los profesionales que pueden realizarlo.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del servicio</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Consulta General" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duración (minutos)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio (€)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-3">
                  <div className="text-base font-medium">
                    Profesionales que realizan este servicio
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {professionals.map((professional) => (
                      <div
                        key={professional.professional_id}
                        className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3"
                      >
                        <Checkbox
                          checked={selectedProfessionals.includes(professional.professional_id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedProfessionals(prev => [...prev, professional.professional_id]);
                            } else {
                              setSelectedProfessionals(prev => 
                                prev.filter(id => id !== professional.professional_id)
                              );
                            }
                          }}
                        />
                        <span className="text-sm">
                          {professional.name} {professional.surnames}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Guardar</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AppSidebarWrapper>
  );
}
