import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mx-auto">
            <Stethoscope className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">MediSec</h1>
          <p className="text-sm text-muted-foreground">Secretario Inteligente con IA</p>
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
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <span className="animate-pulse">Iniciando sesión...</span>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" /> Iniciar sesión
                  </>
                )}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Demo — presiona "Iniciar sesión" para continuar
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
