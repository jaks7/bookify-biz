import React from "react";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import CTA from "@/components/home/CTA";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnalyticsSlideshow from "@/components/home/AnalyticsSlideshow";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <section id="ai-revolution" className="py-24 px-6 md:px-10 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              La <span className="text-gradient">revolución IA</span> para tu negocio
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Las mismas herramientas que usan las grandes multinacionales, ahora al alcance de tu pequeño negocio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Métricas avanzadas para decisiones inteligentes</h3>
              <p className="text-gray-600 mb-6">
                Analiza patrones de reservas, horas pico, servicios más solicitados y comportamiento de clientes. 
                Toma decisiones basadas en datos reales para optimizar tu negocio.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-3 h-6 w-6 flex items-center justify-center rounded-full bg-green-50">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-gray-700">Identifica horas de mayor demanda</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 h-6 w-6 flex items-center justify-center rounded-full bg-green-50">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-gray-700">Analiza servicios más rentables</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 h-6 w-6 flex items-center justify-center rounded-full bg-green-50">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-gray-700">Prevé temporadas altas y bajas</span>
                </li>
              </ul>
            </div>
            
            <div className="glass-effect rounded-xl overflow-hidden shadow-xl">
              <div className="p-2 bg-gray-50 border-b">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="p-6">
                <AnalyticsSlideshow />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-24">
            <div className="order-2 md:order-1 glass-effect rounded-xl overflow-hidden shadow-xl">
              <div className="p-2 bg-gray-50 border-b">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="p-6">
                <img 
                  src="https://placehold.co/800x500/f8fafc/e2e8f0?text=WhatsApp+Integration" 
                  alt="Integración WhatsApp" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-semibold mb-4">Reservas sin fricciones por WhatsApp</h3>
              <p className="text-gray-600 mb-6">
                Permite que tus clientes reserven directamente desde WhatsApp, donde ya están 
                cómodos. Sin aplicaciones adicionales, sin formularios complicados.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-3 h-6 w-6 flex items-center justify-center rounded-full bg-green-50">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-gray-700">Proceso simple de 3 pasos para el cliente</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 h-6 w-6 flex items-center justify-center rounded-full bg-green-50">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-gray-700">Confirmaciones automáticas</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 h-6 w-6 flex items-center justify-center rounded-full bg-green-50">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span className="text-gray-700">Sincronización instantánea con tu calendario</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section id="testimonials" className="py-24 px-6 md:px-10 bg-bookify-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lo que dicen <span className="text-gradient">nuestros clientes</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Más de 1,000 negocios ya están optimizando su tiempo y aumentando sus ingresos con HoraLibre.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "Desde que empezamos a usar HoraLibre, hemos reducido las citas perdidas en un 80% y aumentado nuestros ingresos en un 30%. Los clientes adoran la facilidad para reservar."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                  <img 
                    src="https://placehold.co/200x200/e2e8f0/a0aec0?text=JP" 
                    alt="Foto de cliente" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">Juan Pérez</p>
                  <p className="text-gray-500 text-sm">Peluquería Estilo Único</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "El asistente virtual es una maravilla. Responde preguntas de los pacientes 24/7 y les guía en el proceso de reserva. Ha liberado horas de trabajo administrativo cada semana."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                  <img 
                    src="https://placehold.co/200x200/e2e8f0/a0aec0?text=LS" 
                    alt="Foto de cliente" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">Dra. Laura Sánchez</p>
                  <p className="text-gray-500 text-sm">Clínica Dental Sonrisas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "Las métricas me han permitido ajustar mi horario según la demanda real. Ahora optimizo las horas de mayor afluencia y he aumentado mis ingresos significativamente."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                  <img 
                    src="https://placehold.co/200x200/e2e8f0/a0aec0?text=CR" 
                    alt="Foto de cliente" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">Carlos Rodríguez</p>
                  <p className="text-gray-500 text-sm">Fisioterapia Bienestar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="benefits" className="py-24 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lleva tu negocio al <span className="text-gradient">siguiente nivel</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Más ingresos, menos estrés y más tiempo para ti. Así es como HoraLibre 
              transforma tu pequeño negocio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-bookify-50 flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-bookify-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Aumenta tus ingresos</h3>
              <p className="text-gray-600">
                Reduce cancelaciones y no-shows, optimiza tu agenda y maximiza el valor de cada cliente 
                con recordatorios automáticos y una experiencia de reserva excepcional.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-bookify-50 flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-bookify-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Recupera tu tiempo</h3>
              <p className="text-gray-600">
                Automatiza tareas administrativas como confirmaciones, recordatorios y seguimiento 
                de clientes. Dedica ese tiempo a lo que realmente importa: tu negocio y tu vida.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-bookify-50 flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-bookify-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Toma decisiones inteligentes</h3>
              <p className="text-gray-600">
                Utiliza datos reales para identificar tendencias, optimizar tu oferta y 
                ajustar tus servicios a lo que tus clientes realmente quieren y necesitan.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
