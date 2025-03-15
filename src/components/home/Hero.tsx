
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { AgendaPreview } from '@/components/home/AgendaPreview';
import { CalendarPreview } from '@/components/home/CalendarPreview';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activePreview, setActivePreview] = useState<'agenda' | 'calendar'>('agenda');
  
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
    
    // Auto switch between previews
    const interval = setInterval(() => {
      setActivePreview(prev => prev === 'agenda' ? 'calendar' : 'agenda');
    }, 5000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
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
                <div className="relative">
                  <div 
                    className={`transition-opacity duration-500 ${activePreview === 'agenda' ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                    style={{ zIndex: activePreview === 'agenda' ? 1 : 0 }}
                  >
                    <AgendaPreview />
                  </div>
                  <div 
                    className={`transition-opacity duration-500 ${activePreview === 'calendar' ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                    style={{ zIndex: activePreview === 'calendar' ? 1 : 0 }}
                  >
                    <CalendarPreview />
                  </div>
                </div>
                <div className="flex justify-center mt-4 pb-4">
                  <div className="flex space-x-2">
                    <button 
                      className={`w-2 h-2 rounded-full transition-colors ${activePreview === 'agenda' ? 'bg-bookify-500' : 'bg-gray-300'}`}
                      onClick={() => setActivePreview('agenda')}
                      aria-label="Ver vista de agenda"
                    />
                    <button 
                      className={`w-2 h-2 rounded-full transition-colors ${activePreview === 'calendar' ? 'bg-bookify-500' : 'bg-gray-300'}`}
                      onClick={() => setActivePreview('calendar')}
                      aria-label="Ver vista de calendario"
                    />
                  </div>
                </div>
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
