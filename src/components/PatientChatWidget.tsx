import { useState, useRef, useEffect } from "react";
import { Send, Bot, MessageCircle, X, Sparkles, CheckCheck, Camera, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatPatient, getChatAppointments, addChatAppointment } from "@/stores/patientChatStore";
import { getPatientPrescriptions, getPatientIndications } from "@/stores/patientMockPrescriptions";
import { getPatientSymptoms, addPatientSymptom } from "@/stores/patientSymptomStore";
import { Appointment } from "@/data/mockData";
import { toast } from "sonner";

interface ChatFileAttachment {
  name: string;
  type: string;
  dataUrl: string;
}

interface Msg {
  id: string;
  text: string;
  sender: "bot" | "user";
  time: string;
  options?: string[];
  attachments?: ChatFileAttachment[];
}

interface PendingSymptom {
  text: string;
  step: "intensity" | "antecedentes" | "notas" | "offer_appointment" | "select_time";
  intensity?: number;
  history?: string;
  notes?: string;
}

const timeSlots = [
  "Lunes 13 Abr — 10:00 AM",
  "Martes 14 Abr — 2:00 PM",
  "Miércoles 15 Abr — 11:30 AM",
  "Jueves 16 Abr — 9:00 AM",
];

function now() {
  return new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

function generatePatientResponse(q: string, patient: ChatPatient): string {
  const lower = q.toLowerCase();
  const appts = getChatAppointments().filter((a) => a.patientId === patient.id);
  const prescriptions = getPatientPrescriptions(patient.id);
  const indications = getPatientIndications(patient.id);
  const symptoms = getPatientSymptoms(patient.id);

  if (lower.includes("duele") || lower.includes("dolor") || lower.includes("molest") || (lower.includes("mal") && (lower.includes("siento") || lower.includes("estoy") || lower.includes("sigue")))) {
    return "__SYMPTOM_FLOW__";
  }

  if (lower.includes("síntoma") || lower.includes("sintoma") || lower.includes("registro") && lower.includes("síntoma") || lower.includes("cómo me") && lower.includes("sentido")) {
    if (symptoms.length === 0) return "No tienes registros de síntomas aún. Usa la sección **\"Seguimiento de síntomas\"** en tu dashboard para registrar cómo te sientes. 📝";
    let res = `📊 **Tus últimos registros de síntomas:**\n\n`;
    symptoms.slice(0, 5).forEach((s) => {
      const d = new Date(s.date);
      res += `• **${d.toLocaleDateString("es-MX", { day: "numeric", month: "short" })}** — ${s.text} (${s.intensity}/10)\n`;
    });
    if (symptoms.length > 5) res += `\n_...y ${symptoms.length - 5} registros más._`;
    return res;
  }

  if (lower.includes("cita") && (lower.includes("cuándo") || lower.includes("cuando") || lower.includes("tengo") || lower.includes("próxima") || lower.includes("proxima") || lower.includes("ver"))) {
    const upcoming = appts.filter((a) => a.status === "programada" || a.status === "confirmada");
    if (upcoming.length === 0) return "No tienes citas programadas por el momento. ¿Te gustaría agendar una?";
    let res = `📅 Tienes **${upcoming.length} cita(s)** programada(s):\n\n`;
    upcoming.forEach((a) => {
      const d = new Date(a.datetime);
      res += `• **${d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}** a las ${d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}\n  _${a.reason}_\n\n`;
    });
    return res;
  }

  if (lower.includes("quiero") && lower.includes("cita")) {
    return "¡Claro! Para agendar una nueva cita necesito saber:\n\n1. **¿Cuál es el motivo de tu consulta?**\n2. **¿Tienes preferencia de horario?**\n\nPor ahora los horarios disponibles son:\n• Lunes a Viernes de 9:00 AM a 5:00 PM\n\nEscribe el motivo y te ayudo a agendar. 📋";
  }

  if (lower.includes("reagendar") || lower.includes("cambiar") && lower.includes("cita") || lower.includes("mover") && lower.includes("cita")) {
    const upcoming = appts.filter((a) => a.status === "programada" || a.status === "confirmada");
    if (upcoming.length === 0) return "No tienes citas pendientes para reagendar.";
    let res = "📅 Estas son tus citas actuales:\n\n";
    upcoming.forEach((a, i) => {
      const d = new Date(a.datetime);
      res += `${i + 1}. **${d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}** — ${a.reason}\n`;
    });
    res += "\nHorarios disponibles para reagendar:\n• Martes 8 Abr — 11:00 AM\n• Miércoles 9 Abr — 2:00 PM\n• Jueves 10 Abr — 10:00 AM\n\n¿Cuál prefieres?";
    return res;
  }

  if (lower.includes("cancelar") && lower.includes("cita")) {
    return "Para cancelar tu cita, por favor comunícate directamente con el consultorio al **(55) 1234-5678** con al menos 24 horas de anticipación.\n\n¿Hay algo más en lo que pueda ayudarte?";
  }

  if (lower.includes("receta") || lower.includes("recetaron") || lower.includes("medicamento") || lower.includes("medicina")) {
    if (prescriptions.length === 0) return "No tienes recetas registradas en el sistema. Consulta con el Dr. Ramírez en tu próxima cita.";
    const last = prescriptions[prescriptions.length - 1];
    let res = `💊 **Tu receta más reciente** (${new Date(last.date).toLocaleDateString("es-MX")}):\n\n`;
    last.medications.forEach((m) => {
      res += `• **${m.name}** ${m.dose} — ${m.frequency} por ${m.duration}\n`;
    });
    if (last.notes) res += `\n📝 _${last.notes}_`;
    if (prescriptions.length > 1) res += `\n\nTienes ${prescriptions.length} recetas en total. Escribe **"todas mis recetas"** para verlas.`;
    return res;
  }

  if (lower.includes("todas") && lower.includes("receta")) {
    if (prescriptions.length === 0) return "No tienes recetas registradas.";
    let res = `💊 **Historial de recetas (${prescriptions.length}):**\n\n`;
    prescriptions.forEach((rx) => {
      res += `📅 **${new Date(rx.date).toLocaleDateString("es-MX")}** — Dr. ${rx.doctorName.replace("Dr. ", "")}\n`;
      rx.medications.forEach((m) => {
        res += `  • ${m.name} ${m.dose} — ${m.frequency}\n`;
      });
      res += "\n";
    });
    return res;
  }

  if (lower.includes("indicacion") || lower.includes("indicaciones") || lower.includes("instrucciones") || lower.includes("cuidado") || lower.includes("rehabilitación") || lower.includes("rehabilitacion") || lower.includes("ejercicio")) {
    if (indications.length === 0) return "No tienes indicaciones registradas. Consulta con el Dr. Ramírez.";
    const last = indications[indications.length - 1];
    let res = `📋 **${last.title}** (${new Date(last.date).toLocaleDateString("es-MX")}):\n\n${last.details}`;
    if (indications.length > 1) res += `\n\nTienes ${indications.length} indicaciones. Escribe **"todas mis indicaciones"** para verlas.`;
    return res;
  }

  if (lower.includes("todas") && lower.includes("indicacion")) {
    if (indications.length === 0) return "No tienes indicaciones registradas.";
    let res = `📋 **Todas tus indicaciones:**\n\n`;
    indications.forEach((ind) => {
      res += `### ${ind.title}\n_${new Date(ind.date).toLocaleDateString("es-MX")}_\n\n${ind.details}\n\n---\n\n`;
    });
    return res;
  }

  if (lower.includes("historial") || lower.includes("resumen") || lower.includes("información") || lower.includes("mi perfil") || lower.includes("mis datos")) {
    return `📋 **Tu información médica:**\n\n👤 **Nombre:** ${patient.name}\n🎂 **Edad:** ${patient.age} años\n🩺 **Motivo de registro:** ${patient.reason}\n📝 **Síntomas reportados:** ${patient.symptoms}\n📂 **Antecedentes:** ${patient.history}\n📅 **Registro:** ${new Date(patient.createdAt).toLocaleDateString("es-MX")}`;
  }

  if (lower.includes("ayuda") || lower.includes("qué puedes") || lower.includes("que puedes") || lower.includes("opciones") || lower.includes("menú") || lower.includes("menu")) {
    return "Puedo ayudarte con:\n\n• 📅 **\"¿Cuándo es mi cita?\"** — Ver tus citas\n• 📅 **\"Quiero una cita\"** — Agendar nueva cita\n• 🔄 **\"Quiero reagendar\"** — Cambiar fecha de cita\n• 💊 **\"¿Qué me recetaron?\"** — Ver tus recetas\n• 📋 **\"Indicaciones\"** — Ver cuidados e instrucciones\n• 📊 **\"Mis síntomas\"** — Ver tus registros de síntomas\n• 👤 **\"Mi historial\"** — Ver tu información médica\n\n¿En qué te puedo ayudar? 😊";
  }

  if (lower.includes("hola") || lower.includes("buenos") || lower.includes("buenas")) {
    return `¡Hola, **${patient.name.split(" ")[0]}**! 👋 ¿En qué te puedo ayudar hoy?\n\nEscribe **"ayuda"** para ver todas las opciones disponibles.`;
  }

  if (lower.includes("gracias") || lower.includes("thank")) {
    return "¡De nada! 😊 Estoy aquí para ayudarte. ¿Necesitas algo más?";
  }

  return `Entendido. ¿Podrías reformular tu pregunta? Puedo ayudarte con citas, recetas, indicaciones médicas y más.\n\nEscribe **"ayuda"** para ver todas las opciones.`;
}

interface PatientChatWidgetProps {
  patient: ChatPatient;
  forceOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function PatientChatWidget({ patient, forceOpen, onOpenChange }: PatientChatWidgetProps) {
  const [open, setOpenState] = useState(false);

  const setOpen = (v: boolean) => {
    setOpenState(v);
    onOpenChange?.(v);
  };

  useEffect(() => {
    if (forceOpen && !open) setOpenState(true);
  }, [forceOpen]);

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "1",
      text: `¡Hola, **${patient.name.split(" ")[0]}**! 👋 Soy tu asistente virtual.\n\n¿En qué puedo ayudarte hoy?`,
      sender: "bot",
      time: now(),
      options: ["¿Cuándo es mi cita?", "¿Qué me recetaron?", "Indicaciones", "Ayuda"],
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pendingSymptom, setPendingSymptom] = useState<PendingSymptom | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function addBot(text: string, options?: string[]) {
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now()), text, sender: "bot", time: now(), options },
      ]);
      setTyping(false);
    }, 600 + Math.random() * 800);
  }

  function processMessage(msg: string) {
    if (pendingSymptom) {
      const ps = pendingSymptom;

      if (ps.step === "intensity") {
        const num = parseInt(msg);
        if (isNaN(num) || num < 1 || num > 10) {
          addBot("Por favor, ingresa un número del **1 al 10** para la intensidad.\n\n• 1-3: Leve\n• 4-6: Moderado\n• 7-10: Intenso");
          return;
        }
        setPendingSymptom({ ...ps, intensity: num, step: "antecedentes" });
        const label = num <= 3 ? "Leve" : num <= 6 ? "Moderado" : "Intenso";
        addBot(`Registrado: **${label} (${num}/10)**.\n\n¿Tienes algún **antecedente médico relevante** relacionado con este malestar?\n\nPor ejemplo: enfermedades crónicas, alergias, cirugías previas.\n\nSi no tienes, escribe **"Ninguno"**.`);
        return;
      }

      if (ps.step === "antecedentes") {
        const historyVal = msg.toLowerCase() === "ninguno" ? "" : msg;
        setPendingSymptom({ ...ps, history: historyVal, step: "notas" });
        addBot("¿Alguna **nota adicional** que quieras agregar?\n\nPor ejemplo: cuándo empezó, si tomaste algún medicamento, etc.\n\nSi no tienes notas, escribe **\"No\"**.");
        return;
      }

      if (ps.step === "notas") {
        const notesVal = msg.toLowerCase() === "no" || msg.toLowerCase() === "ninguno" ? "" : msg;
        const finalPs = { ...ps, notes: notesVal };

        // Save the symptom
        addPatientSymptom(patient.id, finalPs.text, finalPs.intensity!, {
          history: finalPs.history || undefined,
          notes: finalPs.notes || undefined,
        });
        toast.success("Síntoma registrado", { description: "Tu médico podrá verlo en tu expediente." });

        const label = finalPs.intensity! <= 3 ? "Leve" : finalPs.intensity! <= 6 ? "Moderado" : "Intenso";
        let summary = `✅ **Síntoma registrado exitosamente:**\n\n📝 **Síntoma:** ${finalPs.text}\n💢 **Intensidad:** ${finalPs.intensity}/10 — ${label}`;
        if (finalPs.history) summary += `\n📂 **Antecedentes:** ${finalPs.history}`;
        if (finalPs.notes) summary += `\n📋 **Notas:** ${finalPs.notes}`;

        if (finalPs.intensity! >= 7) {
          summary += "\n\n⚠️ La intensidad es alta. Te recomiendo agendar una cita para que el doctor te revise.";
        }

        setPendingSymptom({ ...finalPs, step: "offer_appointment" });
        addBot(summary + "\n\n¿Te gustaría **agendar una cita** con el Dr. Ramírez para tratar estos síntomas?", ["Sí, agendar cita", "No por ahora"]);
        return;
      }

      if (ps.step === "offer_appointment") {
        if (msg.toLowerCase().includes("no")) {
          setPendingSymptom(null);
          addBot("¡Entendido! Tu síntoma ya quedó registrado. Si necesitas algo más, no dudes en escribirme. 😊");
          return;
        }
        setPendingSymptom({ ...ps, step: "select_time" });
        addBot("Perfecto. Estos son los horarios disponibles para tu cita:", timeSlots);
        return;
      }

      if (ps.step === "select_time") {
        addChatAppointment({
          id: `apt-${Date.now()}`,
          patientId: patient.id,
          patientName: patient.name,
          datetime: "2026-04-13T10:00",
          status: "programada",
          reason: `Síntoma reportado: ${ps.text}`,
          notes: `Intensidad: ${ps.intensity}/10. Registrado vía chat.`,
        });
        toast.success("Cita agendada", { description: `Cita programada: ${msg}` });
        addBot(`📅 **¡Cita agendada exitosamente!**\n\n🗓 **Horario:** ${msg}\n🩺 **Motivo:** ${ps.text}\n\nRecibirás un recordatorio antes de tu cita. ¿Necesitas algo más?`);
        setPendingSymptom(null);
        return;
      }
    }

    const response = generatePatientResponse(msg, patient);
    if (response === "__SYMPTOM_FLOW__") {
      setPendingSymptom({ text: msg, step: "intensity" });
      addBot(`Lamento que no te sientas bien. 😔 Voy a registrar tu síntoma automáticamente.\n\nEn una escala del **1 al 10**, ¿qué tan intenso es tu malestar?\n\n• **1-3:** Leve\n• **4-6:** Moderado\n• **7-10:** Intenso`, ["1", "3", "5", "7", "10"]);
      return;
    }
    addBot(response);
  }

  function handleSend() {
    if (!input.trim() || typing) return;
    const msg = input.trim();
    setMessages((prev) => [...prev, { id: String(Date.now()), text: msg, sender: "user", time: now() }]);
    setInput("");
    processMessage(msg);
  }

  function handleOption(opt: string) {
    setMessages((prev) => [...prev, { id: String(Date.now()), text: opt, sender: "user", time: now() }]);
    processMessage(opt);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-elevated flex items-center justify-center hover:scale-105 transition-transform"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-6rem)] flex flex-col rounded-2xl bg-card shadow-elevated overflow-hidden border border-border/40">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Asistente del Paciente</p>
          <p className="text-[10px] opacity-80">Consultas, citas y recetas</p>
        </div>
        <button onClick={() => setOpen(false)} className="hover:bg-primary-foreground/20 rounded-xl p-1.5 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[85%] space-y-1.5">
              <div
                className={`rounded-2xl px-3 py-2 text-sm whitespace-pre-line leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-br-md shadow-md"
                    : "bg-muted/50 text-foreground rounded-bl-md border border-border/30"
                }`}
              >
                {msg.text.split(/(\*\*.*?\*\*)/).map((part, i) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={i}>{part.slice(2, -2)}</strong>
                  ) : part.startsWith("_") && part.endsWith("_") ? (
                    <em key={i} className="text-muted-foreground">{part.slice(1, -1)}</em>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </div>
              {msg.options && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOption(opt)}
                      className="rounded-full border border-primary/30 bg-card px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              <div className={`flex items-center gap-1 ${msg.sender === "user" ? "justify-end" : ""}`}>
                <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                {msg.sender === "user" && <CheckCheck className="h-3 w-3 text-primary" />}
              </div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-muted/50 rounded-2xl rounded-bl-md px-3 py-2.5 border border-border/30">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/30 p-2 bg-card/80">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            className="flex-1 rounded-full text-sm h-9 bg-muted/30 border-border/40"
            disabled={typing}
          />
          <Button type="submit" size="icon" className="rounded-full h-9 w-9 shrink-0 bg-gradient-to-r from-primary to-accent hover:opacity-90" disabled={typing || !input.trim()}>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
