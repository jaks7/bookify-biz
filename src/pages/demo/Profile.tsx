
import React from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

// Schema for validating profile form
const profileSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  surnames: z.string().min(2, { message: "Los apellidos deben tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }).optional(),
  phone: z.string().min(9, { message: "El teléfono debe tener al menos 9 caracteres" }),
  address: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const DemoProfile = () => {
  const { toast } = useToast();
  
  // Mock data for the profile
  const defaultProfile = {
    name: "Juan",
    surnames: "Pérez López",
    email: "juan.perez@example.com",
    phone: "666123456",
    address: "Calle Mayor 123, 28001 Madrid"
  };
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultProfile
  });

  const onSubmit = (values: ProfileFormValues) => {
    // In a real app, this would send the data to an API
    console.log("Profile updated:", values);
    
    toast({
      title: "Perfil actualizado",
      description: "Tus datos personales han sido actualizados correctamente.",
    });
  };

  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Demo - Mi Perfil</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-1">
              <CardHeader className="text-center">
                <div className="mx-auto bg-gray-100 p-6 rounded-full mb-4">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
                <CardTitle>{defaultProfile.name} {defaultProfile.surnames}</CardTitle>
                <CardDescription>{defaultProfile.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-center">
                <div>
                  <span className="text-sm text-muted-foreground">Teléfono:</span>
                  <p>{defaultProfile.phone}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Dirección:</span>
                  <p>{defaultProfile.address}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Actualiza tu información de contacto y datos personales.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" disabled {...field} />
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
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="mt-4">Guardar Cambios</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppSidebarWrapper>
  );
};

export default DemoProfile;
