import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Calendar, CheckCircle2, Phone, Video, MoreVertical, ImageIcon, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "patient" | "ai";
  content: string;
  time: string;
  options?: { label: string; action: string }[];
  status?: "sent" | "delivered" | "read";
}

const now = () => new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

const initialMessages: Message[] = [
  { id: "1", role: "patient", content: "Hola, buenas tardes", time: "14:30", status: "read" },
  {
    id: "2",
    role: "ai",
    content: "¡Hola! 👋 Soy el asistente virtual del consultorio del **Dr. Alejandro Ramírez**, especialista en Medicina General.\n\nEstoy aquí para ayudarte con:\n• 📅 Agendar o modificar citas\n• 🕐 Consultar horarios disponibles\n• ❓ Responder preguntas frecuentes\n• 📋 Información sobre preparación para consultas\n\n¿En qué puedo ayudarte hoy?",
    time: "14:30",
  },
];

interface ConversationFlow {
  reply: string;
  options?: { label: string; action: string }[];
  delay?: number;
  followUp?: { reply: string; delay: number };
}

const conversationFlows: Record<string, ConversationFlow> = {
  default: {
    reply: "Entendido. Déjame revisar cómo puedo ayudarte mejor. 🤔\n\n¿Podrías indicarme si necesitas alguno de estos servicios?\n• Agendar una cita médica\n• Consultar horarios disponibles\n• Información sobre el consultorio\n• Hablar con alguien del equipo médico",
    delay: 1800,
  },
  greeting: {
    reply: "¡Hola! 😊 Qué gusto saludarte. Soy el asistente virtual del **Dr. Alejandro Ramírez**.\n\n¿En qué puedo ayudarte el día de hoy? Si necesitas agendar una cita, solo dímelo.",
    delay: 1200,
  },
  agendar: {
    reply: "¡Con mucho gusto te ayudo a agendar tu cita! 📅\n\nDéjame verificar la disponibilidad del Dr. Ramírez...",
    delay: 1500,
    followUp: {
      reply: "✅ Encontré los siguientes horarios disponibles para esta semana:\n\n🗓️ Selecciona el que mejor te convenga:",
      delay: 2000,
    },
  },
  agendar_options: {
    reply: "",
    options: [
      { label: "📅 Lunes 24 Mar — 9:00 AM", action: "confirm_lunes_9" },
      { label: "📅 Lunes 24 Mar — 11:30 AM", action: "confirm_lunes_11" },
      { label: "📅 Martes 25 Mar — 10:00 AM", action: "confirm_martes" },
      { label: "📅 Miércoles 26 Mar — 3:00 PM", action: "confirm_miercoles" },
    ],
  },
  confirm: {
    reply: "✅ **¡Tu cita ha sido confirmada exitosamente!**\n\n📋 **Detalles de tu cita:**\n━━━━━━━━━━━━━━━━━━\n👨‍⚕️ **Médico:** Dr. Alejandro Ramírez\n🏥 **Especialidad:** Medicina General\n📍 **Ubicación:** Consultorio 204, Torre Médica Sur\n🅿️ **Estacionamiento:** Nivel B1, validamos tu ticket\n━━━━━━━━━━━━━━━━━━\n\n📌 **Recomendaciones para tu cita:**\n• Llega 15 minutos antes para registro\n• Trae identificación oficial\n• Si tomas medicamentos, trae la lista\n\n⏰ Te enviaré un recordatorio 24 horas antes de tu cita.\n\n¿Hay algo más en lo que pueda ayudarte?",
    delay: 2200,
  },
  cancelar: {
    reply: "Entendido, lamento que necesites cancelar. 😔\n\nPara proceder necesito confirmar algunos datos:\n\n¿Podrías indicarme la **fecha de tu cita** o el **nombre del paciente** registrado?\n\nTambién puedo **reagendarla** para otra fecha si lo prefieres. ¿Qué te gustaría hacer?",
    delay: 1600,
    followUp: {
      reply: "💡 *Tip: Puedes cancelar o reagendar hasta 4 horas antes de tu cita sin costo adicional.*",
      delay: 1200,
    },
  },
  horarios: {
    reply: "🕐 **Horario de atención del Dr. Ramírez:**\n\n📅 **Lunes a Viernes**\n   Mañana: 9:00 AM — 1:00 PM\n   Tarde: 3:00 PM — 7:00 PM\n\n📅 **Sábado**\n   9:00 AM — 2:00 PM\n\n📅 **Domingo**\n   ❌ Cerrado\n\n⚕️ *Consultas de urgencia disponibles fuera de horario regular llamando al (55) 1234-5678*\n\n¿Te gustaría agendar una cita en alguno de estos horarios?",
    delay: 1800,
  },
  ubicacion: {
    reply: "📍 **Ubicación del consultorio:**\n\n🏥 **Torre Médica Sur**\nConsultorio 204, Piso 2\nAv. Insurgentes Sur 1234\nCol. Del Valle, CDMX\n\n🅿️ Estacionamiento disponible en Nivel B1\n🚇 Metro más cercano: Insurgentes (Línea 1)\n\n📱 Teléfono: (55) 1234-5678\n\n¿Necesitas algo más?",
    delay: 1400,
  },
  precio: {
    reply: "💰 **Información sobre consultas:**\n\n• **Consulta general:** $800 MXN\n• **Consulta de seguimiento:** $600 MXN\n• **Primera vez:** $900 MXN (incluye historia clínica completa)\n\n💳 Aceptamos: Efectivo, tarjeta de débito/crédito, transferencia\n🏥 Seguros: Metlife, GNP, AXA, Mapfre\n\n¿Te gustaría agendar una cita?",
    delay: 1600,
  },
  gracias: {
    reply: "¡De nada! 😊 Fue un placer ayudarte.\n\nRecuerda que puedes escribirme cuando necesites:\n• Agendar o modificar citas\n• Consultar información\n• Resolver cualquier duda\n\n¡Que tengas un excelente día! 🌟",
    delay: 1200,
  },
  sintomas: {
    reply: "Entiendo tu preocupación. 🩺\n\n⚠️ **Nota importante:** No puedo realizar diagnósticos médicos. Para una evaluación adecuada, te recomiendo agendar una cita con el Dr. Ramírez.\n\nSin embargo, si presentas alguno de estos síntomas de urgencia, acude de inmediato a urgencias:\n🔴 Dificultad para respirar severa\n🔴 Dolor torácico intenso\n🔴 Fiebre mayor a 39.5°C persistente\n🔴 Sangrado abundante\n\n¿Te gustaría que agende una cita para que el doctor te valore?",
    delay: 2000,
  },
};

