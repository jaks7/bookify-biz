import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, AlertCircle, ArrowRight, Loader2, Globe, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  email: string;
  password1: string;
  password2: string;
  name?: string;
  phone?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password1: '',
    password2: '',
    name: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validar que las contraseñas coincidan
    if (formData.password1 !== formData.password2) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/dj-rest-auth/registration/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password1: formData.password1,
          password2: formData.password2,
          name: formData.name,
          phone: formData.phone
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || Object.values(data)[0]?.[0] || 'Error en el registro');
      }

      // Mostrar mensaje de éxito y redireccionar
      setEmailSent(true);
      toast({
        title: "Registro exitoso",
        description: "Se ha enviado un correo de confirmación a tu email"
      });
      
    } catch (err: any) {
      setError(err.message || 'Error en el registro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setIsLoading(true);
    window.location.href = 'http://127.0.0.1:8000/accounts/google/login/';
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4 py-12">
        <Card className="max-w-md w-full shadow-lg border-gray-100">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-center">Registro completado</CardTitle>
            <CardDescription className="text-center">
              Hemos enviado un correo de confirmación a tu dirección de email.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Por favor, revisa tu bandeja de entrada y sigue las instrucciones para completar tu registro.
            </p>
            <p className="text-gray-600">
              Es posible que el correo tarde unos minutos en llegar. Revisa también tu carpeta de spam.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="w-full h-11 rounded-lg text-white bg-bookify-500 hover:bg-bookify-600"
            >
              Volver al inicio
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-bookify-700">HoraLibre</h1>
          <p className="mt-2 text-gray-600">Crea una cuenta para gestionar tus reservas</p>
        </div>
        
        <Card className="shadow-lg border-gray-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Crear cuenta</CardTitle>
            <CardDescription className="text-center">
              Completa tus datos para registrarte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full h-11 font-medium rounded-lg border-gray-200"
                onClick={handleGoogleRegister}
                disabled={isLoading}
              >
                <Globe className="mr-2 h-5 w-5" />
                Registrarse con Google
              </Button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O regístrate con</span>
                </div>
              </div>
              
              {error && (
                <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Correo electrónico *"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-11 pl-10 rounded-lg"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      name="name"
                      type="text"
                      placeholder="Nombre (opcional)"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-11 pl-10 rounded-lg"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Teléfono (opcional)"
                      value={formData.phone}
                      onChange={handleChange}
                      className="h-11 pl-10 rounded-lg"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      name="password1"
                      type="password"
                      placeholder="Contraseña *"
                      value={formData.password1}
                      onChange={handleChange}
                      required
                      className="h-11 pl-10 rounded-lg"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      name="password2"
                      type="password"
                      placeholder="Confirmar contraseña *"
                      value={formData.password2}
                      onChange={handleChange}
                      required
                      className="h-11 pl-10 rounded-lg"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 rounded border-gray-300 text-bookify-500 focus:ring-bookify-500"
                    disabled={isLoading}
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                    Acepto los <a href="#" className="text-bookify-600 hover:text-bookify-700 font-medium">términos y condiciones</a>
                  </label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full h-11 rounded-lg text-white bg-bookify-500 hover:bg-bookify-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Crear cuenta
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-bookify-600 hover:text-bookify-700">
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
