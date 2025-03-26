
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Tag, 
  LayoutDashboard, 
  Settings, 
  Calendar, 
  ClipboardList, 
  Clock, 
  User, 
  Briefcase,
  Store
} from 'lucide-react';
import { cn } from "@/lib/utils";
import SidebarCollapseButton from "@/components/layout/SidebarCollapseButton";

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const AppSidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleCollapse }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Group navigation links by category
  const generalLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Negocios', path: '/businesses', icon: <Briefcase size={20} /> },
    { name: 'Mi perfil', path: '/mi_perfil', icon: <User size={20} /> },
  ];

  const businessLinks = [
    { name: 'Calendario', path: '/calendar', icon: <Calendar size={20} /> },
    { name: 'Agenda', path: '/agenda', icon: <ClipboardList size={20} /> },
    { name: 'Turnos', path: '/turnos', icon: <Clock size={20} /> },
    { name: 'Profesionales', path: '/professionals', icon: <Users size={20} /> },
    { name: 'Servicios', path: '/services', icon: <Tag size={20} /> },
    { name: 'Clientes', path: '/clients', icon: <Users size={20} /> },
    { name: 'Configuración', path: '/configuracion', icon: <Settings size={20} /> },
  ];

  return (
    <aside 
      className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed top-0 left-0 z-40`}
    >
      <div className="shrink-0 flex items-center justify-center h-16 border-b border-sidebar-border">
        {!isCollapsed && (
          <span className="text-2xl font-bold text-sidebar-foreground">
            HoraLibre
          </span>
        )}
      </div>

      <nav className="flex-grow py-4 overflow-y-auto">
        <div className="px-3 mb-2">
          <h2 className={`text-xs font-semibold text-muted-foreground uppercase tracking-wider ${isCollapsed ? 'text-center mb-2' : 'mb-3 ml-3'}`}>
            {!isCollapsed && "General"}
          </h2>
          <ul className="space-y-1">
            {generalLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground"
                    )
                  }
                >
                  <span className="flex items-center justify-center w-6 h-6">
                    {link.icon}
                  </span>
                  {!isCollapsed && <span className="ml-3">{link.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-3 mt-6">
          <h2 className={`text-xs font-semibold text-muted-foreground uppercase tracking-wider ${isCollapsed ? 'text-center mb-2' : 'mb-3 ml-3'}`}>
            {!isCollapsed && "Negocio Actual"}
          </h2>
          
          {!isCollapsed && (
            <div className="mb-3 px-3">
              <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-sidebar-foreground bg-sidebar-accent/20 rounded-md">
                <span>Seleccionar negocio</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
            </div>
          )}
          
          <ul className="space-y-1">
            {businessLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground"
                    )
                  }
                >
                  <span className="flex items-center justify-center w-6 h-6">
                    {link.icon}
                  </span>
                  {!isCollapsed && <span className="ml-3">{link.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 relative">
        <SidebarCollapseButton isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      </div>
    </aside>
  );
};

export default AppSidebar;
