
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo = ({ className = '', showText = true }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center justify-center ${className}`}>
      {!showText ? (
        <img 
          src="/lovable-uploads/45bab6b0-b272-4f59-b637-39da7d188267.png"
          alt="HoraLibre Logo"
          className="h-10 w-auto" // Increased size by ~30%
        />
      ) : (
        <img 
          src="/lovable-uploads/e236196c-8c65-4729-b724-357ef19dabfe.png"
          alt="HoraLibre"
          className="h-12 w-auto" // Made logo larger when expanded
        />
      )}
    </Link>
  );
};

export default Logo;
