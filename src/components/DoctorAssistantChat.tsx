import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { patients, appointments, clinicalNotes } from "@/data/mockData";
import { getChatPatients, getChatAppointments } from "@/stores/patientChatStore";

interface Msg {
  id: string;
  text: string;
  sender: "bot" | "user";
}

function generateResponse(q: string): string {
  const lower = q.toLowerCase();
  const allAppts = [...appointments, ...getChatAppointments()];
  const allPatients = patients;
  const chatPats = getChatPatients();

  if (lower.includes("cita") && (lower.includes("hoy") || lower.includes("tengo"))) {
    const today = allAppts.filter((a) => a.status === "confirmada" || a.status === "programada");
    if (today.length === 0) return "No tienes citas pendientes por el momento.";
    let res = `📅 Tienes **${today.length} citas** próximas:\n\n`;
    today.slice(0, 5).forEach((a) => {
      const d = new Date(a.datetime);
      res += `• **${a.patientName}** — ${d.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })} a las ${d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}\n  _${a.reason}_\n\n`;
    });
    return res;
  }

  if (lower.includes("pendiente") || lower.includes("pacientes pendientes")) {
    const pending = allAppts.filter((a) => a.status === "programada");
    if (pending.length === 0) return "No hay pacientes pendientes de confirmar.";
    let res = `⏳ Hay **${pending.length} citas pendientes** de confirmar:\n\n`;
    pending.forEach((a) => {
      res += `• **${a.patientName}** — ${a.reason}\n`;
    });
    return res;
  }

  if (lower.includes("resumen") || lower.includes("paciente")) {
    const nameQuery = lower.replace(/resumen|del|de|la|el|paciente|muéstrame|muestrame|dame/gi, "").trim();
    const found = allPatients.find((p) => p.name.toLowerCase().includes(nameQuery));
    if (found) {
      const notes = clinicalNotes.filter((n) => n.patientId === found.id);
      const appts = allAppts.filter((a) => a.patientId === found.id);
      return `📋 **Resumen: ${found.name}**\n\n👤 ${found.age} años, ${found.sex === "F" ? "Femenino" : "Masculino"}\n🩸 Tipo: ${found.bloodType || "No registrado"}\n⚕️ Condiciones: ${found.conditions.join(", ") || "Ninguna"}\n💊 Alergias: ${found.allergies?.join(", ") || "Ninguna"}\n📝 Notas clínicas: ${notes.length}\n📅 Citas registradas: ${appts.length}\n📞 ${found.phone || "Sin teléfono"}`;
    }
    const chatFound = chatPats.find((p) => p.name.toLowerCase().includes(nameQuery));
    if (chatFound) {
      return `📋 **Paciente nuevo (vía chat):** ${chatFound.name}\n\n👤 ${chatFound.age} años\n🩺 Motivo: ${chatFound.reason}\n📝 Síntomas: ${chatFound.symptoms}\n📂 Antecedentes: ${chatFound.history}\n\n_Registrado el ${new Date(chatFound.createdAt).toLocaleDateString("es-MX")}_`;
    }
    return "No encontré un paciente con ese nombre. Intenta con el nombre completo.";
  }

  if (lower.includes("nuevo") && (lower.includes("chat") || lower.includes("registr"))) {
    if (chatPats.length === 0) return "No hay pacientes nuevos registrados desde el chat de pacientes.";
    let res = `🆕 **${chatPats.length} paciente(s) registrados desde el chat:**\n\n`;
    chatPats.forEach((p) => {
      res += `• **${p.name}** — ${p.age} años — ${p.reason}\n`;
    });
    return res;
  }

  if (lower.includes("nota") && (lower.includes("última") || lower.includes("reciente"))) {
    const last = clinicalNotes[0];
    if (!last) return "No hay notas clínicas registradas.";
    return `📝 **Última nota clínica:**\n\n👤 ${last.patientName} — ${new Date(last.date).toLocaleDateString("es-MX")}\n\n${last.aiOutput.slice(0, 300)}...`;
  }

  if (lower.includes("ayuda") || lower.includes("qué puedes")) {
    return "Puedo ayudarte con:\n\n• 📅 **\"¿Qué citas tengo hoy?\"**\n• ⏳ **\"Pacientes pendientes\"**\n• 📋 **\"Resumen de María García\"**\n• 🆕 **\"Pacientes nuevos del chat\"**\n• 📝 **\"Última nota clínica\"**\n\nSolo pregunta lo que necesites.";
  }

  return "Entendido. ¿Podrías reformular tu pregunta? Puedo ayudarte con citas, resúmenes de pacientes o notas clínicas. Escribe **\"ayuda\"** para ver todas las opciones.";
}

export default function DoctorAssistantChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "1", text: "¡Hola, Dr. Ramírez! 👋 Soy tu asistente administrativo. Puedo ayudarte con citas, pacientes y notas.\n\nEscribe **\"ayuda\"** para ver qué puedo hacer.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    if (!input.trim()) return;
    const msg = input.trim();
    setMessages((prev) => [...prev, { id: String(Date.now()), text: msg, sender: "user" }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const response = generateResponse(msg);
      setMessages((prev) => [...prev, { id: String(Date.now() + 1), text: response, sender: "bot" }]);
      setTyping(false);
    }, 600 + Math.random() * 800);
  }

  if (!open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Asistente IA</p>
          <p className="text-[10px] opacity-80">Administración inteligente</p>
        </div>
        <button onClick={onClose} className="hover:bg-primary-foreground/20 rounded-lg p-1 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
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
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-3 py-2.5">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-2">
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta algo..."
            className="flex-1 rounded-full text-sm h-9"
            disabled={typing}
          />
          <Button type="submit" size="icon" className="rounded-full h-9 w-9 shrink-0" disabled={typing || !input.trim()}>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