function getReplyKey(text: string): string {
  const lower = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (/^(hola|buenas|buenos|hey|que tal|buen dia)/.test(lower)) return "greeting";
  if (/agend|cita|consulta|reserv|quiero.*ver|necesito.*doctor/.test(lower)) return "agendar";
  if (/cancel|no.*poder|no.*voy/.test(lower)) return "cancelar";
  if (/horario|hora|atiend|abiert/.test(lower)) return "horarios";
  if (/donde|ubicac|direcc|llegar|estacion/.test(lower)) return "ubicacion";
  if (/precio|cost|cuanto.*cuest|tarifa|cobr|seguro/.test(lower)) return "precio";
  if (/gracia|thanks|perfecto|excelente|genial/.test(lower)) return "gracias";
  if (/dolor|fiebre|sintoma|enferm|mal|molest|tos|cabeza/.test(lower)) return "sintomas";
  return "default";
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [typingText, setTypingText] = useState("escribiendo");
  const [appointmentCreated, setAppointmentCreated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingInterval = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (typing) {
      let dots = 1;
      typingInterval.current = setInterval(() => {
        dots = (dots % 3) + 1;
        setTypingText("escribiendo" + ".".repeat(dots));
      }, 500);
    } else {
      setTypingText("escribiendo");
      if (typingInterval.current) clearInterval(typingInterval.current);
    }
    return () => { if (typingInterval.current) clearInterval(typingInterval.current); };
  }, [typing]);

  const addMessage = useCallback((role: "patient" | "ai", content: string, options?: { label: string; action: string }[]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random(),
        role,
        content,
        time: now(),
        options,
        status: role === "patient" ? "delivered" : undefined,
      },
    ]);
    // Mark patient messages as "read" after AI responds
    if (role === "ai") {
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => m.role === "patient" && m.status === "delivered" ? { ...m, status: "read" } : m)
        );
      }, 300);
    }
  }, []);

  const addAIReply = useCallback((key: string, extraContent?: string) => {
    setTyping(true);
    const flow = conversationFlows[key] || conversationFlows.default;
    const delay = flow.delay || 1500;

    setTimeout(() => {
      const mainContent = extraContent ? `${extraContent}\n\n${flow.reply}` : flow.reply;
      if (mainContent) {
        addMessage("ai", mainContent);
      }

      if (flow.followUp) {
        setTimeout(() => {
          addMessage("ai", flow.followUp!.reply);
          // For agendar, show options after followUp
          if (key === "agendar") {
            setTimeout(() => {
              const optFlow = conversationFlows.agendar_options;
              addMessage("ai", "", optFlow.options);
              setTyping(false);
            }, 800);
          } else {
            setTyping(false);
          }
        }, flow.followUp.delay);
      } else if (flow.options) {
        addMessage("ai", "", flow.options);
        setTyping(false);
      } else {
        setTyping(false);
      }

      if (key === "confirm") setAppointmentCreated(true);
    }, delay);
  }, [addMessage]);

  const handleSend = () => {
    if (!input.trim() || typing) return;
    const text = input.trim();
    addMessage("patient", text);
    setInput("");
    // Small delay before "typing" starts (like real WhatsApp)
    setTimeout(() => {
      addAIReply(getReplyKey(text));
    }, 600);
  };

  const handleOption = (option: { label: string; action: string }) => {
    if (typing) return;
    addMessage("patient", option.label);
    setTimeout(() => {
      addAIReply("confirm", `Has seleccionado: **${option.label}**`);
    }, 600);
  };

  const renderContent = (content: string) => {
    if (!content) return null;
    return (
      <p
        className="text-sm whitespace-pre-line leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="opacity-70">$1</em>')
            .replace(/━+/g, '<hr class="border-border/50 my-1"/>')
            .replace(/\n/g, '<br/>')
        }}
      />
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen max-w-3xl mx-auto">
      {/* WhatsApp-style Header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-accent px-4 py-3 text-primary-foreground">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
            <Bot className="h-5 w-5" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">Consultorio Dr. Ramírez</p>
          <p className="text-[11px] opacity-80">
            {typing ? typingText : "en línea"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {appointmentCreated && (
            <Badge className="gap-1 bg-green-500/20 text-green-100 border-green-400/30 mr-2 text-[10px]">
              <CheckCircle2 className="h-3 w-3" /> Cita agendada
            </Badge>
          )}
          <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages area with WhatsApp wallpaper feel */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-1"
        style={{
          backgroundColor: "hsl(222 47% 9% / 0.5)",
        }}
      >
        }}
      >
        {/* Date separator */}
        <div className="flex justify-center py-2">
          <span className="glass text-[11px] text-muted-foreground px-3 py-1 rounded-xl shadow-sm">
            Hoy
          </span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "patient" ? "justify-end" : "justify-start"} mb-1`}>
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 py-2 shadow-sm relative ${
                msg.role === "patient"
                  ? "bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/20 rounded-tr-none"
                  : "glass-strong rounded-tl-none"
              }`}
            >
              {(msg.content) && renderContent(msg.content)}
              {msg.options && (
                <div className="mt-2 space-y-1.5">
                  {msg.options.map((opt) => (
                    <button
                      key={opt.action}
                      onClick={() => handleOption(opt)}
                      disabled={typing || appointmentCreated}
                      className="flex items-center gap-2 w-full rounded-xl glass border-primary/30 px-3 py-2.5 text-left text-sm font-medium text-primary hover:bg-primary/10 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
              <div className={`flex items-center gap-1 mt-1 ${msg.role === "patient" ? "justify-end" : "justify-start"}`}>
                <span className="text-[10px] text-muted-foreground/70">{msg.time}</span>
                {msg.role === "patient" && msg.status && (
                  <span className={`text-[10px] ${msg.status === "read" ? "text-blue-500" : "text-muted-foreground/50"}`}>
                    {msg.status === "read" ? "✓✓" : msg.status === "delivered" ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start mb-1">
            <div className="glass-strong rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms", animationDuration: "0.6s" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms", animationDuration: "0.6s" }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms", animationDuration: "0.6s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Prompt hint */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 glass border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center">
            💡 Prueba escribir: <strong>"Quiero agendar una cita"</strong>, <strong>"¿Cuánto cuesta la consulta?"</strong>, <strong>"Me duele la cabeza"</strong>, o <strong>"¿Dónde queda el consultorio?"</strong>
          </p>
        </div>
      )}

      {/* WhatsApp-style input */}
      <div className="border-t border-border/30 glass p-2">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="shrink-0 h-9 w-9 text-muted-foreground">
            <Smile className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="pr-20 bg-muted/50 border-muted"
              disabled={typing}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button type="button" className="text-muted-foreground/60 hover:text-muted-foreground p-1">
                <Paperclip className="h-4 w-4" />
              </button>
              <button type="button" className="text-muted-foreground/60 hover:text-muted-foreground p-1">
                <ImageIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <Button type="submit" size="icon" className="shrink-0 h-9 w-9 rounded-full" disabled={!input.trim() || typing}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
