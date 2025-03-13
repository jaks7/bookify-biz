
import React from 'react';
import { ArrowRight, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const AffiliateHero = () => {
  return (
    <div className="relative pt-32 pb-20 px-6 md:px-10 background-gradient">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="w-full lg:w-1/2">
            <div className="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm mb-6 animate-fade-in">
              <span className="text-sm font-medium text-bookify-600">
                Programa de Afiliados
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight animate-fade-up" style={{ animationDelay: '100ms' }}>
              Gana <span className="text-gradient">15€</span> por cada negocio que recomiendas
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
              Recomienda horalibre.es a negocios que conoces y recibe 15€ por cada nueva 
              suscripción. Pago inmediato vía PayPal o tarjetas regalo de Amazon.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-bookify-50 flex items-center justify-center mt-1 mr-4">
                  <DollarSign className="h-5 w-5 text-bookify-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Pagos Rápidos</h3>
                  <p className="text-gray-600">Recibe tu recompensa en menos de 48 horas tras la suscripción</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-bookify-50 flex items-center justify-center mt-1 mr-4">
                  <svg className="h-5 w-5 text-bookify-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Sin Límites</h3>
                  <p className="text-gray-600">No hay límite en cuánto puedes ganar. Más recomendaciones, más ganancias.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
              <Link to="/login">
                <Button className="w-full sm:w-auto text-white bg-bookify-500 hover:bg-bookify-600 h-12 px-8 rounded-full btn-hover-effect">
                  Convertirse en afiliado
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-full">
                Cómo funciona
              </Button>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 animate-fade-up" style={{ animationDelay: '500ms' }}>
            <div className="glass-effect rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-bookify-500/10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-bookify-500/10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative z-10">
                <img 
                  src="https://placehold.co/600x400/f8fafc/e2e8f0?text=Programa+de+Afiliados" 
                  alt="Programa de afiliados" 
                  className="w-full h-auto rounded-xl mb-8"
                />
                
                <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-xl mb-4">Comisiones claras y transparentes</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">15€ por cada nuevo cliente que se suscriba</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Comisiones en PayPal o tarjetas regalo de Amazon</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Panel de control para seguir tus ganancias</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Materiales de marketing listos para usar</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateHero;
