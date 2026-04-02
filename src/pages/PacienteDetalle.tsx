import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Calendar, FileText, ArrowRightLeft, Heart, AlertTriangle, Shield, UserPlus, FolderOpen, Upload, File, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { patients, clinicalNotes, appointments, referrals, patientFiles, type PatientFile } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  confirmada: { label: "✅ Confirmada", variant: "default" },
  programada: { label: "🕐 Pendiente", variant: "outline" },
  completada: { label: "✓ Completada", variant: "secondary" },
  cancelada: { label: "✕ Cancelada", variant: "destructive" },
};

export default function PacienteDetalle() {
  const { id } = useParams();
  const patient = patients.find((p) => p.id === id);
  const [extraFiles, setExtraFiles] = useState<PatientFile[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<PatientFile["type"]>("estudio");
  const [fileNotes, setFileNotes] = useState("");

  if (!patient) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Paciente no encontrado</p>
        <Link to="/pacientes" className="text-primary text-sm hover:underline mt-2 inline-block">← Volver</Link>
      </div>
    );
  }

  const isNewPatient = patient.id === "10";
  const patientNotes = clinicalNotes.filter((n) => n.patientId === id);
  const patientAppts = appointments.filter((a) => a.patientId === id);
  const patientRefs = referrals.filter((r) => r.patientId === id);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <Link to="/pacientes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Volver a pacientes
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 font-display text-lg font-bold text-primary">
          {isNewPatient ? <UserPlus className="h-6 w-6" /> : patient.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-bold">{patient.name}</h1>
            <Badge variant={patient.status === "activo" ? "default" : "secondary"} className="rounded-full bg-primary/15 text-primary border-primary/20">{patient.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isNewPatient
              ? "Paciente nuevo — Sin información registrada"
              : `${patient.age} años · ${patient.sex === "M" ? "Masculino" : "Femenino"}${patient.bloodType ? ` · Tipo ${patient.bloodType}` : ""}`
            }
          </p>
        </div>
        {!isNewPatient && (
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 rounded-xl border-border/40 hover:border-primary/30"><Phone className="h-3.5 w-3.5" /> Llamar</Button>
              </TooltipTrigger>
              <TooltipContent>{patient.phone}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 rounded-xl border-border/40 hover:border-primary/30"><Mail className="h-3.5 w-3.5" /> Email</Button>
              </TooltipTrigger>
              <TooltipContent>{patient.email}</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      {/* New patient banner */}
      {isNewPatient && (
        <Card className="glass border-primary/20 overflow-hidden">
          <CardContent className="p-4 flex items-center gap-3 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
            <UserPlus className="h-5 w-5 text-primary shrink-0 relative" />
            <div className="relative">
              <p className="text-sm font-semibold">Paciente nuevo</p>
              <p className="text-xs text-muted-foreground">Este paciente aún no tiene historial clínico. Comienza registrando su primera consulta.</p>
            </div>
            <Link to="/notas" className="ml-auto relative">
              <Button size="sm" className="gap-1.5 shrink-0 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90"><FileText className="h-3.5 w-3.5" /> Crear nota</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Info cards */}
      {!isNewPatient && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Phone, label: "Teléfono", value: patient.phone },
            { icon: Calendar, label: "Última visita", value: new Date(patient.lastVisit).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" }) },
            { icon: Shield, label: "Seguro médico", value: patient.insuranceProvider || "No registrado" },
            { icon: Heart, label: "Contacto de emergencia", value: patient.emergencyContact || "No registrado" },
          ].map((item) => (
            <Card key={item.label} className="glass border-border/40">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><item.icon className="h-3 w-3 text-primary/60" /> {item.label}</p>
                <p className="text-sm font-medium mt-1 truncate">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Conditions & Allergies */}
      {!isNewPatient && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="glass border-border/40">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-2">Condiciones activas</p>
              <div className="flex gap-1.5 flex-wrap">
                {patient.conditions.length > 0
                  ? patient.conditions.map(c => <Badge key={c} variant="outline" className="text-[11px] rounded-full border-border/40">{c}</Badge>)
                  : <span className="text-sm text-muted-foreground">Ninguna registrada</span>
                }
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-border/40">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-warning" /> Alergias
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {patient.allergies && patient.allergies.length > 0
                  ? patient.allergies.map(a => <Badge key={a} variant="destructive" className="text-[11px] rounded-full">{a}</Badge>)
                  : <span className="text-sm text-muted-foreground">Sin alergias conocidas</span>
                }
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Clinical notes */}
      <Card className="glass border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <FileText className="h-3.5 w-3.5 text-primary" />
            </div>
            Notas Clínicas
            <Badge variant="secondary" className="text-[10px] ml-auto bg-primary/10 text-primary border-primary/20">{patientNotes.length} notas</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {patientNotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No hay notas clínicas registradas.</p>
              <Link to="/notas">
                <Button variant="outline" size="sm" className="mt-3 gap-1.5 rounded-xl border-border/40"><FileText className="h-3.5 w-3.5" /> Crear primera nota</Button>
              </Link>
            </div>
          ) : (
            patientNotes.map((note) => (
              <div key={note.id} className="rounded-xl border border-border/30 p-4 space-y-2 bg-muted/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] rounded-full bg-muted/50">{note.format}</Badge>
                    <Badge variant="outline" className="text-[10px] rounded-full border-border/40">{note.inputType}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div
                  className="text-sm whitespace-pre-line leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: note.aiOutput
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/━+/g, '<hr class="border-border/30 my-1"/>')
                      .replace(/→/g, '<span class="text-primary">→</span>')
                  }}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Appointments */}
      <Card className="glass border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <Calendar className="h-3.5 w-3.5 text-primary" />
            </div>
            Historial de Citas
            <Badge variant="secondary" className="text-[10px] ml-auto bg-primary/10 text-primary border-primary/20">{patientAppts.length} citas</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patientAppts.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No hay citas registradas.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {patientAppts.map((apt) => {
                const config = statusConfig[apt.status] || statusConfig.programada;
                return (
                  <div key={apt.id} className="flex items-center justify-between rounded-xl border border-border/30 p-3 bg-muted/10">
                    <div>
                      <p className="text-sm font-medium">{apt.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(apt.datetime).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })} — {new Date(apt.datetime).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <Badge variant={config.variant} className="text-[10px] rounded-full">{config.label}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Referrals */}
      {patientRefs.length > 0 && (
        <Card className="glass border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-accent/15 flex items-center justify-center">
                <ArrowRightLeft className="h-3.5 w-3.5 text-accent" />
              </div>
              Referencias Médicas
              <Badge variant="secondary" className="text-[10px] ml-auto bg-accent/10 text-accent border-accent/20">{patientRefs.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patientRefs.map((ref) => (
              <div key={ref.id} className="rounded-xl border border-border/30 p-4 space-y-2 bg-muted/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-full bg-accent/15 text-accent border-accent/20">{ref.toSpecialty}</Badge>
                    {ref.status && (
                      <Badge variant={ref.status === "enviada" ? "default" : ref.status === "aceptada" ? "secondary" : "outline"} className="text-[10px] rounded-full">
                        {ref.status === "enviada" ? "📨 Enviada" : ref.status === "aceptada" ? "✅ Aceptada" : "🕐 Pendiente"}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(ref.date).toLocaleDateString("es-MX")}</span>
                </div>
                <p className="text-sm">{ref.notes}</p>
                <Separator className="bg-border/30" />
                <p className="text-sm text-muted-foreground">{ref.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
