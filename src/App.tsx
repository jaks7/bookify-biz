
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Affiliates from "./pages/Affiliates";
import NotFound from "./pages/NotFound";
import Login from './pages/Login';
import Register from './pages/Register';
import Agenda from './pages/Agenda';
import CalendarView from './pages/CalendarView';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="/precios" element={<Pricing />} />
          <Route path="/afiliados" element={<Affiliates />} />
          {/* Redirect outdated component routes to the new pages */}
          <Route path="/components/Login" element={<Navigate to="/login" replace />} />
          <Route path="/components/Register" element={<Navigate to="/register" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
