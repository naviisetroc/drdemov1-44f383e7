import { Calendar, Plus, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { appointments } from "@/data/mockData";

const statusColors: Record<string, string> = {
  programada: "default",
  completada: "secondary",
  cancelada: "destructive",
} as const;

export default function Agenda() {
  const sorted = [...appointments].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  const upcoming = sorted.filter(a => a.status === "programada");
  const past = sorted.filter(a => a.status !== "programada");

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Agenda</h1>
          <p className="text-sm text-muted-foreground">{upcoming.length} citas próximas</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva cita
        </Button>
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
          {upcoming.map((apt) => (
            <div key={apt.id} className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-center min-w-[48px]">
                  <p className="font-display text-lg font-bold text-primary">
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
                    {new Date(apt.datetime).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
              <Badge variant={statusColors[apt.status] as any} className="text-[10px]">{apt.status}</Badge>
            </div>
          ))}
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
          {past.map((apt) => (
            <div key={apt.id} className="flex items-center justify-between rounded-lg border border-border p-3 opacity-70">
              <div>
                <p className="text-sm font-medium">{apt.patientName}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(apt.datetime).toLocaleDateString("es-MX", { day: "numeric", month: "short" })} — {apt.reason}
                </p>
              </div>
              <Badge variant={statusColors[apt.status] as any} className="text-[10px]">{apt.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
