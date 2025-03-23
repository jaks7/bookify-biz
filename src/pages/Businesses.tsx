
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { ENDPOINTS } from '@/config/api';
import { useAuth } from '@/stores/authContext';
import { Business } from '@/types/business';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, Plus, Settings, ArrowRight } from 'lucide-react';
import { AppSidebarWrapper } from '@/components/layout/AppSidebar';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const businessTypes = [
  "Peluquería",
  "Barbería",
  "Centro de estética",
  "Spa",
  "Centro de masajes",
  "Clínica dental",
  "Centro médico",
  "Gimnasio",
  "Centro deportivo",
  "Otros"
];

export default function Businesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      type_of_business: "",
      postal_code: "",
      province: "",
      city: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(ENDPOINTS.BUSINESSES_CREATE, data);
      toast({
        title: "Negocio creado",
        description: "El negocio se ha creado correctamente",
      });
      setIsDialogOpen(false);
      fetchBusinesses();
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "No se pudo crear el negocio",
        variant: "destructive",
      });
    }
  };

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get<Business[]>(ENDPOINTS.BUSINESSES);
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBusinesses();
  }, [isAuthenticated, navigate]);

  return (
    <AppSidebarWrapper>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mis Negocios</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus negocios y sus configuraciones
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Negocio
          </Button>
        </div>

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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Skeletons para carga
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="relative">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            businesses.map((business) => (
              <Card key={business.business_id} className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {business.name}
                  </CardTitle>
                  <CardDescription>{business.type_of_business}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>{business.address}</p>
                    <p>{business.city}, {business.postal_code}</p>
                    <p className="text-muted-foreground">CIF: {business.cif}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/configuracion`)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Configurar
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/agenda`)}
                  >
                    Ver Agenda
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
                {!business.configuration_is_completed && (
                  <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-bl-lg">
                    Configuración pendiente
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </AppSidebarWrapper>
  );
}
