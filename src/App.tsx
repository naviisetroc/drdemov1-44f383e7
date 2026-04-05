import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Pacientes from "@/pages/Pacientes";
import PacienteDetalle from "@/pages/PacienteDetalle";
import NotasMedicas from "@/pages/NotasMedicas";
import Agenda from "@/pages/Agenda";
import Chat from "@/pages/Chat";
import Referencias from "@/pages/Referencias";
import Configuracion from "@/pages/Configuracion";
import PacienteChat from "@/pages/PacienteChat";
import PacienteLogin from "@/pages/PacienteLogin";
import PacienteDashboard from "@/pages/PacienteDashboard";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/pacientes" element={<ProtectedLayout><Pacientes /></ProtectedLayout>} />
          <Route path="/pacientes/:id" element={<ProtectedLayout><PacienteDetalle /></ProtectedLayout>} />
          <Route path="/notas" element={<ProtectedLayout><NotasMedicas /></ProtectedLayout>} />
          <Route path="/agenda" element={<ProtectedLayout><Agenda /></ProtectedLayout>} />
          <Route path="/chat" element={<ProtectedLayout><Chat /></ProtectedLayout>} />
          <Route path="/referencias" element={<ProtectedLayout><Referencias /></ProtectedLayout>} />
          <Route path="/configuracion" element={<ProtectedLayout><Configuracion /></ProtectedLayout>} />
          <Route path="/paciente" element={<PacienteChat />} />
          <Route path="/paciente/login" element={<PacienteLogin />} />
          <Route path="/paciente/dashboard" element={<PacienteDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
