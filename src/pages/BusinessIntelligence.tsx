
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { ArrowUp, ArrowDown, Clock, Users, ShoppingBag, Gauge, TrendingUp } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BusinessIntelligence = () => {
  // Mock data for the charts
  const serviceData = [
    { name: 'Corte de pelo', appointments: 120, revenue: 2400, duration: 30, revenuePerHour: 80 },
    { name: 'Coloración', appointments: 80, revenue: 4000, duration: 60, revenuePerHour: 66.67 },
    { name: 'Manicura', appointments: 60, revenue: 1800, duration: 45, revenuePerHour: 40 },
    { name: 'Pedicura', appointments: 40, revenue: 1600, duration: 50, revenuePerHour: 32 },
    { name: 'Tratamiento facial', appointments: 30, revenue: 1500, duration: 60, revenuePerHour: 25 },
  ];

  const clientData = [
    { name: 'María García', visits: 12, revenue: 960, lastVisit: '2023-06-10' },
    { name: 'Juan Pérez', visits: 8, revenue: 640, lastVisit: '2023-06-15' },
    { name: 'Ana Martínez', visits: 7, revenue: 560, lastVisit: '2023-06-01' },
    { name: 'Carlos López', visits: 5, revenue: 400, lastVisit: '2023-05-20' },
    { name: 'Laura Sánchez', visits: 4, revenue: 320, lastVisit: '2023-04-30' },
  ];

  const inactiveClientData = [
    { name: 'Sofía González', lastVisit: '2023-01-15', daysSinceLastVisit: 145 },
    { name: 'David Rodríguez', lastVisit: '2023-02-10', daysSinceLastVisit: 120 },
    { name: 'Elena Fernández', lastVisit: '2023-02-25', daysSinceLastVisit: 105 },
  ];

  const timeData = [
    { hour: '9:00', appointments: 5, rate: 50 },
    { hour: '10:00', appointments: 8, rate: 80 },
    { hour: '11:00', appointments: 10, rate: 100 },
    { hour: '12:00', appointments: 7, rate: 70 },
    { hour: '13:00', appointments: 4, rate: 40 },
    { hour: '16:00', appointments: 6, rate: 60 },
    { hour: '17:00', appointments: 9, rate: 90 },
    { hour: '18:00', appointments: 10, rate: 100 },
    { hour: '19:00', appointments: 8, rate: 80 },
  ];

  const seasonalData = [
    { month: 'Ene', appointments: 150, revenue: 6000 },
    { month: 'Feb', appointments: 160, revenue: 6400 },
    { month: 'Mar', appointments: 180, revenue: 7200 },
    { month: 'Abr', appointments: 200, revenue: 8000 },
    { month: 'May', appointments: 220, revenue: 8800 },
    { month: 'Jun', appointments: 250, revenue: 10000 },
    { month: 'Jul', appointments: 230, revenue: 9200 },
    { month: 'Ago', appointments: 210, revenue: 8400 },
    { month: 'Sep', appointments: 200, revenue: 8000 },
    { month: 'Oct', appointments: 220, revenue: 8800 },
    { month: 'Nov', appointments: 240, revenue: 9600 },
    { month: 'Dic', appointments: 260, revenue: 10400 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Inteligencia de Negocio</h1>
              <p className="text-muted-foreground">
                Analiza el rendimiento de tu negocio con datos detallados y toma decisiones informadas.
              </p>
            </div>
          </div>

          <Tabs defaultValue="services" className="space-y-4">
            <TabsList className="w-full bg-white p-0 h-auto">
              <TabsTrigger
                value="services"
                className="data-[state=active]:bg-bookify-50 data-[state=active]:text-bookify-800 flex items-center gap-2 p-3 rounded-none"
              >
                <ShoppingBag className="h-4 w-4" />
                Servicios
              </TabsTrigger>
              <TabsTrigger
                value="clients"
                className="data-[state=active]:bg-bookify-50 data-[state=active]:text-bookify-800 flex items-center gap-2 p-3 rounded-none"
              >
                <Users className="h-4 w-4" />
                Clientes
              </TabsTrigger>
              <TabsTrigger
                value="time"
                className="data-[state=active]:bg-bookify-50 data-[state=active]:text-bookify-800 flex items-center gap-2 p-3 rounded-none"
              >
                <Clock className="h-4 w-4" />
                Tiempo
              </TabsTrigger>
            </TabsList>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Servicio Más Demandado</CardTitle>
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Corte de pelo</div>
                    <p className="text-xs text-muted-foreground">
                      120 citas en los últimos 30 días
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mayor Duración</CardTitle>
                    <Clock className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Coloración</div>
                    <p className="text-xs text-muted-foreground">
                      60 minutos de duración media
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mayores Ingresos</CardTitle>
                    <Gauge className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.000€</div>
                    <p className="text-xs text-muted-foreground">
                      Coloración (último mes)
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mejor Rendimiento</CardTitle>
                    <ArrowUp className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">80€/h</div>
                    <p className="text-xs text-muted-foreground">
                      Corte de pelo
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Demanda por Servicio</CardTitle>
                    <CardDescription>
                      Número de citas en los últimos 30 días
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ChartContainer config={{}} className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={serviceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip 
                            content={
                              <ChartTooltipContent 
                                formatter={(value, name) => [`${value} citas`, 'Demanda']}
                              />
                            } 
                          />
                          <Bar dataKey="appointments" fill="#10b981">
                            {serviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Ingresos por Servicio</CardTitle>
                    <CardDescription>
                      Total de ingresos en euros por cada servicio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ChartContainer config={{}} className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={serviceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="revenue"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {serviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip 
                            content={
                              <ChartTooltipContent 
                                formatter={(value, name) => [`${value}€`, name]}
                              />
                            } 
                          />
                          <ChartLegend content={<ChartLegendContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Clients Tab */}
            <TabsContent value="clients" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Mejores Clientes</CardTitle>
                    <CardDescription>
                      Clientes más frecuentes en los últimos 3 meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Visitas</TableHead>
                          <TableHead>Ingresos</TableHead>
                          <TableHead>Última Visita</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientData.map((client) => (
                          <TableRow key={client.name}>
                            <TableCell className="font-medium">{client.name}</TableCell>
                            <TableCell>{client.visits}</TableCell>
                            <TableCell>{client.revenue}€</TableCell>
                            <TableCell>{client.lastVisit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Clientes Inactivos</CardTitle>
                    <CardDescription>
                      Clientes que no han vuelto en los últimos 3 meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Última Visita</TableHead>
                          <TableHead>Días sin visitar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inactiveClientData.map((client) => (
                          <TableRow key={client.name}>
                            <TableCell className="font-medium">{client.name}</TableCell>
                            <TableCell>{client.lastVisit}</TableCell>
                            <TableCell>{client.daysSinceLastVisit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Ingresos por Cliente</CardTitle>
                  <CardDescription>
                    Contribución de cada cliente a los ingresos totales
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer config={{}} className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={clientData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <ChartTooltip 
                          content={
                            <ChartTooltipContent 
                              formatter={(value, name) => [`${value}€`, 'Ingresos']}
                            />
                          } 
                        />
                        <Bar dataKey="revenue" fill="#8884d8">
                          {clientData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Time Tab */}
            <TabsContent value="time" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Horas de Alta Demanda</CardTitle>
                    <CardDescription>
                      Distribución de citas a lo largo del día
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ChartContainer config={{}} className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={timeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <ChartTooltip 
                            content={
                              <ChartTooltipContent 
                                formatter={(value, name) => [`${value} citas`, 'Demanda']}
                              />
                            } 
                          />
                          <Bar dataKey="appointments" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tasa de Ocupación por Hora</CardTitle>
                    <CardDescription>
                      Porcentaje de ocupación para cada hora
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ChartContainer config={{}} className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={timeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis unit="%" />
                          <ChartTooltip 
                            content={
                              <ChartTooltipContent 
                                formatter={(value, name) => [`${value}%`, 'Ocupación']}
                              />
                            } 
                          />
                          <Bar dataKey="rate" fill="#6366f1">
                            {timeData.map((entry) => (
                              <Cell 
                                key={`cell-${entry.hour}`} 
                                fill={entry.rate >= 80 ? '#ef4444' : entry.rate >= 50 ? '#f59e0b' : '#10b981'} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Temporadas Altas y Bajas</CardTitle>
                  <CardDescription>
                    Evolución de citas e ingresos a lo largo del año
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer config={{}} className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={seasonalData}>
                        <defs>
                          <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <CartesianGrid strokeDasharray="3 3" />
                        <ChartTooltip 
                          content={
                            <ChartTooltipContent 
                              formatter={(value, name) => {
                                if (name === "appointments") return [`${value} citas`, "Citas"];
                                if (name === "revenue") return [`${value}€`, "Ingresos"];
                                return [value, name];
                              }}
                            />
                          } 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="appointments" 
                          stroke="#8884d8" 
                          fillOpacity={1} 
                          fill="url(#colorAppointments)" 
                          yAxisId="left" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#82ca9d" 
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                          yAxisId="right" 
                        />
                        <ChartLegend 
                          content={
                            <ChartLegendContent 
                              payload={[
                                { value: 'Citas', color: '#8884d8', dataKey: 'appointments' },
                                { value: 'Ingresos', color: '#82ca9d', dataKey: 'revenue' }
                              ]} 
                            />
                          } 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessIntelligence;
