
import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const PricingPlans = () => {
  const [annual, setAnnual] = useState(true);
  
  const features = [
    'Calendario de reservas en línea',
    'Recordatorios automáticos por email',
    'Reservas por WhatsApp',
    'Panel de administración',
    'Estadísticas básicas',
    'Soporte por email',
  ];
  
  const additionalFeatures = [
    'Personalización avanzada',
    'Integraciones con Google Calendar',
    'API para desarrolladores',
    'Soporte prioritario',
  ];
  
  return (
    <section className="py-24 px-6 md:px-10 relative overflow-hidden">
      <div className="absolute inset-0 background-gradient"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm mb-6 animate-fade-in">
            <span className="text-sm font-medium text-bookify-600">
              Precios simples y transparentes
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
            Un precio único con <span className="text-gradient">todo incluido</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '200ms' }}>
            Sin sorpresas, sin costes ocultos. Paga solo por lo que necesitas y cancela cuando quieras.
            14 días de prueba gratuita, sin tarjeta de crédito.
          </p>
          
          {/* Pricing toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 border border-gray-200 shadow-sm mb-12 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${annual ? 'bg-bookify-500 text-white' : 'text-gray-600 hover:text-bookify-700'}`}
              onClick={() => setAnnual(true)}
            >
              Anual
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${annual ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                Ahorra 140€
              </span>
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${!annual ? 'bg-bookify-500 text-white' : 'text-gray-600 hover:text-bookify-700'}`}
              onClick={() => setAnnual(false)}
            >
              Mensual
            </button>
          </div>
        </div>
        
        {/* Pricing Card */}
        <div className="max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '400ms' }}>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-10 flex flex-col md:flex-row items-start justify-between border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold mb-4">Plan Profesional</h2>
                <p className="text-gray-600 mb-6">Todo lo que necesitas para gestionar las reservas de tu negocio.</p>
                
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold">{annual ? '99,99€' : '19,99€'}</span>
                  <span className="text-gray-500 ml-2">{annual ? '/año' : '/mes'}</span>
                </div>
                
                {annual && (
                  <div className="mt-2 text-green-600 text-sm font-medium">
                    Ahorra 139,89€ al año
                  </div>
                )}
              </div>
              
              <div className="mt-8 md:mt-0 w-full md:w-auto">
                <Link to="/login">
                  <Button className="w-full md:w-auto text-white bg-bookify-500 hover:bg-bookify-600 h-12 px-8 rounded-full btn-hover-effect">
                    Empezar prueba gratuita
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-gray-500 text-sm mt-3 text-center">
                  14 días gratis. Sin tarjeta de crédito.
                </p>
              </div>
            </div>
            
            <div className="p-8 md:p-10">
              <h3 className="font-semibold mb-4">Incluye:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
                
                {additionalFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-semibold mb-4">También incluye:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-bookify-50">
                    <div className="font-semibold text-bookify-700 mb-1">Clientes ilimitados</div>
                    <p className="text-sm text-gray-600">Sin límite en tu base de datos de clientes</p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-bookify-50">
                    <div className="font-semibold text-bookify-700 mb-1">Reservas ilimitadas</div>
                    <p className="text-sm text-gray-600">Sin límite de reservas mensuales</p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-bookify-50">
                    <div className="font-semibold text-bookify-700 mb-1">Actualizaciones</div>
                    <p className="text-sm text-gray-600">Acceso a todas las nuevas funciones</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-gray-500">
            ¿Tienes preguntas sobre nuestros planes? <a href="#" className="text-bookify-600 hover:text-bookify-700 font-medium">Contacta con nosotros</a>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-8 text-center">Preguntas frecuentes</h3>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold mb-2">¿Puedo cancelar en cualquier momento?</h4>
              <p className="text-gray-600">Sí, puedes cancelar tu suscripción en cualquier momento. No hay compromiso de permanencia.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold mb-2">¿Qué métodos de pago aceptan?</h4>
              <p className="text-gray-600">Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), PayPal y transferencia bancaria.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold mb-2">¿Necesito instalar algún software?</h4>
              <p className="text-gray-600">No, Bookify Biz es una plataforma basada en la nube. Solo necesitas un navegador web e internet para acceder.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold mb-2">¿Hay límite de usuarios por cuenta?</h4>
              <p className="text-gray-600">El plan incluye 3 usuarios por defecto. Si necesitas más, contáctanos para opciones personalizadas.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
