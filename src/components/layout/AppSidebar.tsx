import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, Tag, LayoutDashboard, Settings } from 'lucide-react';
import { cn } from "@/lib/utils";
import SidebarCollapseButton from "@/components/layout/SidebarCollapseButton";

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const AppSidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleCollapse }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const sidebarWidth = isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded';
  const textVisibility = isCollapsed ? 'sidebar-text-hidden' : 'sidebar-text';

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { name: 'Inicio', path: '/', icon: <Home size={16} /> },
    { name: 'Afiliados', path: '/afiliados', icon: <Users size={16} /> },
    { name: 'Precios', path: '/precios', icon: <Tag size={16} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={16} /> },
  ];

  return (
    <aside className={`sidebar ${sidebarWidth} bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed top-0 left-0 z-40`}>
      <div className="shrink-0 flex items-center justify-center h-16">
        <span className={`text-2xl font-bold ${textVisibility} text-sidebar-foreground`}>
          HoraLibre
        </span>
      </div>

      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground"
                  )
                }
              >
                <div className="sidebar-icon-container">
                  {link.icon}
                </div>
                <span className={`${textVisibility} ml-3`}>{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4">
        <SidebarCollapseButton isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      </div>
    </aside>
  );
};

export default AppSidebar;
