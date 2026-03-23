import { Calendar, Plus, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { appointments } from "@/data/mockData";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle2; color: string }> = {
  confirmada: { label: "Confirmada", variant: "default", icon: CheckCircle2, color: "text-primary" },
  programada: { label: "Pendiente", variant: "outline", icon: AlertCircle, color: "text-warning" },
  completada: { label: "Completada", variant: "secondary", icon: CheckCircle2, color: "text-muted-foreground" },
  cancelada: { label: "Cancelada", variant: "destructive", icon: XCircle, color: "text-destructive" },
};

export default function Agenda() {
  const sorted = [...appointments].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  const upcoming = sorted.filter(a => a.status === "programada" || a.status === "confirmada");
  const past = sorted.filter(a => a.status === "completada" || a.status === "cancelada");

  const handleConfirm = (name: string) => {
    toast.success("Recordatorio enviado", {
      description: `Se envió recordatorio de cita a ${name} por WhatsApp`,
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Agenda</h1>
          <p className="text-sm text-muted-foreground">
            {upcoming.length} citas próximas · Semana del 23 al 29 de marzo
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva cita
            </Button>
          </TooltipTrigger>
          <TooltipContent>Agendar nueva cita manualmente</TooltipContent>
        </Tooltip>
      </div>

      {/* Summary badges */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant="default" className="gap-1 py-1 px-3">
          <CheckCircle2 className="h-3 w-3" /> {upcoming.filter(a => a.status === "confirmada").length} confirmadas
        </Badge>
        <Badge variant="outline" className="gap-1 py-1 px-3">
          <AlertCircle className="h-3 w-3" /> {upcoming.filter(a => a.status === "programada").length} pendientes
        </Badge>
        <Badge variant="secondary" className="gap-1 py-1 px-3">
          <CheckCircle2 className="h-3 w-3" /> {past.filter(a => a.status === "completada").length} completadas
        </Badge>
      </div>

      {/* Upcoming */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Próximas citas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcoming.map((apt) => {
            const config = statusConfig[apt.status] || statusConfig.programada;
            return (
              <div key={apt.id} className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[48px]">
                    <p className={`font-display text-lg font-bold ${config.color} leading-none`}>
                      {new Date(apt.datetime).getDate()}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase">
                      {new Date(apt.datetime).toLocaleDateString("es-MX", { month: "short" })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{apt.patientName}</p>
                    <p className="text-xs text-muted-foreground">{apt.reason}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      🕐 {new Date(apt.datetime).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                      {apt.notes && <span className="ml-2">· 📝 {apt.notes}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {apt.status === "programada" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleConfirm(apt.patientName)}>
                          📲 Recordar
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Enviar recordatorio por WhatsApp</TooltipContent>
                    </Tooltip>
                  )}
                  <Badge variant={config.variant} className="text-[10px] gap-1 shrink-0">
                    <config.icon className="h-2.5 w-2.5" />
                    {config.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Past */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Citas anteriores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {past.map((apt) => {
            const config = statusConfig[apt.status] || statusConfig.completada;
            return (
              <div key={apt.id} className="flex items-center justify-between rounded-lg border border-border p-3 opacity-70">
                <div>
                  <p className="text-sm font-medium">{apt.patientName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(apt.datetime).toLocaleDateString("es-MX", { day: "numeric", month: "short" })} — {apt.reason}
                  </p>
                </div>
                <Badge variant={config.variant} className="text-[10px] gap-1">
                  <config.icon className="h-2.5 w-2.5" />
                  {config.label}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
