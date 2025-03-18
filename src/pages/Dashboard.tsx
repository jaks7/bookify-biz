
import React from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Cuadro de Mando</h1>
          <p className="text-muted-foreground mb-6">
            Bienvenido a tu dashboard. Aquí puedes ver el resumen de todos tus negocios.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
                <CardDescription>Vista general de la actividad</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Contenido del dashboard pendiente de implementar</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppSidebarWrapper>
  );
};

export default Dashboard;
