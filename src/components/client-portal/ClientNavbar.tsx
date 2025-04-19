
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/shared/Logo';

const ClientNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo section - made larger and more prominent */}
          <div className="flex-shrink-0">
            <Link to="/client_portal/business">
              <Logo 
                className="h-12 w-auto hover:scale-105 transition-transform" 
                showText={true} 
              />
            </Link>
          </div>

          {/* Right section - only "Para Negocios" button */}
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="font-medium">
                Para Negocios
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;
