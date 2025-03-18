
import React from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Clients = () => {
  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Clientes</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Listado de Clientes</CardTitle>
              <CardDescription>
                Gestiona toda la información de tus clientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aquí podrás gestionar los datos de tus clientes, su historial de citas y preferencias.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppSidebarWrapper>
  );
};

export default Clients;
