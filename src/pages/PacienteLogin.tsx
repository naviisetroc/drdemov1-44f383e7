import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Stethoscope, LogIn, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getRegisteredPatient } from "@/stores/patientChatStore";
import { toast } from "sonner";

export default function PacienteLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    setTimeout(() => {
      const patient = getRegisteredPatient(email, password);
      if (patient) {
        localStorage.setItem("medisec_patient_session", JSON.stringify({ id: patient.id, name: patient.name, email: patient.email }));
        toast.success(`¡Bienvenido/a, ${patient.name}!`);
        navigate("/paciente/dashboard");
      } else {
        toast.error("Credenciales incorrectas", { description: "Verifica tu correo y contraseña." });
      }
      setLoading(false);
    }, 600);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gradient-bg p-4">
      <Card className="w-full max-w-md glass-strong border-border/30 shadow-elevated">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <Stethoscope className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl font-display">Portal del Paciente</CardTitle>
          <CardDescription>Inicia sesión para acceder a tu historial y citas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Correo electrónico</label>
              <Input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/30 border-border/40"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Contraseña</label>
              <Input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted/30 border-border/40"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90" disabled={loading}>
              <LogIn className="h-4 w-4 mr-2" />
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">¿No tienes cuenta?</span>
            </div>
          </div>

          <Link to="/paciente" className="block">
            <Button variant="outline" className="w-full border-border/40 hover:bg-primary/10">
              <MessageCircle className="h-4 w-4 mr-2" />
              Registrarme vía chatbot
            </Button>
          </Link>

          <Link to="/dashboard" className="block text-center">
            <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              👨‍⚕️ Acceder como médico (demo)
            </span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
