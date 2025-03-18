
import React from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";

const Services = () => {
  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Servicios</h1>
        <p>Aquí podrás gestionar los servicios que ofrece tu negocio.</p>
      </div>
    </AppSidebarWrapper>
  );
};

export default Services;
