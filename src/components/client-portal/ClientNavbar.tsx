
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/stores/authContext';
import { Button } from '@/components/ui/button';
import { UserRound } from 'lucide-react';
import Logo from '@/components/shared/Logo';

const ClientNavbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo section */}
          <div className="flex-shrink-0">
            <Link to="/client_portal/business">
              <Logo showText={true} />
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="font-medium">
                Para Negocios
              </Button>
            </Link>
            
            <Link to={isAuthenticated ? "/mi_perfil" : "/login"}>
              <Button variant="outline" className="flex items-center gap-2">
                <UserRound size={20} />
                {isAuthenticated ? "Mi Perfil" : "Iniciar Sesión"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;
