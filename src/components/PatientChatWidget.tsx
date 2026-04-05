import { useState, useRef, useEffect } from "react";
import { Send, Bot, MessageCircle, X, Sparkles, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatPatient, getChatAppointments } from "@/stores/patientChatStore";
import { getPatientPrescriptions, getPatientIndications } from "@/stores/patientMockPrescriptions";
import { Appointment } from "@/data/mockData";

interface Msg {
  id: string;
  text: string;
  sender: "bot" | "user";
  time: string;
  options?: string[];
}

function now() {
  return new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

function generatePatientResponse(q: string, patient: ChatPatient): string {
  const lower = q.toLowerCase();
  const appts = getChatAppointments().filter((a) => a.patientId === patient.id);
  const prescriptions = getPatientPrescriptions(patient.id);
  const indications = getPatientIndications(patient.id);

  // --- Appointments ---
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

  // --- Prescriptions ---
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

  // --- Indications ---
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

  // --- History / Summary ---
  if (lower.includes("historial") || lower.includes("resumen") || lower.includes("información") || lower.includes("mi perfil") || lower.includes("mis datos")) {
    return `📋 **Tu información médica:**\n\n👤 **Nombre:** ${patient.name}\n🎂 **Edad:** ${patient.age} años\n🩺 **Motivo de registro:** ${patient.reason}\n📝 **Síntomas reportados:** ${patient.symptoms}\n📂 **Antecedentes:** ${patient.history}\n📅 **Registro:** ${new Date(patient.createdAt).toLocaleDateString("es-MX")}`;
  }

  // --- Help ---
  if (lower.includes("ayuda") || lower.includes("qué puedes") || lower.includes("que puedes") || lower.includes("opciones") || lower.includes("menú") || lower.includes("menu")) {
    return "Puedo ayudarte con:\n\n• 📅 **\"¿Cuándo es mi cita?\"** — Ver tus citas\n• 📅 **\"Quiero una cita\"** — Agendar nueva cita\n• 🔄 **\"Quiero reagendar\"** — Cambiar fecha de cita\n• 💊 **\"¿Qué me recetaron?\"** — Ver tus recetas\n• 📋 **\"Indicaciones\"** — Ver cuidados e instrucciones\n• 👤 **\"Mi historial\"** — Ver tu información médica\n\n¿En qué te puedo ayudar? 😊";
  }

  // --- Greetings ---
  if (lower.includes("hola") || lower.includes("buenos") || lower.includes("buenas")) {
    return `¡Hola, **${patient.name.split(" ")[0]}**! 👋 ¿En qué te puedo ayudar hoy?\n\nEscribe **"ayuda"** para ver todas las opciones disponibles.`;
  }

  if (lower.includes("gracias") || lower.includes("thank")) {
    return "¡De nada! 😊 Estoy aquí para ayudarte. ¿Necesitas algo más?";
  }

  return `Entendido. ¿Podrías reformular tu pregunta? Puedo ayudarte con citas, recetas, indicaciones médicas y más.\n\nEscribe **"ayuda"** para ver todas las opciones.`;
}

export default function PatientChatWidget({ patient }: { patient: ChatPatient }) {
  const [open, setOpen] = useState(false);
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

  function handleSend() {
    if (!input.trim() || typing) return;
    const msg = input.trim();
    setMessages((prev) => [...prev, { id: String(Date.now()), text: msg, sender: "user", time: now() }]);
    setInput("");
    const response = generatePatientResponse(msg, patient);
    addBot(response);
  }

  function handleOption(opt: string) {
    setMessages((prev) => [...prev, { id: String(Date.now()), text: opt, sender: "user", time: now() }]);
    const response = generatePatientResponse(opt, patient);
    addBot(response);
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
