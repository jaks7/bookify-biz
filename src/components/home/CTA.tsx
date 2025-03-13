
import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const CTA = () => {
  const benefits = [
    'Prueba gratuita de 14 días sin compromiso',
    'Configuración sencilla en menos de 5 minutos',
    'Soporte personalizado durante todo el proceso',
    'Sin contratos a largo plazo, cancela cuando quieras'
  ];

  return (
    <section className="py-24 px-6 md:px-10 relative overflow-hidden">
      <div className="absolute inset-0 background-gradient"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="glass-effect rounded-3xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Empieza a <span className="text-gradient">optimizar tu negocio</span> hoy mismo
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Únete a miles de negocios que ya están aprovechando HoraLibre 
                para mejorar su eficiencia y aumentar sus ingresos.
              </p>
              
              <ul className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-3 h-6 w-6 flex items-center justify-center rounded-full bg-green-50">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </span>
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button className="w-full sm:w-auto text-white bg-bookify-500 hover:bg-bookify-600 h-12 px-8 rounded-full btn-hover-effect">
                    Empezar ahora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/precios">
                  <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-full">
                    Ver planes
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-bookify-500 to-bookify-700 p-8 md:p-12 lg:p-16 flex items-center justify-center">
              <div className="max-w-md text-white">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold">⭐</span>
                  </div>
                  <div>
                    <p className="text-lg font-medium">Calificación promedio</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                
                <blockquote className="text-white/90 text-lg italic mb-6">
                  "HoraLibre ha transformado mi peluquería. Ya no tengo huecos en mi agenda
                  y he reducido las cancelaciones en un 80%. Increíble herramienta."
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                    <img 
                      src="https://placehold.co/200x200/e2e8f0/a0aec0?text=M" 
                      alt="Foto de cliente" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">María García</p>
                    <p className="text-white/70 text-sm">Propietaria, Belleza Natural</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
