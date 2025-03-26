
import React, { useState } from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/stores/authContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Plus, Store, Users, Clipboard } from 'lucide-react';

// Tipos para negocios
interface Business {
  business_id: string;
  name: string;
  type_of_business: string;
  postal_code: string;
  province: string;
  city: string;
  serviceCount: number;
  professionalCount: number;
}

// Datos mock para negocios
const mockBusinesses: Business[] = [
  {
    business_id: "1",
    name: "Clínica Dental Sonrisa",
    type_of_business: "Clínica dental",
    postal_code: "28001",
    province: "Madrid",
    city: "Madrid",
    serviceCount: 12,
    professionalCount: 4
  },
  {
    business_id: "2",
    name: "Centro de Fisioterapia Vital",
    type_of_business: "Fisioterapia",
    postal_code: "08001",
    province: "Barcelona",
    city: "Barcelona",
    serviceCount: 8,
    professionalCount: 3
  }
];

// Schema para validar el formulario de negocio
const businessSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  type_of_business: z.string().min(2, { message: "El tipo de negocio es obligatorio" }),
  postal_code: z.string().min(4, { message: "El código postal debe tener al menos 4 dígitos" }),
  province: z.string().min(2, { message: "La provincia es obligatoria" }),
  city: z.string().min(2, { message: "La ciudad es obligatoria" })
});

type BusinessFormValues = z.infer<typeof businessSchema>;

// Tipos de negocios disponibles
const businessTypes = [
  "Clínica dental",
  "Fisioterapia",
  "Psicología",
  "Medicina estética",
  "Peluquería",
  "Barbería",
  "Centro de masajes",
  "Spa",
  "Centro de belleza",
  "Otros"
];

const DemoBusinesses = () => {
  const { availableBusinesses } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      type_of_business: "",
      postal_code: "",
      province: "",
      city: ""
    }
  });

  const onSubmit = (values: BusinessFormValues) => {
    // Add new business with required fields
    const newBusiness: Business = {
      business_id: (businesses.length + 1).toString(),
      name: values.name,
      type_of_business: values.type_of_business,
      postal_code: values.postal_code,
      province: values.province,
      city: values.city,
      serviceCount: 0,
      professionalCount: 0
    };
    
    setBusinesses([...businesses, newBusiness]);
    setIsDialogOpen(false);
    form.reset();
    
    toast({
      title: "Negocio creado",
      description: `${values.name} ha sido añadido correctamente.`,
    });
  };

  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Demo - Mis Negocios</h1>
              <p className="text-muted-foreground">
                Gestiona todos tus negocios desde un solo lugar (Datos de ejemplo)
              </p>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Negocio
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map(business => (
              <Card key={business.business_id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{business.name}</CardTitle>
                  <CardDescription>{business.type_of_business}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Store className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{business.city}, {business.province} - CP: {business.postal_code}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-3">
                      <div className="flex items-center">
                        <Clipboard className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Servicios</p>
                          <p className="text-2xl font-bold">{business.serviceCount}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Profesionales</p>
                          <p className="text-2xl font-bold">{business.professionalCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = "/demo/configuracion"}
                  >
                    Ver Detalles
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Business Creation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nuevo Negocio</DialogTitle>
              <DialogDescription>
                Introduce los datos de tu negocio para comenzar a gestionarlo.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del negocio</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Clínica Dental Sonrisa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type_of_business"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de negocio</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo de negocio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postal_code"
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
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provincia</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Madrid" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Madrid" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Crear Negocio</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AppSidebarWrapper>
  );
};

export default DemoBusinesses;
