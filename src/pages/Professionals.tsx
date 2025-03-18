
import React from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";

const Professionals = () => {
  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Profesionales</h1>
        <p>Gestiona los profesionales que trabajan en tu negocio.</p>
      </div>
    </AppSidebarWrapper>
  );
};

export default Professionals;
