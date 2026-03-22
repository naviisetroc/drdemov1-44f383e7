import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Calendar, FileText, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { patients, clinicalNotes, appointments, referrals } from "@/data/mockData";

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
          {patient.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-bold">{patient.name}</h1>
            <Badge variant={patient.status === "activo" ? "default" : "secondary"}>{patient.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {patient.age} años · {patient.sex === "M" ? "Masculino" : "Femenino"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5"><Phone className="h-3.5 w-3.5" /> Llamar</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Button>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Teléfono</p>
            <p className="text-sm font-medium mt-0.5">{patient.phone}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Última visita</p>
            <p className="text-sm font-medium mt-0.5">{new Date(patient.lastVisit).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Condiciones</p>
            <div className="flex gap-1 flex-wrap mt-1">
              {patient.conditions.length > 0
                ? patient.conditions.map(c => <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>)
                : <span className="text-sm text-muted-foreground">Ninguna registrada</span>
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinical notes */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Notas Clínicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {patientNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay notas clínicas registradas.</p>
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
                <div className="text-sm whitespace-pre-line leading-relaxed">{note.aiOutput}</div>
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patientAppts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay citas registradas.</p>
          ) : (
            <div className="space-y-2">
              {patientAppts.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{apt.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(apt.datetime).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })} — {new Date(apt.datetime).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <Badge variant={apt.status === "programada" ? "default" : apt.status === "completada" ? "secondary" : "destructive"} className="text-[10px]">
                    {apt.status}
                  </Badge>
                </div>
              ))}
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
              Referencias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patientRefs.map((ref) => (
              <div key={ref.id} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge>{ref.toSpecialty}</Badge>
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
