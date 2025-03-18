
import React, { useState } from 'react';
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

// Definición de tipos para profesionales y servicios
interface Professional {
  id: number;
  name: string;
  lastName: string;
}

interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
  professionalIds: number[];
}

// Mock data for professionals and services
const mockProfessionals: Professional[] = [
  { id: 1, name: "Ana", lastName: "García" },
  { id: 2, name: "Carlos", lastName: "Rodríguez" },
  { id: 3, name: "Elena", lastName: "López" },
  { id: 4, name: "David", lastName: "Martínez" },
];

const mockServices: Service[] = [
  { id: 1, name: "Consulta General", duration: 30, price: 50, professionalIds: [1, 3] },
  { id: 2, name: "Tratamiento Intensivo", duration: 60, price: 90, professionalIds: [1, 2, 4] },
  { id: 3, name: "Revisión Rápida", duration: 15, price: 30, professionalIds: [2] },
];

// Schema for validating service form
const serviceSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  duration: z.coerce.number().min(5, { message: "La duración mínima es de 5 minutos" }),
  price: z.coerce.number().min(0, { message: "El precio no puede ser negativo" }),
  professionalIds: z.array(z.number()).min(1, { message: "Selecciona al menos un profesional" }),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const DemoServices = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [professionals] = useState<Professional[]>(mockProfessionals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<null | { id: number }>(null);
  const { toast } = useToast();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      duration: 30,
      price: 0,
      professionalIds: [],
    },
  });

  const onSubmit = (values: ServiceFormValues) => {
    if (editingService) {
      // Update existing service
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { ...service, ...values } 
          : service
      ));
      toast({
        title: "Servicio actualizado",
        description: `El servicio "${values.name}" ha sido actualizado correctamente.`,
      });
    } else {
      // Add new service
      const newService: Service = {
        id: services.length ? Math.max(...services.map(s => s.id)) + 1 : 1,
        name: values.name,
        duration: values.duration,
        price: values.price,
        professionalIds: values.professionalIds,
      };
      setServices([...services, newService]);
      toast({
        title: "Servicio creado",
        description: `El servicio "${values.name}" ha sido creado correctamente.`,
      });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (service: typeof services[0]) => {
    form.reset({
      name: service.name,
      duration: service.duration,
      price: service.price,
      professionalIds: service.professionalIds,
    });
    setEditingService({ id: service.id });
    setIsDialogOpen(true);
  };

  const handleDelete = (serviceId: number) => {
    setServices(services.filter(service => service.id !== serviceId));
    toast({
      title: "Servicio eliminado",
      description: "El servicio ha sido eliminado correctamente.",
    });
  };

  const openNewServiceDialog = () => {
    resetForm();
    setEditingService(null);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    form.reset({
      name: "",
      duration: 30,
      price: 0,
      professionalIds: [],
    });
  };

  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Demo - Servicios</h1>
            <Button onClick={openNewServiceDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Servicio
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Listado de Servicios (Demo)</CardTitle>
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
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.duration}</TableCell>
                      <TableCell>{service.price} €</TableCell>
                      <TableCell>
                        {service.professionalIds.map(id => {
                          const professional = professionals.find(p => p.id === id);
                          return professional ? `${professional.name} ${professional.lastName}, ` : '';
                        }).join('').slice(0, -2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
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
                <FormField
                  control={form.control}
                  name="professionalIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Profesionales que realizan este servicio</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {professionals.map((professional) => (
                          <FormField
                            key={professional.id}
                            control={form.control}
                            name="professionalIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={professional.id}
                                  className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(professional.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, professional.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== professional.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="cursor-pointer">
                                    {professional.name} {professional.lastName}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
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
      </div>
    </AppSidebarWrapper>
  );
};

export default DemoServices;
