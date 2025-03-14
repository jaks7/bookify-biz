
import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Cell, AreaChart, Area, Tooltip, Legend } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

export const AnalyticsSlideshow = () => {
  const [autoplay, setAutoplay] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Mock data for the charts
  const serviceData = [
    { name: 'Corte', value: 120, color: '#0088FE' },
    { name: 'Color', value: 80, color: '#00C49F' },
    { name: 'Manicura', value: 60, color: '#FFBB28' },
    { name: 'Pedicura', value: 40, color: '#FF8042' },
    { name: 'Facial', value: 30, color: '#8884d8' },
  ];

  const timeData = [
    { hour: '9h', appointments: 5 },
    { hour: '10h', appointments: 8 },
    { hour: '11h', appointments: 10 },
    { hour: '12h', appointments: 7 },
    { hour: '13h', appointments: 4 },
    { hour: '16h', appointments: 6 },
    { hour: '17h', appointments: 9 },
    { hour: '18h', appointments: 10 },
    { hour: '19h', appointments: 8 },
  ];

  const seasonalData = [
    { month: 'E', appointments: 150, revenue: 6000 },
    { month: 'F', appointments: 160, revenue: 6400 },
    { month: 'M', appointments: 180, revenue: 7200 },
    { month: 'A', appointments: 200, revenue: 8000 },
    { month: 'M', appointments: 220, revenue: 8800 },
    { month: 'J', appointments: 250, revenue: 10000 },
    { month: 'J', appointments: 230, revenue: 9200 },
    { month: 'A', appointments: 210, revenue: 8400 },
    { month: 'S', appointments: 200, revenue: 8000 },
    { month: 'O', appointments: 220, revenue: 8800 },
    { month: 'N', appointments: 240, revenue: 9600 },
    { month: 'D', appointments: 260, revenue: 10400 },
  ];

  useEffect(() => {
    let interval: number | null = null;
    
    if (autoplay) {
      interval = window.setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % 3);
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay]);

  // Pause autoplay when hovering over carousel
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  const slides = [
    {
      title: "Servicios más demandados",
      description: "Analiza qué servicios tienen mayor demanda en tu negocio",
      icon: <TrendingUp className="h-5 w-5 text-bookify-500" />,
      chart: (
        <ChartContainer config={{}} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} citas`]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      )
    },
    {
      title: "Horas de mayor afluencia",
      description: "Identifica las horas con mayor demanda de citas",
      icon: <Clock className="h-5 w-5 text-bookify-500" />,
      chart: (
        <ChartContainer config={{}} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} citas`]} />
              <Bar dataKey="appointments" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )
    },
    {
      title: "Estacionalidad del negocio",
      description: "Visualiza las temporadas altas y bajas de tu negocio",
      icon: <Users className="h-5 w-5 text-bookify-500" />,
      chart: (
        <ChartContainer config={{}} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={seasonalData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value) => [`${value}€`]} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#82ca9d" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      )
    }
  ];

  return (
    <div 
      className="w-full max-w-3xl mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <Card className="border-0 shadow-md">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  {slide.icon}
                  <div>
                    <CardTitle className="text-lg">{slide.title}</CardTitle>
                    <CardDescription>{slide.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[250px]">
                    {slide.chart}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4">
          <CarouselPrevious className="static translate-y-0 mr-2" />
          <CarouselNext className="static translate-y-0 ml-2" />
        </div>
      </Carousel>
      
      <div className="mt-6 text-center">
        <Link to="/inteligenciaNegocio">
          <Button className="bg-bookify-500 hover:bg-bookify-600">
            Ver análisis completo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AnalyticsSlideshow;
