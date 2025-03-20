
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart4,
  Briefcase,
  Calendar,
  ChevronDown,
  Cog,
  LayoutDashboard,
  List,
  ShoppingBag,
  User,
  UserRound,
  Users,
  Clock
} from "lucide-react";
import { useAuth } from "@/stores/authContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  SidebarSeparator,
  SidebarProvider
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export const AppSidebarWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export function AppSidebar() {
  const { currentBusiness, availableBusinesses, switchBusiness } = useAuth();
  const location = useLocation();
  const [isBusinessListOpen, setIsBusinessListOpen] = useState(false);
  
  // Common navigation items
  const commonItems = [
    {
      title: "Cuadro de mando",
      to: "/dashboard",
      icon: LayoutDashboard
    },
    {
      title: "Negocios",
      to: "/businesses",
      icon: Briefcase
    },
    {
      title: "Mi perfil",
      to: "/mi_perfil",
      icon: UserRound
    },
    {
      title: "Configuración",
      to: "/settings",
      icon: Cog
    }
  ];
  
  // Business-specific navigation items
  const businessItems = [
    {
      title: "Calendario",
      to: "/calendar",
      icon: Calendar
    },
    {
      title: "Agenda",
      to: "/agenda",
      icon: List
    },
    {
      title: "Turnos",
      to: "/turnos",
      icon: Clock
    },
    {
      title: "Profesionales",
      to: "/professionals",
      icon: Users
    },
    {
      title: "Servicios",
      to: "/services",
      icon: ShoppingBag
    },
    {
      title: "Clientes",
      to: "/clients",
      icon: User
    },
    {
      title: "Inteligencia de negocio",
      to: "/inteligenciaNegocio",
      icon: BarChart4
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <span className="text-bookify-600 text-xl font-bold">Bookify</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        {/* Common Items */}
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {commonItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.to)}
                    tooltip={item.title}
                  >
                    <Link to={item.to}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />
        
        {/* Business Selection & Business-specific Items */}
        <SidebarGroup>
          <SidebarGroupLabel>Negocio Actual</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Business Selector */}
            <Collapsible 
              open={isBusinessListOpen} 
              onOpenChange={setIsBusinessListOpen}
              className="w-full mb-2"
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-between"
                >
                  <span className="truncate">
                    {currentBusiness?.name || "Seleccionar negocio"}
                  </span>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    isBusinessListOpen && "rotate-180"
                  )} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1">
                <div className="border rounded-md p-1 space-y-1 bg-white">
                  {availableBusinesses.map((business) => (
                    <Button
                      key={business.business_id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left",
                        currentBusiness?.business_id === business.business_id && 
                        "bg-bookify-50 text-bookify-600"
                      )}
                      onClick={() => switchBusiness(business.business_id)}
                    >
                      {business.name}
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Business-specific menu items */}
            <SidebarMenu>
              {businessItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.to)}
                    tooltip={item.title}
                  >
                    <Link to={item.to}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">
          © Bookify {new Date().getFullYear()}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
