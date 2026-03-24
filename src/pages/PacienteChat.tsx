import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, CheckCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { addChatPatient, addChatAppointment, ChatPatient } from "@/stores/patientChatStore";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  time: string;
  options?: string[];
}

type Step = "welcome" | "nombre" | "edad" | "sexo" | "motivo" | "sintomas" | "historial" | "confirm_appointment" | "select_time" | "summary" | "done";

const timeSlots = [
  "Lunes 24 Mar — 11:00 AM",
  "Martes 25 Mar — 3:00 PM",
  "Miércoles 26 Mar — 9:30 AM",
  "Jueves 27 Mar — 1:00 PM",
];

function now() {
  return new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

export default function PacienteChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! 👋 Soy el asistente virtual del **Dr. Alejandro Ramírez**.\n\nEstoy aquí para ayudarte a agendar tu cita y recopilar tu información médica básica para que tu consulta sea más eficiente.\n\n¿Cómo te llamas?",
      sender: "bot",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<Step>("nombre");
  const [typing, setTyping] = useState(false);
  const [patientData, setPatientData] = useState<Partial<ChatPatient>>({});
  const [selectedTime, setSelectedTime] = useState("");
  const [completed, setCompleted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function addBot(text: string, options?: string[]) {
    setTyping(true);
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now()), text, sender: "bot", time: now(), options },
      ]);
      setTyping(false);
    }, delay);
  }

  function addUser(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), text, sender: "user", time: now() },
    ]);
  }

  function handleSend() {
    if (!input.trim()) return;
    const msg = input.trim();
    addUser(msg);
    setInput("");
    processStep(msg);
  }

  function handleOption(option: string) {
    addUser(option);
    processStep(option);
  }

  function processStep(msg: string) {
    switch (step) {
      case "nombre":
        setPatientData((d) => ({ ...d, name: msg }));
        setStep("edad");
        addBot(`Mucho gusto, **${msg}** 😊\n\n¿Cuántos años tienes?`);
        break;
      case "edad": {
        const age = parseInt(msg);
        if (isNaN(age) || age < 0 || age > 120) {
          addBot("Por favor, ingresa una edad válida (número).");
          return;
        }
        setPatientData((d) => ({ ...d, age }));
        setStep("sexo");
        addBot("¿Cuál es tu sexo biológico?", ["Masculino", "Femenino"]);
        break;
      }
      case "sexo": {
        const sex = msg.toLowerCase().startsWith("m") ? "M" as const : "F" as const;
        setPatientData((d) => ({ ...d, sex }));
        setStep("motivo");
        addBot("Gracias. ¿Cuál es el **motivo principal** de tu consulta?\n\nPor ejemplo: dolor de cabeza, revisión general, control de diabetes, etc.");
        break;
      }
      case "motivo":
        setPatientData((d) => ({ ...d, reason: msg }));
        setStep("sintomas");
        addBot(`Entendido: **${msg}**.\n\n¿Podrías describir tus **síntomas principales**?\n\nIncluye desde cuándo los tienes y qué tan intensos son.`);
        break;
      case "sintomas":
        setPatientData((d) => ({ ...d, symptoms: msg }));
        setStep("historial");
        addBot("¿Tienes algún **antecedente médico relevante**?\n\nPor ejemplo: enfermedades crónicas, alergias, cirugías previas, medicamentos actuales.\n\nSi no tienes ninguno, escribe \"Ninguno\".");
        break;
      case "historial":
        setPatientData((d) => ({ ...d, history: msg }));
        setStep("confirm_appointment");
        addBot("Excelente, ya tengo toda tu información. 📋\n\n¿Te gustaría **agendar una cita** con el Dr. Ramírez?", ["Sí, agendar cita", "No por ahora"]);
        break;
      case "confirm_appointment":
        if (msg.toLowerCase().includes("no")) {
          setStep("summary");
          finalize(patientData, "");
        } else {
          setStep("select_time");
          addBot("Perfecto. Estos son los horarios disponibles:", timeSlots);
        }
        break;
      case "select_time":
        setSelectedTime(msg);
        setStep("summary");
        finalize(patientData, msg);
        break;
      default:
        addBot("Gracias por usar nuestro servicio. ¡Nos vemos pronto! 👋");
    }
  }

  function finalize(data: Partial<ChatPatient>, time: string) {
    const id = `chat-${Date.now()}`;
    const summary = `Paciente ${data.sex === "F" ? "femenina" : "masculino"} de ${data.age} años.\n\n**Motivo de consulta:** ${data.reason}\n**Síntomas:** ${data.symptoms}\n**Antecedentes:** ${data.history}`;

    const patient: ChatPatient = {
      id,
      name: data.name || "Sin nombre",
      age: data.age || 0,
      sex: data.sex || "M",
      phone: "",
      reason: data.reason || "",
      symptoms: data.symptoms || "",
      history: data.history || "",
      summary,
      createdAt: new Date().toISOString(),
    };

    addChatPatient(patient);

    if (time) {
      addChatAppointment({
        id: `apt-${Date.now()}`,
        patientId: id,
        patientName: patient.name,
        datetime: "2026-03-24T11:00",
        status: "programada",
        reason: patient.reason,
        notes: `Registrado vía chat. Síntomas: ${patient.symptoms}`,
      });
    }

    setTyping(true);
    setTimeout(() => {
      const summaryMsg = `✅ **¡Listo!** He registrado toda tu información.\n\n📋 **Resumen de tu registro:**\n\n👤 **Nombre:** ${patient.name}\n🎂 **Edad:** ${patient.age} años\n🩺 **Motivo:** ${patient.reason}\n📝 **Síntomas:** ${patient.symptoms}\n📂 **Antecedentes:** ${patient.history}${time ? `\n\n📅 **Cita agendada:** ${time}` : ""}\n\nEl Dr. Ramírez revisará tu información antes de la consulta. ${time ? "Recibirás un recordatorio antes de tu cita." : ""}\n\n¡Gracias por confiar en nosotros! 💙`;

      setMessages((prev) => [
        ...prev,
        { id: String(Date.now()), text: summaryMsg, sender: "bot", time: now() },
      ]);
      setTyping(false);
      setCompleted(true);
    }, 2000);
  }

  return (
    <div className="flex flex-col h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3 shadow-md">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-sm">Dr. Alejandro Ramírez</h1>
          <p className="text-xs opacity-80">Asistente virtual • En línea</p>
        </div>
        <Badge variant="secondary" className="text-[10px]">Demo</Badge>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] space-y-2`}>
              <div
                className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card text-card-foreground rounded-bl-md shadow-sm border border-border"
                }`}
              >
                {msg.text.split(/(\*\*.*?\*\*)/).map((part, i) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={i}>{part.slice(2, -2)}</strong>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </div>
              {msg.options && (
                <div className="flex flex-wrap gap-2">
                  {msg.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOption(opt)}
                      className="rounded-full border border-primary bg-card px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
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
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5 text-primary animate-pulse" />
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!completed ? (
        <div className="border-t border-border bg-card p-3">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="flex-1 rounded-full"
              disabled={typing}
            />
            <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={typing || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : (
        <div className="border-t border-border bg-card p-4 text-center space-y-3">
          <p className="text-sm text-muted-foreground">Tu registro ha sido completado exitosamente</p>
          <Link to="/dashboard">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-2 px-4">
              👨‍⚕️ Ver panel del médico (demo)
            </Badge>
          </Link>
        </div>
      )}
    </div>
  );
}
