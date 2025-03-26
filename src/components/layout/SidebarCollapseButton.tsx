
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SidebarCollapseButtonProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarCollapseButton: React.FC<SidebarCollapseButtonProps> = ({ 
  isCollapsed, 
  toggleCollapse 
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleCollapse}
      className="absolute -right-4 top-6 h-8 w-8 rounded-full border bg-background shadow-md"
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
    </Button>
  );
};

export default SidebarCollapseButton;
