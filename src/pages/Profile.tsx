
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Building, Phone, MapPin, Mail, LogOut, ArrowLeftRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Initialize with storeToRefs for reactive state from Pinia
  const authStore = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    async function loadUserData() {
      if (!authStore.isAuthenticated) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      try {
        await authStore.fetchUserData();
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
  }, [authStore, navigate, toast]);

  const handleLogout = () => {
    authStore.logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate('/login');
  };

  const handleSwitchBusiness = (businessId: string) => {
    authStore.switchBusiness(businessId);
    toast({
      title: "Negocio cambiado",
      description: "Has cambiado de negocio correctamente",
    });
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
      
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
                  <p className="font-medium">{authStore.profile?.name} {authStore.profile?.surnames}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{authStore.user?.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{authStore.profile?.phone || 'No especificado'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p>{authStore.profile?.address || 'No especificada'}</p>
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
                  <p className="font-medium">{authStore.currentBusiness?.name || 'Sin negocio'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de negocio</p>
                  <p>{authStore.currentBusiness?.type_of_business || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <p>
                    {authStore.currentBusiness?.configuration_is_completed
                      ? 'Configuración completada'
                      : 'Pendiente de configurar'}
                  </p>
                </div>
              </>
            )}
          </CardContent>
          {!authStore.currentBusiness?.configuration_is_completed && (
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
        {authStore.availableBusinesses.length > 1 && (
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
                  authStore.availableBusinesses.map((business) => (
                    <div 
                      key={business.business_id}
                      className={`p-4 rounded-lg border flex justify-between items-center ${
                        business.business_id === authStore.currentBusiness?.business_id
                          ? 'bg-primary/5 border-primary/20'
                          : 'hover:bg-accent cursor-pointer'
                      }`}
                      onClick={() => {
                        if (business.business_id !== authStore.currentBusiness?.business_id) {
                          handleSwitchBusiness(business.business_id);
                        }
                      }}
                    >
                      <div>
                        <p className="font-medium">{business.name}</p>
                        <p className="text-sm text-muted-foreground">{business.type_of_business}</p>
                      </div>
                      {business.business_id === authStore.currentBusiness?.business_id ? (
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

        {/* Acciones de cuenta */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
          </CardHeader>
          <CardContent>
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
      </div>
    </div>
  );
};

export default Profile;
