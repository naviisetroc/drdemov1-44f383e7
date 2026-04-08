import { useState } from "react";
import {
  Calendar,
  Clock,
  ChevronRight,
  RotateCcw,
  X,
  Eye,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Appointment } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface PatientAppointmentsProps {
  appointments: Appointment[];
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  programada: {
    label: "Pendiente",
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  confirmada: {
    label: "Confirmada",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  cancelada: {
    label: "Cancelada",
    bg: "bg-destructive/10",
    text: "text-destructive",
    dot: "bg-destructive",
  },
  completada: {
    label: "Completada",
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

export default function PatientAppointments({
  appointments,
}: PatientAppointmentsProps) {
  const [detailAppt, setDetailAppt] = useState<Appointment | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "reagendar" | "cancelar";
    appt: Appointment;
  } | null>(null);

  function handleAction(type: "reagendar" | "cancelar", appt: Appointment) {
    setConfirmAction({ type, appt });
  }

  function executeAction() {
    if (!confirmAction) return;
    const { type, appt } = confirmAction;
    if (type === "cancelar") {
      toast({
        title: "Cita cancelada",
        description: `Tu cita "${appt.reason}" ha sido cancelada exitosamente.`,
      });
    } else {
      toast({
        title: "Solicitud enviada",
        description:
          "Tu solicitud de reagendamiento fue enviada. Te contactaremos pronto.",
      });
    }
    setConfirmAction(null);
  }

  const sorted = [...appointments].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );

  return (
    <>
      <Card className="glass-strong border-border/30 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Citas
            {appointments.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-auto rounded-full text-xs"
              >
                {appointments.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center text-center py-8 text-muted-foreground">
              <Calendar className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm">No tienes citas programadas.</p>
              <p className="text-xs mt-1">
                Habla con tu asistente para agendar una.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((apt) => {
                const cfg = STATUS_CONFIG[apt.status] ?? STATUS_CONFIG.programada;
                const dt = new Date(apt.datetime);
                const isActive =
                  apt.status === "programada" || apt.status === "confirmada";

                return (
                  <div
                    key={apt.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      isActive
                        ? "border-border/40 bg-card hover:shadow-md"
                        : "border-border/20 bg-muted/20 opacity-75"
                    }`}
                  >
                    {/* Top row: status badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-9 w-9 rounded-lg flex flex-col items-center justify-center shrink-0 ${cfg.bg}`}
                        >
                          <span className={`text-[11px] font-bold ${cfg.text} leading-none`}>
                            {dt.toLocaleDateString("es-MX", { day: "numeric" })}
                          </span>
                          <span
                            className={`text-[9px] uppercase ${cfg.text} leading-none mt-0.5`}
                          >
                            {dt.toLocaleDateString("es-MX", { month: "short" })}
                          </span>
                        </div>
                        <Badge
                          className={`rounded-full ${cfg.bg} ${cfg.text} border-transparent gap-1 px-2 py-0.5 text-[11px] font-medium`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`}
                          />
                          {cfg.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Reason & time - full width so text never gets squeezed */}
                    <p className="text-sm font-semibold leading-snug" style={{ overflowWrap: "break-word", wordBreak: "normal" }}>
                      {apt.reason}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-muted-foreground">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span className="text-xs">
                        {dt.toLocaleTimeString("es-MX", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-xs">•</span>
                      <span className="text-xs">
                        {dt.toLocaleDateString("es-MX", {
                          weekday: "long",
                        })}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/20">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 text-xs gap-1.5 text-muted-foreground hover:text-foreground px-3"
                        onClick={() => setDetailAppt(apt)}
                      >
                        <Eye className="h-4 w-4 shrink-0" />
                        <span>Ver detalles</span>
                      </Button>
                      {isActive && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 text-xs gap-1.5 text-primary hover:text-primary px-3"
                            onClick={() => handleAction("reagendar", apt)}
                          >
                            <RotateCcw className="h-4 w-4 shrink-0" />
                            <span>Reagendar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 text-xs gap-1.5 text-destructive hover:text-destructive px-3"
                            onClick={() => handleAction("cancelar", apt)}
                          >
                            <X className="h-4 w-4 shrink-0" />
                            <span>Cancelar</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!detailAppt} onOpenChange={() => setDetailAppt(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles de la cita</DialogTitle>
          </DialogHeader>
          {detailAppt && (() => {
            const dt = new Date(detailAppt.datetime);
            const cfg = STATUS_CONFIG[detailAppt.status] ?? STATUS_CONFIG.programada;
            return (
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2">
                  <Badge className={`rounded-full ${cfg.bg} ${cfg.text} border-transparent gap-1.5 px-3 py-1`}>
                    <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        {dt.toLocaleDateString("es-MX", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dt.toLocaleTimeString("es-MX", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm">Consultorio del Dr. García</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40">
                    <p className="text-xs text-muted-foreground mb-1">Motivo</p>
                    <p className="text-sm font-medium">{detailAppt.reason}</p>
                  </div>
                  {detailAppt.notes && (
                    <div className="p-3 rounded-xl bg-muted/40">
                      <p className="text-xs text-muted-foreground mb-1">Notas</p>
                      <p className="text-sm">{detailAppt.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailAppt(null)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm action dialog */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.type === "cancelar"
                ? "Cancelar cita"
                : "Reagendar cita"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.type === "cancelar"
                ? `¿Estás seguro de cancelar tu cita "${confirmAction?.appt.reason}"?`
                : `¿Deseas solicitar un cambio de fecha para "${confirmAction?.appt.reason}"?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              No, volver
            </Button>
            <Button
              variant={confirmAction?.type === "cancelar" ? "destructive" : "default"}
              onClick={executeAction}
            >
              {confirmAction?.type === "cancelar"
                ? "Sí, cancelar"
                : "Sí, reagendar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
