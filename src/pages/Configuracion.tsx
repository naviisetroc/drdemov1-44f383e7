import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Configuracion() {
  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-display text-2xl font-bold">Configuración</h1>
        <p className="text-sm text-muted-foreground">Administra tu perfil y preferencias</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-base">Perfil del médico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nombre completo</label>
              <Input defaultValue="Dr. Alejandro Ramírez" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Especialidad</label>
              <Input defaultValue="Medicina General" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue="dr.ramirez@medisec.com" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Teléfono</label>
              <Input defaultValue="+52 55 1234 5678" className="mt-1" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Nombre de clínica</label>
            <Input defaultValue="Consultorio Médico Ramírez" className="mt-1" />
          </div>
          <Separator />
          <Button>Guardar cambios</Button>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-base">Integraciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">WhatsApp Business</p>
              <p className="text-xs text-muted-foreground">Conecta tu número para recibir pacientes</p>
            </div>
            <Button variant="outline" size="sm">Conectar</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">IA Asistente</p>
              <p className="text-xs text-muted-foreground">Generación de notas y chat con pacientes</p>
            </div>
            <Button variant="outline" size="sm">Configurar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
