import { Calendar, Users, FileText, ArrowRightLeft, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { appointments, patients, clinicalNotes, referrals } from "@/data/mockData";
import { Link } from "react-router-dom";

const stats = [
  { label: "Pacientes activos", value: patients.filter(p => p.status === "activo").length, icon: Users, color: "text-primary" },
  { label: "Citas hoy", value: 2, icon: Calendar, color: "text-success" },
  { label: "Notas esta semana", value: clinicalNotes.length, icon: FileText, color: "text-warning" },
  { label: "Referencias pendientes", value: referrals.length, icon: ArrowRightLeft, color: "text-destructive" },
];

export default function Dashboard() {
  const upcoming = appointments.filter(a => a.status === "programada").slice(0, 3);
  const recentPatients = patients.filter(p => p.status === "activo").slice(0, 4);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-2xl font-bold">Buenos días, Dr. Ramírez</h1>
        <p className="text-muted-foreground text-sm mt-1">Aquí tienes un resumen de tu día.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className="font-display text-2xl font-bold">{s.value}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming appointments */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Próximas citas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{apt.patientName}</p>
                  <p className="text-xs text-muted-foreground">{apt.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Date(apt.datetime).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(apt.datetime).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            <Link to="/agenda" className="block text-center text-sm text-primary font-medium hover:underline pt-1">
              Ver toda la agenda →
            </Link>
          </CardContent>
        </Card>

        {/* Recent patients */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Pacientes recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPatients.map((p) => (
              <Link
                key={p.id}
                to={`/pacientes/${p.id}`}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {p.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.conditions.join(", ") || "Sin condiciones"}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {p.age} años
                </Badge>
              </Link>
            ))}
            <Link to="/pacientes" className="block text-center text-sm text-primary font-medium hover:underline pt-1">
              Ver todos los pacientes →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
