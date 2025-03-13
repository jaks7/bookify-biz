
import React, { useState } from 'react';
import { ArrowRight, Mail, Lock, Smartphone, Google } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const AuthForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Información",
        description: "Esta es una demo. La autenticación no está implementada todavía.",
      });
    }, 1500);
  };
  
  const handleGoogleAuth = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Información",
        description: "Esta es una demo. La autenticación con Google no está implementada todavía.",
      });
    }, 1500);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="w-full mb-8 rounded-full bg-white border border-gray-100 shadow-sm p-1">
          <TabsTrigger value="login" className="flex-1 rounded-full text-sm transition-all">
            Iniciar sesión
          </TabsTrigger>
          <TabsTrigger value="register" className="flex-1 rounded-full text-sm transition-all">
            Crear cuenta
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="animate-fade-in">
          <div className="mb-8">
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-full border border-gray-200 hover:bg-gray-50 font-medium mb-4"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <Google className="mr-2 h-5 w-5" />
              Continuar con Google
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input 
                    type="tel"
                    placeholder="Número de teléfono" 
                    className="h-12 pl-10 rounded-xl"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input 
                    type="password" 
                    placeholder="Contraseña" 
                    className="h-12 pl-10 rounded-xl"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-bookify-500 focus:ring-bookify-500"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-600">
                    Recordarme
                  </label>
                </div>
                
                <a href="#" className="text-sm font-medium text-bookify-600 hover:text-bookify-700">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 rounded-full text-white bg-bookify-500 hover:bg-bookify-600 btn-hover-effect"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </div>
                ) : (
                  <>
                    Iniciar sesión
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="register" className="animate-fade-in">
          <div className="mb-8">
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-full border border-gray-200 hover:bg-gray-50 font-medium mb-4"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <Google className="mr-2 h-5 w-5" />
              Registrarse con Google
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input 
                    type="email" 
                    placeholder="Email" 
                    className="h-12 pl-10 rounded-xl"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input 
                    type="tel"
                    placeholder="Número de teléfono" 
                    className="h-12 pl-10 rounded-xl"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input 
                    type="password" 
                    placeholder="Contraseña" 
                    className="h-12 pl-10 rounded-xl"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-bookify-500 focus:ring-bookify-500"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                  Acepto los <a href="#" className="text-bookify-600 hover:text-bookify-700 font-medium">términos y condiciones</a>
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 rounded-full text-white bg-bookify-500 hover:bg-bookify-600 btn-hover-effect"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando cuenta...
                  </div>
                ) : (
                  <>
                    Crear cuenta
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
