import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<AppLayout><Routes><Route path="/dashboard" element={<Dashboard />} /><Route path="/pacientes" element={<Pacientes />} /><Route path="/pacientes/:id" element={<PacienteDetalle />} /><Route path="/notas" element={<NotasMedicas />} /><Route path="/agenda" element={<Agenda />} /><Route path="/chat" element={<Chat />} /><Route path="/referencias" element={<Referencias />} /><Route path="/configuracion" element={<Configuracion />} /><Route path="*" element={<NotFound />} /></Routes></AppLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
