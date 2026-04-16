import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, LogIn, Shield, Zap, Brain, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const features = [
  { icon: Brain, text: "Notas médicas con IA" },
  { icon: MessageCircle, text: "Chat inteligente WhatsApp" },
  { icon: Zap, text: "Agenda automatizada" },
  { icon: Shield, text: "Referencias en 1 click" },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("dr.ramirez@medisec.mx");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("medisec_logged_in", "true");
      navigate("/dashboard");
    }, 800);
  };

  const handlePatientDemo = () => {
    setLoadingPatient(true);
    setTimeout(() => {
      localStorage.setItem("medisec_patient_session", JSON.stringify({
        id: "chat-seed-demo",
        name: "Laura Méndez García",
        email: "paciente@demo.com",
      }));
      navigate("/paciente/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-bg" />
      
      {/* Decorative orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-[120px] animate-float" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[160px]" />

      <div className="w-full max-w-sm space-y-6 relative z-10">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto shadow-lg glow-primary animate-glow-pulse">
            <Stethoscope className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">
            Dr. House
          </h1>
          <p className="text-sm text-muted-foreground">Tu secretario médico inteligente con IA</p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {features.map((f) => (
            <div key={f.text} className="flex items-center gap-1.5 rounded-full glass px-3 py-1.5 hover:border-primary/30 transition-colors">
              <f.icon className="h-3 w-3 text-primary" />
              <span className="text-[11px] font-medium text-foreground">{f.text}</span>
            </div>
          ))}
        </div>

        {/* Login card - glassmorphism */}
        <div className="glass-strong rounded-3xl p-6 shadow-elevated">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground/80">Correo electrónico</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl h-11"
                placeholder="doctor@ejemplo.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground/80">Contraseña</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl h-11"
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              className="w-full gap-2 h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all text-primary-foreground font-semibold text-sm shadow-lg glow-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Iniciando sesión...</span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Entrar al demo — Médico
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card/80 px-3 text-muted-foreground">o explora como</span>
            </div>
          </div>

          {/* Patient demo button */}
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 h-12 rounded-xl border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all font-semibold text-sm"
            onClick={handlePatientDemo}
            disabled={loadingPatient}
          >
            {loadingPatient ? (
              <span className="animate-pulse">Entrando al portal...</span>
            ) : (
              <>
                <User className="h-4 w-4" /> Entrar al demo — Paciente
              </>
            )}
          </Button>

          <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-[11px] text-muted-foreground text-center">
              👆 <strong className="text-foreground/80">Demo lista</strong> — Elige un perfil para explorar la plataforma
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}