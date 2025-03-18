
import React from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const DemoSettings = () => {
  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Demo - Configuración</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Ajustes de la aplicación (Demo)</CardTitle>
              <CardDescription>
                Personaliza los ajustes de tu cuenta y aplicación.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aquí podrás modificar las preferencias generales, notificaciones y ajustes de tu cuenta.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppSidebarWrapper>
  );
};

export default DemoSettings;
