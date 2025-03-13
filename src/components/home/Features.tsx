
import React from 'react';
import { 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Clock, 
  Users, 
  Globe,
  BellRing,
  Smartphone
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Calendario Inteligente',
    description: 'Gestiona tu agenda con un calendario intuitivo. Visualiza, añade y edita reservas fácilmente desde cualquier dispositivo.'
  },
  {
    icon: MessageSquare,
    title: 'Asistente Virtual',
    description: 'Automatiza la comunicación con tus clientes. Envía recordatorios, confirmaciones y agradecimientos automáticamente.'
  },
  {
    icon: Smartphone,
    title: 'Reservas por WhatsApp',
    description: 'Permite que tus clientes reserven directamente a través de WhatsApp. Sin fricción, sin aplicaciones adicionales.'
  },
  {
    icon: BarChart3,
    title: 'Estadísticas Detalladas',
    description: 'Analiza el rendimiento de tu negocio con informes detallados. Identifica tendencias y toma decisiones basadas en datos.'
  },
  {
    icon: Clock,
    title: 'Ahorro de Tiempo',
    description: 'Reduce el tiempo dedicado a gestionar reservas manuales. Enfócate en lo que realmente importa: tu negocio y tus clientes.'
  },
  {
    icon: BellRing,
    title: 'Recordatorios Automáticos',
    description: 'Reduce las cancelaciones y los no-shows con recordatorios automáticos antes de cada cita.'
  },
  {
    icon: Users,
    title: 'Gestión de Clientes',
    description: 'Mantén un registro detallado de tus clientes. Historial, preferencias y notas para ofrecer un servicio personalizado.'
  },
  {
    icon: Globe,
    title: 'Acceso desde Cualquier Lugar',
    description: 'Accede a tu sistema de reservas desde cualquier dispositivo y lugar con conexión a internet.'
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Todo lo que necesitas para <span className="text-gradient">optimizar tus reservas</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Diseñado específicamente para pequeños negocios como peluquerías, dentistas, 
            fisioterapeutas y más. Simple pero potente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="w-12 h-12 rounded-full bg-bookify-50 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-bookify-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
