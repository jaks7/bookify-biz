
import React from 'react';
import { AppSidebarWrapper } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { CalendarDays, Users, ShoppingBag, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Mock data for the dashboard
const appointmentsData = [
  { name: 'Lun', value: 12 },
  { name: 'Mar', value: 19 },
  { name: 'Mié', value: 15 },
  { name: 'Jue', value: 22 },
  { name: 'Vie', value: 30 },
  { name: 'Sáb', value: 18 },
  { name: 'Dom', value: 0 },
];

const revenueData = [
  { name: 'Ene', value: 4000 },
  { name: 'Feb', value: 3500 },
  { name: 'Mar', value: 5000 },
  { name: 'Abr', value: 4200 },
  { name: 'May', value: 5800 },
  { name: 'Jun', value: 6000 },
  { name: 'Jul', value: 6500 },
];

const servicesData = [
  { name: 'Consulta General', value: 35 },
  { name: 'Tratamiento Intensivo', value: 28 },
  { name: 'Revisión Rápida', value: 45 },
  { name: 'Limpieza Profunda', value: 22 },
  { name: 'Asesoramiento', value: 15 },
];

// Widget component for key metrics
const StatWidget = ({ title, value, icon: Icon, trend, trendValue }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="bg-primary/10 p-3 rounded-full">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          {trend === 'up' ? (
            <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-rose-500 mr-1" />
          )}
          <span className={trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}>
            {trendValue}
          </span>
          <span className="text-muted-foreground ml-1">vs mes anterior</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const DemoDashboard = () => {
  return (
    <AppSidebarWrapper>
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Demo - Cuadro de Mando</h1>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatWidget 
              title="Citas Totales" 
              value="128" 
              icon={CalendarDays}
              trend="up"
              trendValue="12%"
            />
            <StatWidget 
              title="Clientes Activos" 
              value="85" 
              icon={Users}
              trend="up"
              trendValue="8%"
            />
            <StatWidget 
              title="Servicios Realizados" 
              value="152" 
              icon={ShoppingBag}
              trend="up"
              trendValue="23%"
            />
            <StatWidget 
              title="Ingresos Mensuales" 
              value="6.250 €" 
              icon={CreditCard}
              trend="up"
              trendValue="15%"
            />
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Citas por día</CardTitle>
                <CardDescription>
                  Número de citas programadas en la última semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={appointmentsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ingresos mensuales</CardTitle>
                <CardDescription>
                  Evolución de ingresos en los últimos 7 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} €`, 'Ingresos']} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#6366f1" 
                        strokeWidth={2}
                        dot={{ fill: '#6366f1', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Services Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Popularidad de servicios</CardTitle>
              <CardDescription>
                Número de servicios realizados por tipo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={servicesData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppSidebarWrapper>
  );
};

export default DemoDashboard;
