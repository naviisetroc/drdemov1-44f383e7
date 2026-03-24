import { Calendar, Users, FileText, ArrowRightLeft, Clock, Bell, CheckCircle2, AlertCircle, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { appointments, patients, clinicalNotes, referrals } from "@/data/mockData";
import { getChatPatients, getChatAppointments } from "@/stores/patientChatStore";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import DoctorAssistantChat from "@/components/DoctorAssistantChat";

const getStats = (activeCount: number, apptCount: number) => [
  {
    label: "Pacientes activos",
    value: activeCount,
    icon: Users,
    color: "text-primary",
    tooltip: "Total de pacientes con estado activo en tu consultorio",
  },
  {
    label: "Citas hoy",
    value: apptCount,
    icon: Calendar,
    color: "text-success",
    tooltip: "Citas confirmadas para el día de hoy",
  },
  {
    label: "Notas esta semana",
    value: clinicalNotes.length,
    icon: FileText,
    color: "text-warning",
    tooltip: "Notas clínicas generadas en los últimos 7 días",
  },
  {
    label: "Referencias activas",
    value: referrals.length,
    icon: ArrowRightLeft,
    color: "text-destructive",
    tooltip: "Referencias enviadas pendientes de respuesta del especialista",
  },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle2 }> = {
  confirmada: { label: "Confirmada", variant: "default", icon: CheckCircle2 },
  programada: { label: "Pendiente", variant: "outline", icon: AlertCircle },
  completada: { label: "Completada", variant: "secondary", icon: CheckCircle2 },
  cancelada: { label: "Cancelada", variant: "destructive", icon: AlertCircle },
};

export default function Dashboard() {
  const [showNotif, setShowNotif] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const chatPatients = getChatPatients();
  const chatAppts = getChatAppointments();
  const allAppointments = [...appointments, ...chatAppts];
  const upcoming = allAppointments.filter(a => a.status === "programada" || a.status === "confirmada").slice(0, 5);
  const allPatientCount = patients.filter(p => p.status === "activo").length + chatPatients.length;
  const recentPatients = patients.filter(p => p.status === "activo" && p.id !== "10").slice(0, 5);

  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success("Cita confirmada", {
        description: "Laura Pérez Vega confirmó su cita para mañana a las 9:00 AM",
        duration: 5000,
      });
      setShowNotif(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Buenos días, Dr. Ramírez</h1>
          <p className="text-muted-foreground text-sm mt-1">Resumen de tu consultorio — Lunes 23 de marzo, 2026</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {showNotif && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>Notificaciones</TooltipContent>
        </Tooltip>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Tooltip key={s.label}>
            <TooltipTrigger asChild>
              <Card className="shadow-card hover:shadow-md transition-shadow cursor-default">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                    <span className="font-display text-2xl font-bold">{s.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{s.label}</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[200px]">{s.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming appointments */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Próximas citas
              <Badge variant="secondary" className="text-[10px] ml-auto">{upcoming.length} pendientes</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.map((apt) => {
              const config = statusConfig[apt.status] || statusConfig.programada;
              return (
                <div key={apt.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[40px]">
                      <p className="font-display text-base font-bold text-primary leading-none">
                        {new Date(apt.datetime).getDate()}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        {new Date(apt.datetime).toLocaleDateString("es-MX", { month: "short" })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{apt.patientName}</p>
                      <p className="text-xs text-muted-foreground">{apt.reason}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="text-sm font-medium">
                      {new Date(apt.datetime).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <Badge variant={config.variant} className="text-[10px] gap-1">
                      <config.icon className="h-2.5 w-2.5" />
                      {config.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
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
              <Badge variant="secondary" className="text-[10px] ml-auto">{recentPatients.length} activos</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentPatients.map((p) => (
              <Link
                key={p.id}
                to={`/pacientes/${p.id}`}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {p.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.conditions.join(", ") || "Sin condiciones"}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant="secondary" className="text-[10px]">
                    {p.age} años
                  </Badge>
                  {p.nextAppointment && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Próxima: {new Date(p.nextAppointment).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
            <Link to="/pacientes" className="block text-center text-sm text-primary font-medium hover:underline pt-1">
              Ver todos los pacientes →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions banner */}
      <Card className="shadow-card border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Acciones rápidas</p>
              <p className="text-xs text-muted-foreground">Accede directamente a las funciones más usadas</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <Link to="/notas">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-1.5 px-3">
                  📝 Nueva nota
                </Badge>
              </Link>
              <Link to="/chat">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-1.5 px-3">
                  💬 Chat IA
                </Badge>
              </Link>
              <Link to="/referencias">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-1.5 px-3">
                  📋 Referencia
                </Badge>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
