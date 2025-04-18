
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./stores/authContext";
import { ProfessionalProvider } from './stores/professionalContext';
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Affiliates from "./pages/Affiliates";
import NotFound from "./pages/NotFound";
import Login from './pages/Login';
import Register from './pages/Register';
import Agenda from './pages/Agenda';
import CalendarView from './pages/CalendarView';
import BusinessIntelligence from './pages/BusinessIntelligence';
import WhatsApp from './pages/WhatsApp';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Businesses from './pages/Businesses';
import Settings from './pages/Settings';
import Professionals from './pages/Professionals';
import Services from './pages/Services';
import Clients from './pages/Clients';
import BusinessConfig from './pages/BusinessConfig';
import ClientReservation from './pages/ClientReservation';
import Turnos from './pages/Turnos';
import BusinessDetailsPage from './pages/BusinessDetailsPage';
import ClientPortalBusiness from './pages/client_portal/business';

// Demo pages
import DemoAgenda from './pages/demo/Agenda';
import DemoCalendarView from './pages/demo/CalendarView';
import DemoDashboard from './pages/demo/Dashboard';
import DemoBusinesses from './pages/demo/Businesses';
import DemoSettings from './pages/demo/Settings';
import DemoProfessionals from './pages/demo/Professionals';
import DemoServices from './pages/demo/Services';
import DemoClients from './pages/demo/Clients';
import DemoProfile from './pages/demo/Profile';
import DemoBusinessConfig from './pages/demo/BusinessConfig';
import DemoTurnos from './pages/demo/Turnos';
import DemoBusinessDetails from './pages/demo/BusinessDetails';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProfessionalProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/business/:businessId" element={<BusinessDetailsPage />} />
              <Route path="/reservation" element={<ClientReservation />} />
              <Route path="/turnos" element={<Turnos />} />
              <Route path="/inteligenciaNegocio" element={<BusinessIntelligence />} />
              <Route path="/whatsapp" element={<WhatsApp />} />
              <Route path="/precios" element={<Pricing />} />
              <Route path="/afiliados" element={<Affiliates />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/mi_perfil" element={<Profile />} />
              
              {/* Client portal routes */}
              <Route path="/client_portal/business/:businessId" element={<ClientPortalBusiness />} />
              <Route path="/client_portal/business" element={<ClientPortalBusiness />} />
              
              {/* Management routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/businesses" element={<Businesses />} />
              <Route path="/configuracion" element={<BusinessConfig />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/professionals" element={<Professionals />} />
              <Route path="/services" element={<Services />} />
              <Route path="/clients" element={<Clients />} />
              
              {/* Demo routes */}
              <Route path="/demo/agenda" element={<DemoAgenda />} />
              <Route path="/demo/calendar" element={<DemoCalendarView />} />
              <Route path="/demo/turnos" element={<DemoTurnos />} />
              <Route path="/demo/dashboard" element={<DemoDashboard />} />
              <Route path="/demo/businesses" element={<DemoBusinesses />} />
              <Route path="/demo/configuracion" element={<DemoBusinessConfig />} />
              <Route path="/demo/settings" element={<DemoSettings />} />
              <Route path="/demo/professionals" element={<DemoProfessionals />} />
              <Route path="/demo/services" element={<DemoServices />} />
              <Route path="/demo/clients" element={<DemoClients />} />
              <Route path="/demo/mi_perfil" element={<DemoProfile />} />
              <Route path="/demo/business" element={<DemoBusinessDetails />} />
              
              {/* Redirect outdated component routes to the new pages */}
              <Route path="/components/Login" element={<Navigate to="/login" replace />} />
              <Route path="/components/Register" element={<Navigate to="/register" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </ProfessionalProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
