
import React, { useState } from 'react';
import { Home, Calendar, Users, Settings, Tag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SidebarCollapseButton from './SidebarCollapseButton';
import { cn } from "@/lib/utils";
import "@/styles/sidebar.css";

// Define the sidebar links
const sidebarLinks = [
  { name: 'Dashboard', path: '/demo/dashboard', icon: <Home size={20} /> },
  { name: 'Agenda', path: '/demo/agenda', icon: <Calendar size={20} /> },
  { name: 'Profesionales', path: '/demo/professionals', icon: <Users size={20} /> },
  { name: 'Servicios', path: '/demo/services', icon: <Tag size={20} /> },
  { name: 'Configuración', path: '/demo/configuracion', icon: <Settings size={20} /> },
];

// Define the AppSidebar component
const AppSidebar = ({ isCollapsed, toggleCollapse }: { isCollapsed: boolean; toggleCollapse: () => void }) => {
  const location = useLocation();
  
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-20 h-screen bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar header with logo */}
        <div className="flex items-center p-4 border-b border-gray-100">
          <Link to="/demo/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-horaLibre-500">Hora</span>
            {!isCollapsed && <span className="ml-1 text-xl font-bold">Libre</span>}
          </Link>
        </div>
        
        {/* Sidebar navigation links */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={cn(
                    "flex items-center p-2 rounded-lg transition-colors",
                    location.pathname === link.path
                      ? "bg-horaLibre-50 text-horaLibre-600"
                      : "text-gray-600 hover:bg-gray-100",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <span className="flex items-center justify-center">{link.icon}</span>
                  {!isCollapsed && <span className="ml-3">{link.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Collapse button */}
        <SidebarCollapseButton isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      </div>
    </aside>
  );
};

// Define the AppSidebarWrapper component
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

// Export the AppSidebar component as default
export default AppSidebar;
