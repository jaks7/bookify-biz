
import React from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";

const Clients = () => {
  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Clientes</h1>
        <p>Gestiona toda la información de tus clientes.</p>
      </div>
    </AppSidebarWrapper>
  );
};

export default Clients;
