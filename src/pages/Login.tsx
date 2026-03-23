import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, LogIn, Shield, Zap, Brain, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("medisec_logged_in", "true");
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mx-auto">
            <Stethoscope className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">MediSec</h1>
          <p className="text-sm text-muted-foreground">Tu secretario médico inteligente con IA</p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {features.map((f) => (
            <div key={f.text} className="flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/10 px-3 py-1.5">
              <f.icon className="h-3 w-3 text-primary" />
              <span className="text-[11px] font-medium text-foreground">{f.text}</span>
            </div>
          ))}
        </div>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Correo electrónico</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="doctor@ejemplo.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Contraseña</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full gap-2 h-11" disabled={loading}>
                {loading ? (
                  <span className="animate-pulse">Iniciando sesión...</span>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" /> Entrar al demo
                  </>
                )}
              </Button>
            </form>
            <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-[11px] text-muted-foreground text-center">
                👆 <strong>Demo lista</strong> — Solo presiona "Entrar al demo" para explorar la plataforma
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
