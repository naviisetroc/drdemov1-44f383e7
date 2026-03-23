import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Calendar, FileText, ArrowRightLeft, Heart, AlertTriangle, Shield, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { patients, clinicalNotes, appointments, referrals } from "@/data/mockData";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  confirmada: { label: "✅ Confirmada", variant: "default" },
  programada: { label: "🕐 Pendiente", variant: "outline" },
  completada: { label: "✓ Completada", variant: "secondary" },
  cancelada: { label: "✕ Cancelada", variant: "destructive" },
};

export default function PacienteDetalle() {
  const { id } = useParams();
  const patient = patients.find((p) => p.id === id);

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
      <Link to="/pacientes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Volver a pacientes
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">
          {isNewPatient ? <UserPlus className="h-6 w-6" /> : patient.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-bold">{patient.name}</h1>
            <Badge variant={patient.status === "activo" ? "default" : "secondary"}>{patient.status}</Badge>
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
                <Button variant="outline" size="sm" className="gap-1.5"><Phone className="h-3.5 w-3.5" /> Llamar</Button>
              </TooltipTrigger>
              <TooltipContent>{patient.phone}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Button>
              </TooltipTrigger>
              <TooltipContent>{patient.email}</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      {/* New patient banner */}
      {isNewPatient && (
        <Card className="shadow-card border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-3">
            <UserPlus className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold">Paciente nuevo</p>
              <p className="text-xs text-muted-foreground">Este paciente aún no tiene historial clínico. Comienza registrando su primera consulta.</p>
            </div>
            <Link to="/notas" className="ml-auto">
              <Button size="sm" className="gap-1.5 shrink-0"><FileText className="h-3.5 w-3.5" /> Crear nota</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Info cards */}
      {!isNewPatient && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> Teléfono</p>
              <p className="text-sm font-medium mt-0.5">{patient.phone}</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Última visita</p>
              <p className="text-sm font-medium mt-0.5">{new Date(patient.lastVisit).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Shield className="h-3 w-3" /> Seguro médico</p>
              <p className="text-sm font-medium mt-0.5">{patient.insuranceProvider || "No registrado"}</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Heart className="h-3 w-3" /> Contacto de emergencia</p>
              <p className="text-sm font-medium mt-0.5 truncate">{patient.emergencyContact || "No registrado"}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Conditions & Allergies row */}
      {!isNewPatient && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-2">Condiciones activas</p>
              <div className="flex gap-1.5 flex-wrap">
                {patient.conditions.length > 0
                  ? patient.conditions.map(c => <Badge key={c} variant="outline" className="text-[11px]">{c}</Badge>)
                  : <span className="text-sm text-muted-foreground">Ninguna registrada</span>
                }
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-warning" /> Alergias
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {patient.allergies && patient.allergies.length > 0
                  ? patient.allergies.map(a => <Badge key={a} variant="destructive" className="text-[11px]">{a}</Badge>)
                  : <span className="text-sm text-muted-foreground">Sin alergias conocidas</span>
                }
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Clinical notes */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Notas Clínicas
            <Badge variant="secondary" className="text-[10px] ml-auto">{patientNotes.length} notas</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {patientNotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No hay notas clínicas registradas.</p>
              <Link to="/notas">
                <Button variant="outline" size="sm" className="mt-3 gap-1.5"><FileText className="h-3.5 w-3.5" /> Crear primera nota</Button>
              </Link>
            </div>
          ) : (
            patientNotes.map((note) => (
              <div key={note.id} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">{note.format}</Badge>
                    <Badge variant="outline" className="text-[10px]">{note.inputType}</Badge>
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
                      .replace(/━+/g, '<hr class="border-border my-1"/>')
                      .replace(/→/g, '<span class="text-primary">→</span>')
                  }}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Appointments */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Historial de Citas
            <Badge variant="secondary" className="text-[10px] ml-auto">{patientAppts.length} citas</Badge>
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
                  <div key={apt.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">{apt.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(apt.datetime).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })} — {new Date(apt.datetime).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <Badge variant={config.variant} className="text-[10px]">{config.label}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Referrals */}
      {patientRefs.length > 0 && (
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-primary" />
              Referencias Médicas
              <Badge variant="secondary" className="text-[10px] ml-auto">{patientRefs.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patientRefs.map((ref) => (
              <div key={ref.id} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge>{ref.toSpecialty}</Badge>
                    {ref.status && (
                      <Badge variant={ref.status === "enviada" ? "default" : ref.status === "aceptada" ? "secondary" : "outline"} className="text-[10px]">
                        {ref.status === "enviada" ? "📨 Enviada" : ref.status === "aceptada" ? "✅ Aceptada" : "🕐 Pendiente"}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(ref.date).toLocaleDateString("es-MX")}</span>
                </div>
                <p className="text-sm">{ref.notes}</p>
                <Separator />
                <p className="text-sm text-muted-foreground">{ref.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
