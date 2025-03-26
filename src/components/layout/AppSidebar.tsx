
import React, { useState } from 'react';
import AppSidebar from './AppSidebar';

export const AppSidebarWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      <main className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 overflow-y-auto`}>
        {children}
      </main>
    </div>
  );
};

export default AppSidebar;
