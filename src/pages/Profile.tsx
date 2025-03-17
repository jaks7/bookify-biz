
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/authContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { User, Building, Phone, MapPin, Mail, LogOut, ArrowLeftRight, CreditCard, Calendar, CheckCircle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  // Mocked subscription data
  const subscription = {
    plan: 'Plan Profesional',
    status: 'Activo',
    startDate: '15/03/2024',
    endDate: '15/03/2025',
    nextBilling: '15/03/2025',
    amount: '99,99€',
    paymentMethod: 'Visa terminada en 4242',
    features: [
      'Calendario de reservas en línea',
      'Recordatorios automáticos por email',
      'Reservas por WhatsApp',
      'Panel de administración',
      'Estadísticas básicas',
      'Soporte por email',
    ]
  };
  
  useEffect(() => {
    async function loadUserData() {
      if (!auth.isAuthenticated) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      try {
        await auth.fetchUserData();
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del perfil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadUserData();
  }, [auth, navigate, toast]);

  const handleLogout = () => {
    auth.logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate('/login');
  };

  const handleSwitchBusiness = (businessId: string) => {
    auth.switchBusiness(businessId);
    toast({
      title: "Negocio cambiado",
      description: "Has cambiado de negocio correctamente",
    });
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="personal" className="text-center">
            <User className="mr-2 h-4 w-4" />
            Información Personal
          </TabsTrigger>
          <TabsTrigger value="subscription" className="text-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Plan y Suscripción
          </TabsTrigger>
        </TabsList>
        
        {/* Pestaña de Información Personal */}
        <TabsContent value="personal" className="space-y-6">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Información personal */}
            <Card className="col-span-3 md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> 
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <>
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre completo</p>
                      <p className="font-medium">{auth.profile?.name} {auth.profile?.surnames}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p>{auth.user?.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p>{auth.profile?.phone || 'No especificado'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p>{auth.profile?.address || 'No especificada'}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => toast({
                    title: "Información",
                    description: "Edición de perfil no implementada en esta versión",
                  })}
                >
                  Editar perfil
                </Button>
              </CardFooter>
            </Card>
            
            {/* Negocio actual */}
            <Card className="col-span-3 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" /> 
                  Negocio Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <>
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre del negocio</p>
                      <p className="font-medium">{auth.currentBusiness?.name || 'Sin negocio'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de negocio</p>
                      <p>{auth.currentBusiness?.type_of_business || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estado</p>
                      <p>
                        {auth.currentBusiness?.configuration_is_completed
                          ? 'Configuración completada'
                          : 'Pendiente de configurar'}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
              {!auth.currentBusiness?.configuration_is_completed && (
                <CardFooter>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate('/onboarding')}
                  >
                    Completar configuración
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            {/* Negocios disponibles */}
            {auth.availableBusinesses.length > 1 && (
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Mis Negocios</CardTitle>
                  <CardDescription>
                    Puedes cambiar entre tus diferentes negocios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <>
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                      </>
                    ) : (
                      auth.availableBusinesses.map((business) => (
                        <div 
                          key={business.business_id}
                          className={`p-4 rounded-lg border flex justify-between items-center ${
                            business.business_id === auth.currentBusiness?.business_id
                              ? 'bg-primary/5 border-primary/20'
                              : 'hover:bg-accent cursor-pointer'
                          }`}
                          onClick={() => {
                            if (business.business_id !== auth.currentBusiness?.business_id) {
                              handleSwitchBusiness(business.business_id);
                            }
                          }}
                        >
                          <div>
                            <p className="font-medium">{business.name}</p>
                            <p className="text-sm text-muted-foreground">{business.type_of_business}</p>
                          </div>
                          {business.business_id === auth.currentBusiness?.business_id ? (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Activo</span>
                          ) : (
                            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Pestaña de Plan y Suscripción */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Detalles de tu suscripción
              </CardTitle>
              <CardDescription>
                Gestiona tu suscripción y revisa los detalles de tu plan actual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-primary/5 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="font-medium text-lg">{subscription.plan}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Estado: <span className="text-green-600 font-medium">{subscription.status}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 md:items-end">
                  <div className="text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 inline mr-1" /> 
                    Próxima renovación: {subscription.nextBilling}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4 inline mr-1" />
                    {subscription.paymentMethod}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Ciclo de facturación</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Periodo actual</span>
                    <span className="font-medium">{subscription.startDate} - {subscription.endDate}</span>
                  </div>
                  
                  <div className="h-2 relative">
                    <Progress value={25} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Inicio</span>
                    <span>25% completado</span>
                    <span>Renovación</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Detalles del plan</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <div className="text-lg font-semibold">
                      {subscription.amount} <span className="text-sm font-normal text-muted-foreground">/ año</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Cambiar plan
                    </Button>
                  </div>
                  
                  <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {subscription.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <CollapsibleContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {subscription.features.slice(4).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                    
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full mt-2">
                        {isOpen ? (
                          <> 
                            <ChevronUp className="h-4 w-4 mr-2" />
                            Ver menos
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-2" />
                            Ver todos los beneficios
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row gap-3">
              <Button variant="outline" className="w-full md:w-auto" onClick={() => navigate('/precios')}>
                Ver planes disponibles
              </Button>
              <Button className="w-full md:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                Renovar suscripción
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial de facturación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">Factura #INV-2024-001</p>
                    <p className="text-sm text-muted-foreground">15 Marzo, 2024</p>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <span className="font-medium">99,99€</span>
                    <Button variant="outline" size="sm">Descargar</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Botón de cerrar sesión */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/agenda')}
              >
                Ir a mi agenda
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default Profile;
