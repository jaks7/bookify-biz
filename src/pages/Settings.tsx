
import React from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";

const Settings = () => {
  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Configuración</h1>
        <p>Personaliza los ajustes de tu cuenta y aplicación.</p>
      </div>
    </AppSidebarWrapper>
  );
};

export default Settings;
