import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText, LogOut, Stethoscope, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getChatPatients, getChatAppointments, ChatPatient } from "@/stores/patientChatStore";
import { Appointment } from "@/data/mockData";

interface PatientSession {
  id: string;
  name: string;
  email: string;
}

export default function PacienteDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<PatientSession | null>(null);
  const [patient, setPatient] = useState<ChatPatient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("medisec_patient_session");
    if (!raw) {
      navigate("/paciente/login");
      return;
    }
    const sess: PatientSession = JSON.parse(raw);
    setSession(sess);

    const allPatients = getChatPatients();
    const found = allPatients.find((p) => p.id === sess.id);
    if (found) setPatient(found);

    const allAppts = getChatAppointments();
    setAppointments(allAppts.filter((a) => a.patientId === sess.id));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("medisec_patient_session");
    navigate("/paciente/login");
  }

  if (!session || !patient) return null;

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-3 flex items-center gap-3 shadow-elevated">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-sm">Portal del Paciente</h1>
          <p className="text-xs opacity-80">Bienvenido/a, {patient.name}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-primary-foreground hover:bg-primary-foreground/20 rounded-xl">
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Patient Info */}
        <Card className="glass-strong border-border/30 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-display">{patient.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{patient.age} años • {patient.sex === "F" ? "Femenino" : "Masculino"}</p>
              </div>
              <Badge className="ml-auto rounded-full bg-green-500/15 text-green-500 border-green-500/20">
                Cuenta activa
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-muted-foreground text-xs mb-1">📧 Correo</p>
                <p className="font-medium">{patient.email}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-muted-foreground text-xs mb-1">🩺 Motivo de registro</p>
                <p className="font-medium">{patient.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card className="glass-strong border-border/30 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Mis citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No tienes citas programadas.</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{apt.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(apt.datetime).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })} — {new Date(apt.datetime).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <Badge className="rounded-full bg-accent/15 text-accent border-accent/20 shrink-0">
                      {apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medical Summary */}
        <Card className="glass-strong border-border/30 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Mi información médica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-xl bg-muted/30">
              <p className="text-muted-foreground text-xs mb-1">Síntomas reportados</p>
              <p className="text-sm">{patient.symptoms}</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/30">
              <p className="text-muted-foreground text-xs mb-1">Antecedentes médicos</p>
              <p className="text-sm">{patient.history}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
