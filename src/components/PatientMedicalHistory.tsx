import { useState, useRef, useEffect, useCallback } from "react";
import {
  FileText,
  User,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  ClipboardList,
  Pill,
  Calendar,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ChatPatient } from "@/stores/patientChatStore";
import {
  Prescription,
  Indication,
} from "@/stores/patientMockPrescriptions";

/* ── Mock clinical records ── */
export interface ClinicalRecord {
  id: string;
  patientId: string;
  date: string;
  reason: string;
  symptoms: string;
  diagnosis: string;
  plan: string;
  doctorName: string;
}

const MOCK_RECORDS: ClinicalRecord[] = [
  {
    id: "rec-1",
    patientId: "chat-seed-demo",
    date: "2026-03-15",
    reason: "Dolor de rodilla derecha",
    symptoms: "Dolor al subir escaleras, inflamación leve, rigidez matutina de 20 min.",
    diagnosis: "Lesión de menisco medial — probable desgarro parcial.",
    plan: "Artroscopia diagnóstica y terapéutica programada. RM previa. Analgésicos.",
    doctorName: "Dr. Alejandro Ramírez",
  },
  {
    id: "rec-2",
    patientId: "chat-seed-demo",
    date: "2026-03-20",
    reason: "Artroscopia de rodilla derecha",
    symptoms: "Bloqueo articular intermitente, dolor 7/10 con actividad.",
    diagnosis: "Desgarro parcial de menisco medial confirmado por artroscopia.",
    plan: "Reparación artroscópica exitosa. Inicio de rehabilitación en 1 semana. Hielo, reposo relativo.",
    doctorName: "Dr. Alejandro Ramírez",
  },
  {
    id: "rec-3",
    patientId: "chat-seed-demo",
    date: "2026-03-25",
    reason: "Seguimiento post-quirúrgico — Semana 1",
    symptoms: "Dolor controlado 3/10. Inflamación residual leve. Movilidad en mejoría.",
    diagnosis: "Evolución favorable post-artroscopia. Sin signos de infección.",
    plan: "Continuar rehabilitación 3x/semana. Analgésico de mantenimiento. Próxima valoración en 2 semanas.",
    doctorName: "Dr. Alejandro Ramírez",
  },
];

export function getPatientClinicalRecords(patientId: string) {
  return MOCK_RECORDS.filter((r) => r.patientId === patientId);
}

/* ── AI explanations (mock) ── */
const AI_EXPLANATIONS: Record<string, string> = {
  "rec-1":
    "Tu doctor encontró que el cartílago de tu rodilla (llamado menisco) tiene un pequeño desgarro. Por eso sientes dolor al subir escaleras. Se programó una cirugía menor para repararlo y se pidió una resonancia para confirmar.",
  "rec-2":
    "Te realizaron una cirugía menor en la rodilla para reparar el desgarro del menisco. Todo salió bien. Ahora necesitas seguir un plan de recuperación con ejercicios guiados, aplicar hielo y descansar.",
  "rec-3":
    "En tu visita de seguimiento, el doctor confirmó que tu rodilla se está recuperando correctamente. El dolor ha bajado y no hay infección. Debes continuar con tus ejercicios de rehabilitación y tomar el medicamento para el dolor si lo necesitas.",
};

/* ── Component ── */
interface PatientMedicalHistoryProps {
  patient: ChatPatient;
  prescriptions: Prescription[];
  indications: Indication[];
  isEmpty?: boolean;
}

