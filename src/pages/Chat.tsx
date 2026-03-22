import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  role: "patient" | "ai";
  content: string;
  time: string;
  options?: { label: string; action: string }[];
}

const initialMessages: Message[] = [
  { id: "1", role: "patient", content: "Hola, buenas tardes", time: "14:30" },
  { id: "2", role: "ai", content: "¡Hola! 👋 Soy el asistente virtual del Dr. Alejandro Ramírez. ¿En qué puedo ayudarte hoy?", time: "14:30" },
];

const conversationFlows: Record<string, { reply: string; options?: { label: string; action: string }[] }> = {
  default: {
    reply: "Entendido. ¿Hay algo más en lo que pueda ayudarte? Puedo agendar una cita, darte información sobre horarios o responder preguntas frecuentes.",
  },
  agendar: {
    reply: "¡Por supuesto! 📅 Estos son los horarios disponibles del Dr. Ramírez para esta semana:",
    options: [
      { label: "Lunes 24 Mar — 9:00 AM", action: "confirm_lunes" },
      { label: "Martes 25 Mar — 11:30 AM", action: "confirm_martes" },
      { label: "Miércoles 26 Mar — 3:00 PM", action: "confirm_miercoles" },
    ],
  },
  confirm: {
    reply: "✅ ¡Listo! Tu cita ha sido agendada exitosamente.\n\n📋 **Detalles de la cita:**\n- **Doctor:** Dr. Alejandro Ramírez\n- **Especialidad:** Medicina General\n- **Consultorio:** Consultorio 204, Torre Médica Sur\n\nTe enviaremos un recordatorio 24 horas antes. ¿Necesitas algo más?",
  },
  cancelar: {
    reply: "Entendido. ¿Podrías indicarme la fecha de la cita que deseas cancelar? También puedo reagendarla si lo prefieres.",
  },
  horarios: {
    reply: "🕐 El horario de consulta del Dr. Ramírez es:\n\n- **Lunes a Viernes:** 9:00 AM — 5:00 PM\n- **Sábado:** 9:00 AM — 1:00 PM\n- **Domingo:** Cerrado\n\n¿Te gustaría agendar una cita?",
  },
};

function getReplyKey(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("agendar") || lower.includes("cita") || lower.includes("consulta") || lower.includes("quiero"))
    return "agendar";
  if (lower.includes("cancelar")) return "cancelar";
  if (lower.includes("horario")) return "horarios";
  return "default";
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [appointmentCreated, setAppointmentCreated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const addAIReply = (key: string, extraContent?: string) => {
    setTyping(true);
    const flow = conversationFlows[key] || conversationFlows.default;
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "ai",
          content: extraContent ? `${extraContent}\n\n${flow.reply}` : flow.reply,
          time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
          options: flow.options,
        },
      ]);
      setTyping(false);
      if (key === "confirm") setAppointmentCreated(true);
    }, 1200);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "patient", content: text, time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setInput("");
    addAIReply(getReplyKey(text));
  };

  const handleOption = (option: { label: string; action: string }) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "patient", content: option.label, time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) },
    ]);
    addAIReply("confirm", `Has seleccionado: **${option.label}**`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-card p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20">
          <Bot className="h-5 w-5 text-success" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Asistente IA — WhatsApp</p>
          <p className="text-xs text-muted-foreground">Simulación de chat con paciente</p>
        </div>
        {appointmentCreated && (
          <Badge className="gap-1 bg-success text-success-foreground">
            <CheckCircle2 className="h-3 w-3" /> Cita creada
          </Badge>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "patient" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
              msg.role === "patient"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-card border border-border rounded-bl-md"
            }`}>
              <div className="flex items-center gap-1.5 mb-1">
                {msg.role === "ai" ? <Bot className="h-3 w-3 text-primary" /> : <User className="h-3 w-3" />}
                <span className="text-[10px] opacity-70">{msg.time}</span>
              </div>
              <p className="text-sm whitespace-pre-line leading-relaxed"
                 dangerouslySetInnerHTML={{
                   __html: msg.content
                     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                     .replace(/\n/g, '<br/>')
                 }}
              />
              {msg.options && (
                <div className="mt-3 space-y-2">
                  {msg.options.map((opt) => (
                    <button
                      key={opt.action}
                      onClick={() => handleOption(opt)}
                      className="flex items-center gap-2 w-full rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-left text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Prompt hint */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 bg-muted/50 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            💡 Prueba escribir: <strong>"Quiero agendar una cita"</strong>, <strong>"¿Cuál es el horario?"</strong>, o <strong>"Cancelar mi cita"</strong>
          </p>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border bg-card p-3">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje como paciente..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || typing}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
