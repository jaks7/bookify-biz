
import React from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/stores/authContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Businesses = () => {
  const { availableBusinesses } = useAuth();
  
  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Mis Negocios</h1>
              <p className="text-muted-foreground">
                Gestiona todos tus negocios desde un solo lugar
              </p>
            </div>
            <Button className="bg-bookify-500 hover:bg-bookify-600">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Negocio
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableBusinesses.map(business => (
              <Card key={business.business_id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{business.name}</CardTitle>
                  <CardDescription>{business.type_of_business}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end">
                    <Button variant="outline">Ver Detalles</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppSidebarWrapper>
  );
};

export default Businesses;
