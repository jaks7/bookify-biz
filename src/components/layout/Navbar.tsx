
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Users, Tag } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Inicio', path: '/', icon: <Home size={20} /> },
    { name: 'Afiliados', path: '/afiliados', icon: <Users size={20} /> },
    { name: 'Precios', path: '/precios', icon: <Tag size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 transition-all duration-300 ${
        isScrolled ? 'py-4 glass-effect' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-horaLibre-500">Hora</span>
          <span className="ml-1 text-2xl font-bold">Libre</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-medium transition-colors hover:text-horaLibre-500 flex items-center gap-2 ${
                isActive(link.path) ? 'text-horaLibre-600' : 'text-gray-600'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="font-medium">
              Iniciar Sesión
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-horaLibre-500 hover:bg-horaLibre-600 text-white font-medium">
              Registrarse
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 glass-effect py-4 px-6 md:hidden animate-slide-down">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium py-2 transition-colors hover:text-horaLibre-500 flex items-center gap-2 ${
                  isActive(link.path) ? 'text-horaLibre-600' : 'text-gray-600'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
              <Link to="/login">
                <Button variant="ghost" className="w-full justify-center">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button className="w-full justify-center bg-horaLibre-500 hover:bg-horaLibre-600 text-white">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
