
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  List, 
  Clock, 
  Users, 
  ShoppingBag, 
  User, 
  Cog, 
  BarChart4, 
  Briefcase, 
  UserRound,
  ChevronDown,
  Menu
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SidebarCollapseButton from './SidebarCollapseButton';
import { useAuth } from '@/stores/authContext';
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile';
import "@/styles/sidebar.css";

// Define the side navigation component
const AppSidebar = ({ isCollapsed, toggleCollapse }: { isCollapsed: boolean; toggleCollapse: () => void }) => {
  const { currentBusiness, availableBusinesses, switchBusiness } = useAuth();
  const location = useLocation();
  const [isBusinessListOpen, setIsBusinessListOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Common navigation items
  const commonItems = [
    {
      title: "Cuadro de mando",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      title: "Negocios",
      path: "/businesses",
      icon: <Briefcase size={20} />
    },
    {
      title: "Mi perfil",
      path: "/mi_perfil",
      icon: <UserRound size={20} />
    }
  ];
  
  // Business-specific navigation items
  const businessItems = [
    {
      title: "Calendario",
      path: "/calendar",
      icon: <Calendar size={20} />
    },
    {
      title: "Agenda",
      path: "/agenda",
      icon: <List size={20} />
    },
    {
      title: "Turnos",
      path: "/turnos",
      icon: <Clock size={20} />
    },
    {
      title: "Profesionales",
      path: "/professionals",
      icon: <Users size={20} />
    },
    {
      title: "Servicios",
      path: "/services",
      icon: <ShoppingBag size={20} />
    },
    {
      title: "Clientes",
      path: "/clients",
      icon: <User size={20} />
    },
    {
      title: "Configuración",
      path: "/configuracion",
      icon: <Cog size={20} />
    },
    {
      title: "Inteligencia de negocio",
      path: "/inteligenciaNegocio",
      icon: <BarChart4 size={20} />
    }
  ];
  
  // For demo routes - using the predefined paths for the demo
  const demoItems = [
    {
      title: "Dashboard",
      path: "/demo/dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      title: "Agenda",
      path: "/demo/agenda",
      icon: <List size={20} />
    },
    {
      title: "Profesionales",
      path: "/demo/professionals",
      icon: <Users size={20} />
    },
    {
      title: "Servicios",
      path: "/demo/services",
      icon: <ShoppingBag size={20} />
    },
    {
      title: "Configuración",
      path: "/demo/configuracion",
      icon: <Cog size={20} />
    }
  ];
  
  // Determine if we're in demo mode based on the path
  const isDemoMode = location.pathname.startsWith('/demo');
  
  // Mobile sidebar toggle button
  const MobileToggleButton = () => (
    <button
      className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
      onClick={toggleCollapse}
      aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
    >
      <Menu size={24} />
    </button>
  );

  return (
    <>
      <MobileToggleButton />
      <aside 
        className={cn(
          "fixed left-0 top-0 z-20 h-screen bg-white border-r border-gray-200 transition-all duration-300",
          isCollapsed ? "sidebar-collapsed" : "sidebar-expanded",
          isMobile && isCollapsed ? "translate-x-[-100%]" : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header with logo */}
          <div className="flex items-center p-4 border-b border-gray-100">
            <Link to={isDemoMode ? "/demo/dashboard" : "/dashboard"} className="flex items-center">
              <span className="text-xl font-bold text-horaLibre-500">Hora</span>
              {!isCollapsed && <span className="ml-1 text-xl font-bold">Libre</span>}
            </Link>
          </div>
          
          {/* Common navigation items */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="mb-6">
              <ul className="space-y-2">
                {commonItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center p-2 rounded-lg transition-colors",
                        location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                          ? "bg-horaLibre-50 text-horaLibre-600"
                          : "text-gray-600 hover:bg-gray-100",
                        isCollapsed ? "justify-center" : "justify-start"
                      )}
                    >
                      <span className="flex items-center justify-center">{item.icon}</span>
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Business selector (only show in regular mode, not demo) */}
            {!isDemoMode && !isCollapsed && availableBusinesses && availableBusinesses.length > 0 && (
              <div className="mb-6 px-2 py-2 border-t border-b border-gray-100">
                <button
                  className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsBusinessListOpen(!isBusinessListOpen)}
                >
                  <span className="text-sm font-medium truncate">
                    {currentBusiness?.name || "Seleccionar negocio"}
                  </span>
                  <ChevronDown size={16} className={`transform transition-transform ${isBusinessListOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isBusinessListOpen && (
                  <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-100 z-30">
                    {availableBusinesses.map((business) => (
                      <button
                        key={business.business_id}
                        className={`w-full text-left p-2 text-sm hover:bg-gray-50 ${
                          currentBusiness?.business_id === business.business_id ? 'bg-horaLibre-50 text-horaLibre-600' : ''
                        }`}
                        onClick={() => {
                          switchBusiness(business.business_id);
                          setIsBusinessListOpen(false);
                        }}
                      >
                        {business.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Business-specific navigation items */}
            {!isDemoMode && (
              <div>
                <ul className="space-y-2">
                  {businessItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center p-2 rounded-lg transition-colors",
                          location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                            ? "bg-horaLibre-50 text-horaLibre-600"
                            : "text-gray-600 hover:bg-gray-100",
                          isCollapsed ? "justify-center" : "justify-start"
                        )}
                      >
                        <span className="flex items-center justify-center">{item.icon}</span>
                        {!isCollapsed && <span className="ml-3">{item.title}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Demo mode items */}
            {isDemoMode && (
              <div>
                <ul className="space-y-2">
                  {demoItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center p-2 rounded-lg transition-colors",
                          location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                            ? "bg-horaLibre-50 text-horaLibre-600"
                            : "text-gray-600 hover:bg-gray-100",
                          isCollapsed ? "justify-center" : "justify-start"
                        )}
                      >
                        <span className="flex items-center justify-center">{item.icon}</span>
                        {!isCollapsed && <span className="ml-3">{item.title}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>
          
          {/* Collapse button - only show on desktop */}
          <div className="md:block hidden">
            <SidebarCollapseButton isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
          </div>
        </div>
      </aside>
    </>
  );
};

// Define the AppSidebarWrapper component
export const AppSidebarWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  // Set sidebar to collapsed by default on mobile
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      <main 
        className={cn(
          "flex-1 transition-all duration-300 overflow-y-auto",
          isMobile 
            ? "ml-0" 
            : (isCollapsed ? 'ml-20' : 'ml-64')
        )}
      >
        {children}
      </main>
    </div>
  );
};

// Export the AppSidebar component as default
export default AppSidebar;
