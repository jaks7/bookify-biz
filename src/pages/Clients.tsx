
import React, { useState } from 'react';
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

// Definición del tipo para clientes
interface Client {
  id: number;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  postalCode: string;
}

// Mock data para clientes
const mockClients: Client[] = [
  { 
    id: 1, 
    name: "Laura", 
    lastName: "Fernández", 
    phone: "666123456", 
    email: "laura.fernandez@example.com", 
    postalCode: "28001" 
  },
  { 
    id: 2, 
    name: "Miguel", 
    lastName: "Sánchez", 
    phone: "677234567", 
    email: "miguel.sanchez@example.com", 
    postalCode: "08001" 
  },
  { 
    id: 3, 
    name: "Carmen", 
    lastName: "López", 
    phone: "688345678", 
    email: "carmen.lopez@example.com", 
    postalCode: "46001" 
  },
];

// Schema para validar el formulario de cliente
const clientSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  lastName: z.string().min(2, { message: "Los apellidos deben tener al menos 2 caracteres" }),
  phone: z.string().min(9, { message: "El teléfono debe tener al menos 9 dígitos" }),
  email: z.string().email({ message: "Introduce un email válido" }),
  postalCode: z.string().min(4, { message: "El código postal debe tener al menos 4 dígitos" }),
});

type ClientFormValues = z.infer<typeof clientSchema>;

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<null | Client>(null);
  const [selectedClient, setSelectedClient] = useState<null | Client>(null);
  const { toast } = useToast();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      lastName: "",
      phone: "",
      email: "",
      postalCode: "",
    },
  });

  const onSubmit = (values: ClientFormValues) => {
    if (editingClient) {
      // Update existing client
      setClients(clients.map(client => 
        client.id === editingClient.id 
          ? { ...client, ...values } 
          : client
      ));
      toast({
        title: "Cliente actualizado",
        description: `${values.name} ${values.lastName} ha sido actualizado correctamente.`,
      });
    } else {
      // Add new client with all required properties
      const newClient: Client = {
        id: clients.length ? Math.max(...clients.map(c => c.id)) + 1 : 1,
        name: values.name,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
        postalCode: values.postalCode
      };
      setClients([...clients, newClient]);
      toast({
        title: "Cliente creado",
        description: `${values.name} ${values.lastName} ha sido añadido correctamente.`,
      });
    }
    setIsDialogOpen(false);
    form.reset();
  };

  const openNewClientDialog = () => {
    setEditingClient(null);
    form.reset({
      name: "",
      lastName: "",
      phone: "",
      email: "",
      postalCode: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    form.reset({
      name: client.name,
      lastName: client.lastName,
      phone: client.phone,
      email: client.email,
      postalCode: client.postalCode,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (clientId: number) => {
    setClients(clients.filter(client => client.id !== clientId));
    toast({
      title: "Cliente eliminado",
      description: "El cliente ha sido eliminado correctamente.",
    });
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
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.lastName}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.postalCode}</TableCell>
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
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)}>
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
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Laura" {...field} />
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
                      <FormLabel>Teléfono</FormLabel>
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: cliente@ejemplo.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Postal</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 28001" {...field} />
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

        {/* Client History Dialog */}
        <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Historial de {selectedClient?.name} {selectedClient?.lastName}
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
