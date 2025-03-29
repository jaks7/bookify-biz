import React, { useState, useEffect } from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, History } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/stores/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';

// Definición del tipo para clientes
interface Client {
  client_id: string;
  name: string;
  surnames: string;
  phone: string;
  email?: string;
  postal_code?: string;
  fullname: string;
  business: string;
}

// Schema para validar el formulario de cliente
const clientSchema = z.object({
  name: z.string().nullable(),
  surnames: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  postal_code: z.string().nullable(),
}).transform((data) => {
  // Convertir strings vacíos a null
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value === "" || !value ? null : value
    ])
  );
});

type ClientFormValues = {
  name: string | null;
  surnames: string | null;
  phone: string | null;
  email: string | null;
  postal_code: string | null;
};

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<null | Client>(null);
  const [selectedClient, setSelectedClient] = useState<null | Client>(null);
  const { toast } = useToast();
  const { isAuthenticated, currentBusiness } = useAuth();
  const navigate = useNavigate();
  const businessId = currentBusiness?.business_id;

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: null,
      surnames: null,
      phone: null,
      email: null,
      postal_code: null,
    },
  });

  const fetchClients = async () => {
    if (!businessId) return;
    try {
      const response = await axios.get<Client[]>(
        `http://127.0.0.1:8000/business/${businessId}/clients/`
      );
      setClients(response.data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
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
    fetchClients();
  }, [isAuthenticated, businessId, navigate]);

  const onSubmit = async (values: ClientFormValues) => {
    if (!businessId) return;
    try {
      // Preparar los datos, eliminando campos nulos
      const submitData = Object.entries(values).reduce((acc, [key, value]) => {
        if (value !== null && value.trim() !== "") {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      if (editingClient) {
        // Update existing client
        await axios.put(
          `http://127.0.0.1:8000/business/${businessId}/clients/${editingClient.client_id}/update/`,
          submitData
        );
        toast({
          title: "Cliente actualizado",
          description: "Cliente actualizado correctamente.",
        });
      } else {
        // Create new client
        await axios.post(
          `http://127.0.0.1:8000/business/${businessId}/clients/create/`,
          submitData
        );
        toast({
          title: "Cliente creado",
          description: "Cliente creado correctamente.",
        });
      }
      setIsDialogOpen(false);
      form.reset();
      fetchClients();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "No se pudo procesar la operación",
        variant: "destructive",
      });
    }
  };

  const openNewClientDialog = () => {
    setEditingClient(null);
    form.reset({
      name: null,
      surnames: null,
      phone: null,
      email: null,
      postal_code: null,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    form.reset({
      name: client.name || null,
      surnames: client.surnames || null,
      phone: client.phone || null,
      email: client.email || null,
      postal_code: client.postal_code || null,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (clientId: string) => {
    if (!businessId) return;
    try {
      await axios.delete(
        `http://127.0.0.1:8000/business/${businessId}/clients/${clientId}/delete/`
      );
      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado correctamente.",
      });
      fetchClients();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "No se pudo eliminar el cliente",
        variant: "destructive",
      });
    }
  };

  const openHistoryDialog = (client: Client) => {
    setSelectedClient(client);
    setIsHistoryDialogOpen(true);
  };

  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Clientes</h1>
            <Button onClick={openNewClientDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Listado de Clientes</CardTitle>
              <CardDescription>
                Gestiona toda la información de tus clientes y su historial.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellidos</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>C.P.</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-[100px] ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : clients.length > 0 ? (
                    clients.map((client) => (
                      <TableRow key={client.client_id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.surnames}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.postal_code}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => openHistoryDialog(client)}
                          >
                            <History className="h-4 w-4 mr-2" />
                            Historial
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(client.client_id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No hay clientes registrados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Client Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? "Editar Cliente" : "Nuevo Cliente"}
              </DialogTitle>
              <DialogDescription>
                Introduce los datos del cliente para añadirlo a tu sistema.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Laura" {...field} />
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
                      <FormLabel>Apellidos (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Fernández" {...field} />
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
                      <FormLabel>Teléfono (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 666123456" {...field} />
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
                      <FormLabel>Email (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: cliente@ejemplo.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Postal (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 28001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingClient ? "Guardar cambios" : "Crear cliente"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Client History Dialog */}
        <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Historial de {selectedClient?.fullname}
              </DialogTitle>
              <DialogDescription>
                Consulta el historial de citas y servicios del cliente.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center text-muted-foreground">
                No hay registros de citas o servicios para este cliente.
                Las citas y servicios que se programen aparecerán aquí.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsHistoryDialogOpen(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppSidebarWrapper>
  );
};

export default Clients;
