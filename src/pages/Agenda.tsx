import { useState } from "react";
import { Calendar, Plus, Clock, CheckCircle2, AlertCircle, XCircle, MessageCircle, CalendarClock, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { appointments, patients, Appointment } from "@/data/mockData";
import { useStoreSync } from "@/hooks/useStoreSync";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle2; color: string }> = {
  confirmada: { label: "Confirmada", variant: "default", icon: CheckCircle2, color: "text-primary" },
  programada: { label: "Pendiente", variant: "outline", icon: AlertCircle, color: "text-warning" },
  completada: { label: "Completada", variant: "secondary", icon: CheckCircle2, color: "text-muted-foreground" },
  cancelada: { label: "Cancelada", variant: "destructive", icon: XCircle, color: "text-destructive" },
};

const CANCEL_REASONS = [
  "Inconveniente del paciente",
  "Inconveniente del médico",
  "Problema con las instalaciones",
  "Otro motivo",
];

export default function Agenda() {
  const { chatAppointments } = useStoreSync();
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>([]);
  const [overrides, setOverrides] = useState<Record<string, Partial<Appointment>>>({});
  const [filter, setFilter] = useState<string | null>(null);

  // Dialogs
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  // New appointment form
  const [newApt, setNewApt] = useState({ patientId: "", datetime: "", reason: "", notes: "" });
  // Cancel form
  const [cancelReason, setCancelReason] = useState("");
  // Reschedule form
  const [newDatetime, setNewDatetime] = useState("");

  const allAppointments = [...appointments, ...chatAppointments, ...localAppointments].map(a => ({
    ...a,
    ...(overrides[a.id] || {}),
  }));
  const sorted = [...allAppointments].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  const chatAptIds = new Set(chatAppointments.map(a => a.id));

  const filtered = filter === "chat"
    ? sorted.filter(a => chatAptIds.has(a.id))
    : filter
      ? sorted.filter(a => a.status === filter)
      : sorted;

  const upcoming = filtered.filter(a => a.status === "programada" || a.status === "confirmada");
  const past = filtered.filter(a => a.status === "completada" || a.status === "cancelada");


  const handleConfirm = (name: string) => {
    toast.success("Recordatorio enviado", {
      description: `Se envió recordatorio de cita a ${name} por WhatsApp`,
    });
  };

  const handleNewAppointment = () => {
    if (!newApt.patientId || !newApt.datetime || !newApt.reason.trim()) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    const patient = patients.find(p => p.id === newApt.patientId);
    const apt: Appointment = {
      id: `local-apt-${Date.now()}`,
      patientId: newApt.patientId,
      patientName: patient?.name || "Paciente",
      datetime: newApt.datetime,
      status: "programada",
      reason: newApt.reason,
      notes: newApt.notes || undefined,
    };
    setLocalAppointments(prev => [...prev, apt]);
    setNewDialogOpen(false);
    setNewApt({ patientId: "", datetime: "", reason: "", notes: "" });
    toast.success("Cita agendada", { description: `${apt.patientName} — ${new Date(apt.datetime).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}` });
  };

  const handleCancel = () => {
    if (!selectedApt || !cancelReason) return;
    setOverrides(prev => ({ ...prev, [selectedApt.id]: { status: "cancelada", notes: `Cancelada: ${cancelReason}` } }));
    setCancelDialogOpen(false);
    setCancelReason("");
    toast.success("Cita cancelada", { description: `La cita de ${selectedApt.patientName} fue cancelada` });
  };

  const handleReschedule = () => {
    if (!selectedApt || !newDatetime) return;
    setOverrides(prev => ({ ...prev, [selectedApt.id]: { datetime: newDatetime, notes: `Reagendada desde ${new Date(selectedApt.datetime).toLocaleDateString("es-MX")}` } }));
    setRescheduleDialogOpen(false);
    setNewDatetime("");
    toast.success("Cita reagendada", { description: `${selectedApt.patientName} — Nueva fecha: ${new Date(newDatetime).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}` });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Agenda</h1>
          <p className="text-sm text-destructive-foreground">
            {upcoming.length} citas próximas · Semana del 23 al 29 de marzo
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => setNewDialogOpen(true)} className="gap-2 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all">
              <Plus className="h-4 w-4" />
              Nueva cita
            </Button>
          </TooltipTrigger>
          <TooltipContent>Agendar nueva cita manualmente</TooltipContent>
        </Tooltip>
      </div>

      {/* Summary badges */}
      <div className="flex gap-2 flex-wrap overflow-x-auto">
        <Badge variant="outline" className="gap-1 py-1.5 px-3 rounded-xl border border-primary/20 bg-primary text-destructive-foreground">
          <CheckCircle2 className="h-3 w-3" /> {upcoming.filter(a => a.status === "confirmada").length} confirmadas
        </Badge>
        <Badge variant="outline" className="gap-1 py-1.5 px-3 rounded-xl border-warning/30 text-warning">
          <AlertCircle className="h-3 w-3" /> {upcoming.filter(a => a.status === "programada").length} pendientes
        </Badge>
        <Badge variant="secondary" className="gap-1 py-1.5 px-3 rounded-xl bg-muted/50">
          <CheckCircle2 className="h-3 w-3" /> {past.filter(a => a.status === "completada").length} completadas
        </Badge>
        {past.filter(a => a.status === "cancelada").length > 0 && (
          <Badge variant="destructive" className="gap-1 py-1.5 px-3 rounded-xl">
            <XCircle className="h-3 w-3" /> {past.filter(a => a.status === "cancelada").length} canceladas
          </Badge>
        )}
        {chatAppointments.length > 0 && (
          <Badge variant="outline" className="gap-1 py-1.5 px-3 rounded-xl border border-primary/20 text-amber-400 bg-primary">
            <MessageCircle className="h-3 w-3" /> {chatAppointments.length} vía chat
          </Badge>
        )}
      </div>

      {/* Upcoming */}
      <Card className="glass border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <Clock className="h-3.5 w-3.5 text-primary" />
            </div>
            Próximas citas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcoming.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-6">No hay citas próximas</p>
          )}
          {upcoming.map((apt) => {
            const config = statusConfig[apt.status] || statusConfig.programada;
            const fromChat = chatAptIds.has(apt.id);
            return (
              <div key={apt.id} className={`rounded-xl border p-4 hover:bg-muted/20 transition-all ${fromChat ? "border-success/30 bg-success/5" : "border-border/40 bg-muted/10"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-center min-w-[52px] rounded-xl bg-primary/10 py-2 px-3">
                      <p className={`font-display text-lg font-bold ${config.color} leading-none`}>
                        {new Date(apt.datetime).getDate()}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase mt-0.5">
                        {new Date(apt.datetime).toLocaleDateString("es-MX", { month: "short" })}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{apt.patientName}</p>
                        {fromChat && (
                          <Badge variant="outline" className="text-[9px] border-success/30 text-success gap-0.5 py-0 px-1.5 rounded-full shrink-0">
                            <MessageCircle className="h-2.5 w-2.5" />
                            Chat
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{apt.reason}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        🕐 {new Date(apt.datetime).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                        {apt.notes && <span className="ml-2">· 📝 {apt.notes}</span>}
                      </p>
                    </div>
                  </div>
                  <Badge variant={config.variant} className="text-[10px] gap-1 shrink-0 rounded-full ml-2">
                    <config.icon className="h-2.5 w-2.5" />
                    {config.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {apt.status === "programada" && (
                    <Button variant="ghost" size="sm" className="text-xs rounded-xl hover:bg-primary/10 hover:text-primary" onClick={() => handleConfirm(apt.patientName)}>
                      📲 Recordar
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs rounded-xl hover:bg-accent/10 hover:text-accent"
                    onClick={() => { setSelectedApt(apt); setNewDatetime(apt.datetime); setRescheduleDialogOpen(true); }}
                  >
                    <CalendarClock className="h-3.5 w-3.5 mr-1" />
                    Reagendar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs rounded-xl hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => { setSelectedApt(apt); setCancelDialogOpen(true); }}
                  >
                    <Ban className="h-3.5 w-3.5 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Past */}
      <Card className="glass border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-muted/30 flex items-center justify-center">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            Citas anteriores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {past.map((apt) => {
            const config = statusConfig[apt.status] || statusConfig.completada;
            return (
              <div key={apt.id} className="flex items-center justify-between rounded-xl border border-border/30 p-3 opacity-60 bg-muted/10">
                <div>
                  <p className="text-sm font-medium">{apt.patientName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(apt.datetime).toLocaleDateString("es-MX", { day: "numeric", month: "short" })} — {apt.reason}
                  </p>
                  {apt.notes && <p className="text-[10px] text-muted-foreground mt-0.5">📝 {apt.notes}</p>}
                </div>
                <Badge variant={config.variant} className="text-[10px] gap-1 rounded-full">
                  <config.icon className="h-2.5 w-2.5" />
                  {config.label}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* New appointment dialog */}
      <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Agendar nueva cita</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <Label>Paciente *</Label>
              <Select value={newApt.patientId} onValueChange={v => setNewApt(p => ({ ...p, patientId: v }))}>
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Seleccionar paciente" /></SelectTrigger>
                <SelectContent>
                  {patients.filter(p => p.id !== "10" && p.status === "activo").map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fecha y hora *</Label>
              <Input type="datetime-local" value={newApt.datetime} onChange={e => setNewApt(p => ({ ...p, datetime: e.target.value }))} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Motivo de la cita *</Label>
              <Input value={newApt.reason} onChange={e => setNewApt(p => ({ ...p, reason: e.target.value }))} placeholder="Ej: Control de hipertensión" className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Notas adicionales</Label>
              <Textarea value={newApt.notes} onChange={e => setNewApt(p => ({ ...p, notes: e.target.value }))} placeholder="Indicaciones especiales..." className="mt-1 rounded-xl" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewDialogOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button onClick={handleNewAppointment} className="rounded-xl bg-gradient-to-r from-primary to-accent">Agendar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-destructive">Cancelar cita</DialogTitle>
          </DialogHeader>
          {selectedApt && (
            <div className="space-y-3 py-2">
              <p className="text-sm">
                ¿Cancelar la cita de <span className="font-semibold">{selectedApt.patientName}</span> del {new Date(selectedApt.datetime).toLocaleDateString("es-MX", { day: "numeric", month: "long" })}?
              </p>
              <div>
                <Label>Motivo de cancelación *</Label>
                <Select value={cancelReason} onValueChange={setCancelReason}>
                  <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Seleccionar motivo" /></SelectTrigger>
                  <SelectContent>
                    {CANCEL_REASONS.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)} className="rounded-xl">Volver</Button>
            <Button variant="destructive" onClick={handleCancel} disabled={!cancelReason} className="rounded-xl">Confirmar cancelación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Reagendar cita</DialogTitle>
          </DialogHeader>
          {selectedApt && (
            <div className="space-y-3 py-2">
              <p className="text-sm">
                Reagendar cita de <span className="font-semibold">{selectedApt.patientName}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Fecha actual: {new Date(selectedApt.datetime).toLocaleDateString("es-MX", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
              </p>
              <div>
                <Label>Nueva fecha y hora *</Label>
                <Input type="datetime-local" value={newDatetime} onChange={e => setNewDatetime(e.target.value)} className="mt-1 rounded-xl" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button onClick={handleReschedule} disabled={!newDatetime} className="rounded-xl bg-gradient-to-r from-primary to-accent">Reagendar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
