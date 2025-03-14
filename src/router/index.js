import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '@/components/Login';
import Landing from '@/components/Landing';
import Register from '@/components/Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
]);

// Función para verificar autenticación
export const requireAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return null;
};

// Función para redireccionar si ya está autenticado
export const redirectIfAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/main" replace />;
  }
  return null;
};

export default router; 