
import React from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from 'lucide-react';

const DemoSettings = () => {
  const navigate = useNavigate();
  
  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Configuración</h1>
              <p className="text-muted-foreground mt-1">
                Personaliza los ajustes de tu cuenta y aplicación
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="business">Negocio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ajustes generales</CardTitle>
                  <CardDescription>
                    Gestiona tus preferencias generales de la aplicación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Esta sección te permite personalizar la aplicación según tus necesidades.
                  </p>
                  
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/demo/business-config')}
                  >
                    Ver configuración de negocio avanzada
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="business" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de negocio</CardTitle>
                  <CardDescription>
                    Información y ajustes de tu negocio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Administra la información de tu negocio, horarios comerciales y preferencias.
                  </p>
                  
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/demo/business-config')}
                  >
                    Editar configuración completa
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppSidebarWrapper>
  );
};

export default DemoSettings;
