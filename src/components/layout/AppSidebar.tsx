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
import Logo from '@/components/shared/Logo';

const AppSidebar = ({ isCollapsed, toggleCollapse }: { isCollapsed: boolean; toggleCollapse: () => void }) => {
  const { currentBusiness, availableBusinesses, switchBusiness } = useAuth();
  const location = useLocation();
  const [isBusinessListOpen, setIsBusinessListOpen] = useState(false);
  const isMobile = useIsMobile();
  
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
      title: "Estadísticas",
      path: "/inteligenciaNegocio",
      icon: <BarChart4 size={20} />
    }
  ];
  
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
  
  const isDemoMode = location.pathname.startsWith('/demo');
  
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
          <div className="flex items-center justify-start p-4 border-b border-gray-100 h-16">
            <div className={cn(
              "flex items-center",
              !isCollapsed && "pl-3 scale-[3] ml-2"
            )}>
              <Logo showText={!isCollapsed} />
            </div>
          </div>
          
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="mb-6">
              {!isCollapsed && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  General
                </h3>
              )}
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
            
            <div className="my-4 border-t border-gray-200"></div>
            
            {!isDemoMode && (
              <div className="mb-6">
                {!isCollapsed && (
                  <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Negocio Actual
                  </h3>
                )}
                
                <div className="px-2 mb-4">
                  <button
                    className={cn(
                      "w-full flex items-center rounded-lg border border-gray-200 p-2 mb-2 text-left",
                      isCollapsed ? "justify-center" : "justify-between",
                      "hover:bg-gray-50 transition-colors"
                    )}
                    onClick={() => !isCollapsed && setIsBusinessListOpen(!isBusinessListOpen)}
                  >
                    {isCollapsed ? (
                      <Briefcase size={20} className="text-gray-700" />
                    ) : (
                      <>
                        <span className="font-medium truncate">
                          {currentBusiness?.name || "Seleccionar negocio"}
                        </span>
                        <ChevronDown 
                          size={16} 
                          className={`transform transition-transform ${isBusinessListOpen ? 'rotate-180' : ''}`}
                        />
                      </>
                    )}
                  </button>
                  
                  {isBusinessListOpen && !isCollapsed && availableBusinesses && availableBusinesses.length > 0 && (
                    <div className="mt-1 bg-white rounded-lg shadow-lg border border-gray-100 absolute z-30 w-[calc(100%-1.5rem)] max-w-[14rem]">
                      {availableBusinesses.map((business) => (
                        <button
                          key={business.business_id}
                          className={`w-full text-left p-2 text-sm hover:bg-gray-50 ${
                            currentBusiness?.business_id === business.business_id ? 'bg-horaLibre-50 text-horaLibre-600' : ''
                          }`}
                          onClick={() => {
                            switchBusiness(business);
                            setIsBusinessListOpen(false);
                          }}
                        >
                          {business.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
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
          
          <div className="md:block hidden">
            <SidebarCollapseButton isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
          </div>
        </div>
      </aside>
    </>
  );
};

export const AppSidebarWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

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

export default AppSidebar;
