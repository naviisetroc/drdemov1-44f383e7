import { Calendar, Users, FileText, ArrowRightLeft, Clock, Bell, CheckCircle2, AlertCircle, TrendingUp, Sparkles, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { appointments, patients, clinicalNotes, referrals } from "@/data/mockData";
import { chatPatientToPatient } from "@/stores/patientChatStore";
import { useStoreSync } from "@/hooks/useStoreSync";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import DoctorAssistantChat from "@/components/DoctorAssistantChat";

const getStats = (activeCount: number, apptCount: number, chatCount: number) => [
{
  label: "Pacientes activos",
  value: activeCount,
  icon: Users,
  gradient: "from-primary/20 to-primary/5",
  iconColor: "text-primary",
  tooltip: `${activeCount - chatCount} registrados + ${chatCount} nuevos vía chat`
},
{
  label: "Citas hoy",
  value: apptCount,
  icon: Calendar,
  gradient: "from-success/20 to-success/5",
  iconColor: "text-success",
  tooltip: "Citas confirmadas y programadas"
},
{
  label: "Notas esta semana",
  value: clinicalNotes.length,
  icon: FileText,
  gradient: "from-warning/20 to-warning/5",
  iconColor: "text-warning",
  tooltip: "Notas clínicas generadas en los últimos 7 días"
},
{
  label: "Referencias activas",
  value: referrals.length,
  icon: ArrowRightLeft,
  gradient: "from-accent/20 to-accent/5",
  iconColor: "text-accent",
  tooltip: "Referencias enviadas pendientes de respuesta del especialista"
}];


const statusConfig: Record<string, {label: string;variant: "default" | "secondary" | "destructive" | "outline";icon: typeof CheckCircle2;}> = {
  confirmada: { label: "Confirmada", variant: "default", icon: CheckCircle2 },
  programada: { label: "Pendiente", variant: "outline", icon: AlertCircle },
  completada: { label: "Completada", variant: "secondary", icon: CheckCircle2 },
  cancelada: { label: "Cancelada", variant: "destructive", icon: AlertCircle }
};

export default function Dashboard() {
  const [showNotif, setShowNotif] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { chatPatients, chatAppointments } = useStoreSync();

  const allAppointments = [...appointments, ...chatAppointments];
  const upcoming = allAppointments.filter((a) => a.status === "programada" || a.status === "confirmada").slice(0, 5);
  const allPatientCount = patients.filter((p) => p.status === "activo").length + chatPatients.length;
  const recentPatients = patients.filter((p) => p.status === "activo" && p.id !== "10").slice(0, 5);
  const chatAptIds = new Set(chatAppointments.map((a) => a.id));

  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success("Cita confirmada vía WhatsApp", {
        description: "Laura Pérez Vega confirmó su cita para mañana a las 9:00 AM",
        duration: 5000
      });
      setShowNotif(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Buenos días, Dr. Ramírez
          </h1>
          <p className="text-sm mt-1 text-secondary-foreground">Resumen de tu consultorio — Lunes 24 de marzo, 2026</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="relative p-2.5 rounded-xl glass hover:border-primary/30 transition-all">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {(showNotif || chatPatients.length > 0) && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {chatPatients.length > 0 ?
            `${chatPatients.length} pacientes nuevos vía chat` :
            "Notificaciones"}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {getStats(allPatientCount, allAppointments.filter((a) => a.status === "confirmada" || a.status === "programada").length, chatPatients.length).map((s) =>
        <Tooltip key={s.label}>
            <TooltipTrigger asChild>
              <Card className="glass border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-glow cursor-default overflow-hidden">
                <CardContent className="p-4 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-50`} />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center`}>
                        <s.icon className={`h-5 w-5 ${s.iconColor}`} />
                      </div>
                      <span className="font-display text-3xl font-bold">{s.value}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[200px]">{s.tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming appointments */}
        <Card className="glass border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Clock className="h-3.5 w-3.5 text-primary" />
              </div>
              Próximas citas
              <Badge variant="secondary" className="text-[10px] ml-auto bg-primary/10 text-primary border-primary/20">{upcoming.length} pendientes</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.map((apt) => {
              const config = statusConfig[apt.status] || statusConfig.programada;
              const fromChat = chatAptIds.has(apt.id);
              return (
                <div key={apt.id} className={`flex items-center justify-between rounded-xl border p-3 hover:bg-muted/30 transition-all ${fromChat ? "border-success/30 bg-success/5" : "border-border/40 bg-muted/20"}`}>
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[44px] rounded-lg bg-primary/10 py-1.5 px-2">
                      <p className="font-display text-base font-bold text-primary leading-none">
                        {new Date(apt.datetime).getDate()}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase mt-0.5">
                        {new Date(apt.datetime).toLocaleDateString("es-MX", { month: "short" })}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium">{apt.patientName}</p>
                        {fromChat &&
                        <Badge variant="outline" className="text-[9px] border-success/30 text-success gap-0.5 py-0 px-1">
                            <MessageCircle className="h-2 w-2" /> Chat
                          </Badge>
                        }
                      </div>
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
                </div>);

            })}
            <Link to="/agenda" className="block text-center text-sm text-primary font-medium hover:text-primary/80 pt-2 transition-colors">
              Ver toda la agenda →
            </Link>
          </CardContent>
        </Card>

        {/* Recent patients */}
        <Card className="glass border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Users className="h-3.5 w-3.5 text-primary" />
              </div>
              Pacientes recientes
              <Badge variant="secondary" className="text-[10px] ml-auto bg-primary/10 text-primary border-primary/20">{recentPatients.length} activos</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentPatients.map((p) =>
            <Link
              key={p.id}
              to={`/pacientes/${p.id}`}
              className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 p-3 hover:bg-muted/40 hover:border-primary/20 transition-all">
              
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-xs font-semibold text-primary">
                    {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.conditions.join(", ") || "Sin condiciones"}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant="secondary" className="text-[10px] bg-muted/50">
                    {p.age} años
                  </Badge>
                  {p.nextAppointment &&
                <p className="text-[10px] text-muted-foreground mt-1">
                      Próxima: {new Date(p.nextAppointment).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                    </p>
                }
                </div>
              </Link>
            )}
            <Link to="/pacientes" className="block text-center text-sm text-primary font-medium hover:text-primary/80 pt-2 transition-colors">
              Ver todos los pacientes →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Chat patients */}
      {chatPatients.length > 0 &&
      <Card className="glass border-success/20 bg-success/5">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-success/15 flex items-center justify-center">
                <MessageCircle className="h-3.5 w-3.5 text-success" />
              </div>
              Pacientes registrados vía chat
              <Badge variant="outline" className="text-[10px] ml-auto border-success/30 text-success animate-pulse">{chatPatients.length} nuevos</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {chatPatients.map((p) =>
          <div key={p.id} className="flex items-center justify-between rounded-xl border border-border/40 p-3 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-xs font-semibold text-success">
                    {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.reason}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Registrado: {new Date(p.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="text-[10px] text-success border-success/30">Nuevo</Badge>
                  <span className="text-[10px] text-muted-foreground">{p.age} años · {p.sex === "F" ? "F" : "M"}</span>
                </div>
              </div>
          )}
          </CardContent>
        </Card>
      }

      {/* Quick actions banner */}
      <Card className="glass border-primary/20 overflow-hidden">
        <CardContent className="p-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent" />
          <div className="relative flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Acciones rápidas</p>
              <p className="text-xs text-muted-foreground">Accede directamente a las funciones más usadas</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <Link to="/notas">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all py-1.5 px-3 rounded-xl">
                  📝 Nueva nota
                </Badge>
              </Link>
              <Link to="/chat">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all py-1.5 px-3 rounded-xl">
                  💬 Chat IA
                </Badge>
              </Link>
              <Link to="/referencias">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all py-1.5 px-3 rounded-xl">
                  📋 Referencia
                </Badge>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating assistant button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-elevated hover:shadow-glow transition-all flex items-center justify-center hover:scale-105 animate-glow-pulse">
        
        <Sparkles className="h-6 w-6" />
      </button>

      <DoctorAssistantChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>);

}