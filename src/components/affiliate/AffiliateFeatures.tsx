
import React from 'react';
import { Link } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Regístrate como afiliado',
    description: 'Crear tu cuenta de afiliado es rápido y sencillo. No requiere ningún pago ni compromiso inicial.'
  },
  {
    number: '02',
    title: 'Comparte tu enlace único',
    description: 'Recibe un enlace de afiliado personalizado para compartir con tus contactos y en tus redes sociales.'
  },
  {
    number: '03',
    title: 'Gana comisiones',
    description: 'Recibe 15€ por cada nuevo negocio que se suscriba a través de tu enlace. Pago rápido y sin complicaciones.'
  }
];

const testimonials = [
  {
    content: "Me uní al programa de afiliados hace apenas 3 meses y ya he ganado más de 300€ recomendando Bookify Biz a otros negocios de mi zona. El proceso es increíblemente sencillo.",
    author: "Carlos Rodríguez",
    role: "Propietario de gimnasio"
  },
  {
    content: "Como consultora de marketing para pequeñas empresas, recomiendo Bookify Biz a todos mis clientes. El programa de afiliados me permite generar ingresos adicionales mientras ayudo a mis clientes a mejorar su negocio.",
    author: "Laura Martínez",
    role: "Consultora de marketing"
  }
];

const AffiliateFeatures = () => {
  return (
    <section className="py-24 px-6 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* How it works section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cómo funciona nuestro <span className="text-gradient">programa de afiliados</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ganar con nuestro programa de afiliados es muy sencillo. Sigue estos tres pasos 
            y comienza a recibir comisiones por cada recomendación.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:bg-bookify-50 transition-colors duration-300"></div>
              
              <div className="relative">
                <span className="block text-4xl font-bold text-gray-100 mb-4">{step.number}</span>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Testimonials section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lo que dicen nuestros <span className="text-gradient">afiliados</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Descubre cómo otros afiliados están teniendo éxito con nuestro programa.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="p-8 rounded-2xl glass-effect"
              >
                <div className="mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="inline-block w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <blockquote className="text-gray-700 text-lg mb-6">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 overflow-hidden">
                    <img 
                      src={`https://placehold.co/200x200/e2e8f0/a0aec0?text=${testimonial.author.charAt(0)}`}
                      alt={testimonial.author} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Marketing materials section */}
        <div className="rounded-2xl bg-gradient-to-br from-bookify-500 to-bookify-700 p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Materiales de marketing listos para usar
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Te proporcionamos todos los materiales que necesitas para promocionar 
            Bookify Biz: banners, textos para correos, imágenes para redes sociales y más.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <Link className="h-6 w-6 text-white" />
              <span className="ml-2">Banners web</span>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <Link className="h-6 w-6 text-white" />
              <span className="ml-2">Plantillas de email</span>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <Link className="h-6 w-6 text-white" />
              <span className="ml-2">Imágenes para redes</span>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <Link className="h-6 w-6 text-white" />
              <span className="ml-2">Textos promocionales</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AffiliateFeatures;
