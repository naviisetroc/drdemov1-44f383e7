import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  FileText,
  LogOut,
  Stethoscope,
  Clock,
  User,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Activity,
  ChevronRight,
  Folder,
} from "lucide-react";
import { useFontSize } from "@/hooks/useFontSize";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getChatPatients, getChatAppointments, ChatPatient } from "@/stores/patientChatStore";
import { Appointment } from "@/data/mockData";
import { getPatientPrescriptions, getPatientIndications } from "@/stores/patientMockPrescriptions";
import PatientChatWidget from "@/components/PatientChatWidget";
import PatientAppointments from "@/components/PatientAppointments";
import PatientMedicalHistory from "@/components/PatientMedicalHistory";
import PatientFiles from "@/components/PatientFiles";
import PatientSymptomTracker from "@/components/PatientSymptomTracker";
import FontSizeButton from "@/components/FontSizeButton";
import { toast } from "sonner";

interface PatientSession {
  id: string;
  name: string;
  email: string;
}

function getPatientStatus(appointments: Appointment[]): {
  label: string;
  color: string;
  icon: React.ReactNode;
} {
  const upcoming = appointments.filter(
    (a) => a.status === "programada" || a.status === "confirmada"
  );
  if (upcoming.length > 0)
    return {
      label: "En tratamiento",
      color: "bg-amber-500/15 text-amber-600 border-amber-500/20",
      icon: <Activity className="h-3.5 w-3.5" />,
    };
  const completed = appointments.filter((a) => a.status === "completada");
  if (completed.length > 0)
    return {
      label: "Finalizado",
      color: "bg-green-500/15 text-green-600 border-green-500/20",
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    };
  return {
    label: "Pendiente",
    color: "bg-blue-500/15 text-blue-600 border-blue-500/20",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  };
}

export default function PacienteDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<PatientSession | null>(null);
  const [patient, setPatient] = useState<ChatPatient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [chatOpen, setChatOpen] = useState(false);

  const prescriptions = patient ? getPatientPrescriptions(patient.id) : [];
  const indications = patient ? getPatientIndications(patient.id) : [];

  useEffect(() => {
    const raw = localStorage.getItem("medisec_patient_session");
    if (!raw) {
      navigate("/paciente/login");
      return;
    }
    const sess: PatientSession = JSON.parse(raw);
    setSession(sess);

    // Small delay to ensure store is fully hydrated on mobile first-load
    const init = () => {
      const allPatients = getChatPatients();
      const found = allPatients.find((p) => p.id === sess.id);
      if (found) {
        setPatient(found);
        const allAppts = getChatAppointments();
        setAppointments(allAppts.filter((a) => a.patientId === sess.id));
      }
    };

    init();
    // Retry once after a tick for mobile cold-start edge case
    const timer = setTimeout(init, 150);

    // Show font-size tip every time the dashboard loads
    const tipTimer = setTimeout(() => {
      toast.custom(() => (
        <div className="w-full max-w-sm rounded-2xl bg-gradient-to-r from-primary to-accent p-4 shadow-xl text-primary-foreground flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary-foreground/25 flex items-center justify-center shrink-0 mt-0.5">
            <span className="font-bold leading-none tracking-tight" style={{ fontFamily: "system-ui, sans-serif" }}>
              <span className="text-xl">A</span><span className="text-sm">a</span>
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base leading-tight">¿Necesitas texto más grande?</p>
            <p className="text-sm opacity-90 mt-1 leading-snug">
              Pulsa el botón <strong style={{ fontFamily: "system-ui, sans-serif" }}>Aa</strong> en la esquina superior derecha para aumentar el tamaño de la fuente.
            </p>
          </div>
        </div>
      ), { duration: 10000 });
    }, 1200);

    return () => { clearTimeout(timer); clearTimeout(tipTimer); };

    return () => clearTimeout(timer);
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("medisec_patient_session");
    window.location.href = "/paciente/login";
  }

  if (!session || !patient) return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </div>
    </div>
  );

  const status = getPatientStatus(appointments);
  const nextAppointment = appointments
    .filter((a) => a.status === "programada" || a.status === "confirmada")
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())[0];
  const lastIndication = indications.length > 0 ? indications[indications.length - 1] : null;

  return (
    <div className="min-h-screen gradient-bg overflow-x-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-3 flex items-center gap-3 shadow-elevated">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-sm">Portal del Paciente</h1>
          <p className="text-xs opacity-80">Bienvenido/a, {patient.name.split(" ")[0]}</p>
        </div>
        <FontSizeButton />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-primary-foreground hover:bg-primary-foreground/20 rounded-xl"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* ─── HERO SUMMARY ─── */}
        <div className="space-y-3">
          {/* Next appointment */}
          <Card className="glass-strong border-border/30 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Próxima cita</p>
                {nextAppointment ? (
                  <>
                    <p className="text-sm font-semibold" style={{ overflowWrap: "break-word", wordBreak: "normal" }}>{nextAppointment.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(nextAppointment.datetime).toLocaleDateString("es-MX", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}{" "}
                      —{" "}
                      {new Date(nextAppointment.datetime).toLocaleTimeString("es-MX", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin citas programadas</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Patient status */}
          <Card className="glass-strong border-border/30 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <Badge className={`rounded-full ${status.color} gap-1.5 px-3 py-1`}>
                {status.icon}
                {status.label}
              </Badge>
              <p className="text-xs text-muted-foreground">Estado actual</p>
            </CardContent>
          </Card>
        </div>

        {/* Last indication highlight */}
        {lastIndication && (
          <Card className="glass-strong border-primary/20 shadow-sm border-l-4 border-l-primary">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Última indicación</p>
                <p className="text-sm font-semibold">{lastIndication.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {lastIndication.details.split("\n")[0]}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ─── CTA ─── */}
        <Button
          onClick={() => setChatOpen(true)}
          className="w-full gap-2 h-13 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all text-primary-foreground font-semibold text-sm shadow-lg glow-primary"
        >
          <MessageCircle className="h-5 w-5" />
          Hablar con mi asistente
        </Button>

        {/* ─── CITAS ─── */}
        <PatientAppointments appointments={appointments} />

        {/* ─── HISTORIAL ─── */}
        <PatientMedicalHistory
          patient={patient}
          prescriptions={prescriptions}
          indications={indications}
        />

        {/* ─── SÍNTOMAS ─── */}
        <PatientSymptomTracker patientId={patient.id} appointments={appointments} />

        {/* ─── ARCHIVOS ─── */}
        <PatientFiles patientId={patient.id} />
      </div>

      {/* Floating Chat Widget */}
      <PatientChatWidget patient={patient} forceOpen={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}
