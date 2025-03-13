
import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      heroRef.current.style.setProperty('--mouse-x', `${x}`);
      heroRef.current.style.setProperty('--mouse-y', `${y}`);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 background-gradient"
      style={{ 
        '--mouse-x': '0.5', 
        '--mouse-y': '0.5'
      } as React.CSSProperties}
    >
      <div className="absolute inset-0 background-gradient"></div>
      
      <div className="container px-6 md:px-10 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm mb-6 animate-fade-in">
            <span className="text-sm font-medium text-bookify-600">
              Mejora tu negocio con reservas sin complicaciones
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-up" style={{ animationDelay: '100ms' }}>
            Sistema de reservas inteligente para{' '}
            <span className="text-gradient">pequeños negocios</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
            Optimiza tu agenda, elimina las cancelaciones de última hora y brinda 
            una experiencia de reserva excepcional a tus clientes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <Link to="/login">
              <Button className="w-full sm:w-auto text-white bg-bookify-500 hover:bg-bookify-600 h-12 px-8 rounded-full btn-hover-effect">
                Empezar gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-full">
              Ver demostración
            </Button>
          </div>
          
          <div className="mt-16 animate-fade-up" style={{ animationDelay: '400ms' }}>
            <div className="relative mx-auto rounded-xl overflow-hidden shadow-2xl glass-effect">
              <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="pt-8">
                <img 
                  src="https://placehold.co/1200x700/f8fafc/e2e8f0?text=Dashboard+de+Bookify+Biz" 
                  alt="Dashboard de Bookify Biz" 
                  className="w-full h-auto"
                  style={{ maxHeight: '500px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle radial gradient that follows cursor */}
      <div 
        className="absolute pointer-events-none inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%), rgba(56, 189, 248, 0.15) 0%, rgba(255, 255, 255, 0) 50%)`
        }}
      ></div>
    </div>
  );
};

export default Hero;