export default function PatientMedicalHistory({
  patient,
  prescriptions,
  indications,
  isEmpty = false,
}: PatientMedicalHistoryProps) {
  const records = isEmpty ? [] : getPatientClinicalRecords(patient.id);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiExplain, setAiExplain] = useState<{
    record: ClinicalRecord;
    text: string;
  } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTrigger, setAiTrigger] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingRecordRef = useRef<ClinicalRecord | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Start typing animation after dialog is open and state is settled
  useEffect(() => {
    if (aiExplain && pendingRecordRef.current && aiExplain.text === "" && aiLoading) {
      const record = pendingRecordRef.current;
      pendingRecordRef.current = null;

      const fullText =
        AI_EXPLANATIONS[record.id] ??
        `Tu consulta del ${new Date(record.date).toLocaleDateString("es-MX")} fue por ${record.reason.toLowerCase()}. El diagnóstico fue: ${record.diagnosis}. El plan a seguir incluye: ${record.plan}`;
      
      let i = 0;
      // Small delay to let dialog mount on mobile
      const timeout = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          i += 3;
          if (i >= fullText.length) {
            setAiExplain({ record, text: fullText });
            setAiLoading(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
          } else {
            setAiExplain({ record, text: fullText.slice(0, i) });
          }
        }, 20);
      }, 100);

      return () => {
        clearTimeout(timeout);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [aiTrigger]);

  function handleExplain(record: ClinicalRecord) {
    // Clear any running animation
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    pendingRecordRef.current = record;
    setAiLoading(true);
    setAiExplain({ record, text: "" });
    setAiTrigger((t) => t + 1);
  }

  function handleCloseExplain() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    pendingRecordRef.current = null;
    setAiExplain(null);
    setAiLoading(false);
  }

  return (
    <>
      <Card className="glass-strong border-border/30 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Historial médico
            {records.length > 0 && (
              <Badge variant="secondary" className="ml-auto rounded-full text-xs">
                {records.length + prescriptions.length + indications.length} registros
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          {/* Patient info card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{patient.name}</p>
              <p className="text-xs text-muted-foreground">
                {patient.age} años • {patient.sex === "F" ? "Femenino" : "Masculino"} • {patient.email}
              </p>
            </div>
          </div>

          {records.length === 0 && prescriptions.length === 0 && indications.length === 0 ? (
            <div className="flex flex-col items-center text-center py-8 text-muted-foreground">
              <FileText className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm">Sin historial médico aún</p>
              <p className="text-xs mt-1">Tu historial aparecerá aquí después de tu primera consulta con el médico.</p>
            </div>
          ) : (
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/50" />

            {/* Clinical records */}
            {records
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((rec, idx) => {
                const isExpanded = expandedId === rec.id;
                const dt = new Date(rec.date);
                return (
                  <div key={rec.id} className="relative pl-12 pb-4 overflow-hidden">
                    {/* Timeline dot */}
                    <div className="absolute left-[12px] top-1 h-4 w-4 rounded-full border-2 border-primary bg-background z-10" />

                    <div
                      className={`rounded-2xl border p-4 transition-all ${
                        isExpanded
                          ? "border-primary/30 bg-card shadow-md"
                          : "border-border/30 bg-card hover:shadow-sm"
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className="rounded-full bg-primary/10 text-primary border-transparent text-[11px] gap-1 px-2">
                              <Calendar className="h-3 w-3" />
                              {dt.toLocaleDateString("es-MX", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {rec.doctorName}
                            </span>
                          </div>
                          <p className="text-sm font-semibold mt-1.5">{rec.reason}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : rec.id)
                          }
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {/* Summary row always visible */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Stethoscope className="h-3 w-3 shrink-0" />
                        <span style={{ overflowWrap: "break-word", wordBreak: "normal" }}>{rec.diagnosis}</span>
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="mt-3 space-y-2.5 pt-3 border-t border-border/30">
                          <div className="p-2.5 rounded-lg bg-muted/30">
                            <p className="text-[11px] text-muted-foreground font-medium mb-0.5 flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              Síntomas
                            </p>
                            <p className="text-sm">{rec.symptoms}</p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-muted/30">
                            <p className="text-[11px] text-muted-foreground font-medium mb-0.5 flex items-center gap-1">
                              <Stethoscope className="h-3 w-3" />
                              Diagnóstico
                            </p>
                            <p className="text-sm font-medium">{rec.diagnosis}</p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-muted/30">
                            <p className="text-[11px] text-muted-foreground font-medium mb-0.5 flex items-center gap-1">
                              <ClipboardList className="h-3 w-3" />
                              Plan / Indicaciones
                            </p>
                            <p className="text-sm">{rec.plan}</p>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 mt-1 text-xs h-8 rounded-xl border-primary/20 text-primary hover:bg-primary/5"
                            onClick={() => handleExplain(rec)}
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            Explicar con IA
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Prescriptions in timeline */}
            {prescriptions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((rx) => {
                const dt = new Date(rx.date);
                return (
                  <div key={rx.id} className="relative pl-12 pb-4">
                    <div className="absolute left-[12px] top-1 h-4 w-4 rounded-full border-2 border-accent bg-background z-10" />
                    <div className="rounded-2xl border border-border/30 bg-card p-4">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <Badge className="rounded-full bg-accent/10 text-accent border-transparent text-[11px] gap-1 px-2">
                          <Pill className="h-3 w-3" />
                          Receta
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {dt.toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          • {rx.doctorName}
                        </span>
                      </div>
                      {rx.medications.map((m, i) => (
                        <p key={i} className="text-sm text-muted-foreground break-words">
                          • <strong className="text-foreground">{m.name}</strong> {m.dose} — {m.frequency} ({m.duration})
                        </p>
                      ))}
                      {rx.notes && (
                        <p className="text-xs text-muted-foreground italic mt-1.5">
                          📝 {rx.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Indications in timeline */}
            {indications
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((ind) => {
                const dt = new Date(ind.date);
                return (
                  <div key={ind.id} className="relative pl-12 pb-4">
                    <div className="absolute left-[12px] top-1 h-4 w-4 rounded-full border-2 border-emerald-500 bg-background z-10" />
                    <div className="rounded-2xl border border-border/30 bg-card p-4">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <Badge className="rounded-full bg-emerald-500/10 text-emerald-600 border-transparent text-[11px] gap-1 px-2">
                          <ClipboardList className="h-3 w-3" />
                          Indicación
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {dt.toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">{ind.title}</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {ind.details}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
          )}
        </CardContent>
      </Card>

      {/* AI Explanation dialog */}
      <Dialog open={!!aiExplain} onOpenChange={(open) => { if (!open) handleCloseExplain(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Explicación simplificada
            </DialogTitle>
          </DialogHeader>
          {aiExplain && (
            <div className="space-y-3 py-2">
              <Badge className="rounded-full bg-primary/10 text-primary border-transparent text-xs">
                {aiExplain.record.reason}
              </Badge>
              <div className="p-4 rounded-xl bg-muted/30 min-h-[80px]">
                <p className="text-sm leading-relaxed">
                  {aiExplain.text}
                  {aiLoading && <span className="inline-block w-1.5 h-4 bg-primary/60 animate-pulse ml-0.5 align-middle rounded-sm" />}
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground text-center">
                ✨ Explicación generada por IA para facilitar tu comprensión
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseExplain}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
