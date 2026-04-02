import { useState, useEffect, useRef } from "react";
import { FileText, Plus, Mic, Type, Search, Sparkles, Loader2, Wand2, Download, Copy, CheckCircle2, Pencil, Upload, Paperclip, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { clinicalNotes, patients, type ClinicalNote } from "@/data/mockData";

const noteTemplates: Record<string, string> = {
  asma: `📋 **NOTA MÉDICA — Generada por IA**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**MOTIVO DE CONSULTA:**
Exacerbación de cuadro asmático con aumento de disnea y sibilancias de 3 días de evolución.

**PADECIMIENTO ACTUAL:**
Paciente masculino de 41 años con diagnóstico conocido de asma bronquial de 5 años de evolución. Acude por presentar incremento en la frecuencia de episodios de disnea y sibilancias en los últimos 3 días, asociado a exposición ambiental a polvo durante remodelación en su domicilio. Refiere uso aumentado de salbutamol de rescate (4-5 inhalaciones/día vs 1-2 habituales). Niega fiebre, expectoración purulenta o dolor torácico. Sin antecedentes de hospitalización por asma.

**EXPLORACIÓN FÍSICA:**
• Signos vitales: TA 120/78 mmHg | FC 88 lpm | FR 22 rpm | Temp 36.4°C | SatO₂ 94% (aire ambiente)
• General: Paciente alerta, orientado, con leve dificultad respiratoria
• Tórax: Simétrico, sin uso de músculos accesorios
• Campos pulmonares: Sibilancias espiratorias bilaterales, predominio en bases. Murmullo vesicular presente bilateral
• Cardiovascular: Ruidos cardíacos rítmicos, sin soplos
• Abdomen: Blando, depresible, no doloroso

**DIAGNÓSTICO:**
1. Exacerbación leve-moderada de asma bronquial (J45.1)
2. Probable componente alérgico ambiental

**PLAN DE TRATAMIENTO:**
1. Nebulización con salbutamol 2.5 mg + ipratropio 500 mcg en consultorio — APLICADA
2. Ajuste de esquema de control:
   → Suspender salbutamol como monoterapia de mantenimiento
   → Iniciar budesonida/formoterol 160/4.5 mcg, 1 inhalación cada 12 horas
   → Mantener salbutamol 100 mcg como rescate PRN
3. Medidas ambientales: evitar exposición a polvo, usar cubrebocas durante remodelación
4. Solicitar espirometría con broncodilatador si no mejora en 2 semanas
5. Control en consulta en 7 días
6. Acudir a urgencias si presenta: disnea severa, SatO₂ < 92%, dificultad para hablar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 *Nota generada por MediSec IA — Revisión médica requerida*`,

  diabetes: `📋 **NOTA MÉDICA — Generada por IA**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**MOTIVO DE CONSULTA:**
Control de diabetes mellitus tipo 2 y revisión de estudios de laboratorio.

**PADECIMIENTO ACTUAL:**
Paciente femenina de 56 años con diagnóstico de DM2 de 8 años de evolución. Acude a consulta de seguimiento programada. Refiere adherencia parcial al tratamiento (olvida dosis vespertina de metformina 2-3 veces por semana). Dieta irregular, consumo frecuente de carbohidratos refinados. Niega polidipsia, poliuria o pérdida de peso reciente. Última HbA1c (hace 3 meses): 8.2%.

**EXPLORACIÓN FÍSICA:**
• Signos vitales: TA 138/86 mmHg | FC 76 lpm | FR 16 rpm | Temp 36.6°C | Peso 82 kg | Talla 1.60 m | IMC 32.0
• General: Paciente en buen estado general, consciente, orientada
• Extremidades inferiores: Sin edema, pulsos pedios presentes bilaterales. Sensibilidad conservada con monofilamento
• Fondo de ojo: Pendiente (referir a oftalmología)

**DIAGNÓSTICO:**
1. Diabetes mellitus tipo 2 en descontrol metabólico (E11.65)
2. Obesidad grado I (E66.0)
3. Hipertensión arterial limítrofe

**PLAN DE TRATAMIENTO:**
1. Ajuste farmacológico:
   → Continuar metformina 850 mg c/12h (reforzar adherencia)
   → Agregar empagliflozina 10 mg c/24h en ayuno
2. Plan nutricional: referir a nutrición clínica
3. Actividad física: caminata 30 min/día, 5 días/semana
4. Laboratorios de control: HbA1c, perfil lipídico, función renal, EGO — en 3 meses
5. Referencia a oftalmología para fondo de ojo
6. Control en consulta en 4 semanas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 *Nota generada por MediSec IA — Revisión médica requerida*`,

  default: `📋 **NOTA MÉDICA — Generada por IA**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**MOTIVO DE CONSULTA:**
Evaluación clínica por sintomatología referida en consulta.

**PADECIMIENTO ACTUAL:**
Paciente acude a consulta refiriendo la sintomatología descrita. Se realiza interrogatorio dirigido y exploración física completa para determinar diagnóstico y plan de manejo adecuado.

**EXPLORACIÓN FÍSICA:**
• Signos vitales: Dentro de parámetros normales
• Exploración por aparatos y sistemas: Se documentan hallazgos relevantes durante la consulta
• Sin datos de alarma al momento de la exploración

**DIAGNÓSTICO:**
Se establece diagnóstico clínico basado en hallazgos de la consulta.

**PLAN DE TRATAMIENTO:**
1. Se indica manejo farmacológico apropiado
2. Medidas generales e higiénico-dietéticas
3. Estudios complementarios según hallazgos
4. Control en consulta según evolución
5. Datos de alarma explicados al paciente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 *Nota generada por MediSec IA — Revisión médica requerida*`,
};

function getTemplateKey(text: string): string {
  const lower = text.toLowerCase();
  if (/asma|disnea|sibilanc|bronqu|inhal|nebuliz|salbutamol/.test(lower)) return "asma";
  if (/diabet|glucos|insulin|metformin|azúcar|hemoglobin|hba1c/.test(lower)) return "diabetes";
  return "default";
}

export default function NotasMedicas() {
  const [search, setSearch] = useState("");
  const [newNoteOpen, setNewNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [inputType, setInputType] = useState<"texto" | "voz">("texto");
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStep, setGenStep] = useState("");
  const [generatedNote, setGeneratedNote] = useState<string | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [extraNotes, setExtraNotes] = useState<ClinicalNote[]>([]);
  const progressRef = useRef<ReturnType<typeof setInterval>>();

  const allNotes = [...clinicalNotes, ...extraNotes];
  const filtered = allNotes.filter(
    (n) =>
      n.patientName.toLowerCase().includes(search.toLowerCase()) ||
      n.rawInput.toLowerCase().includes(search.toLowerCase())
  );

  const handleGenerate = () => {
    if (!noteText.trim()) return;
    setGenerating(true);
    setGeneratedNote(null);
    setGenProgress(0);
    setGenStep("Analizando entrada clínica...");

    const steps = [
      { at: 15, text: "Identificando síntomas y signos..." },
      { at: 35, text: "Estructurando información clínica..." },
      { at: 55, text: "Generando diagnóstico diferencial..." },
      { at: 75, text: "Elaborando plan de tratamiento..." },
      { at: 90, text: "Formateando nota médica..." },
    ];

    let progress = 0;
    progressRef.current = setInterval(() => {
      progress += Math.random() * 4 + 1;
      if (progress > 98) progress = 98;
      setGenProgress(Math.min(progress, 98));
      const step = [...steps].reverse().find((s) => progress >= s.at);
      if (step) setGenStep(step.text);
    }, 100);

    setTimeout(() => {
      if (progressRef.current) clearInterval(progressRef.current);
      setGenProgress(100);
      setGenStep("¡Nota generada exitosamente!");
      setTimeout(() => {
        setGeneratedNote(noteTemplates[getTemplateKey(noteText)]);
        setGenerating(false);
      }, 400);
    }, 3200);
  };

  const handleOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
    }, 1500);
  };

  const handleCopy = () => {
    if (generatedNote) {
      navigator.clipboard.writeText(generatedNote.replace(/\*\*/g, "").replace(/━+/g, "—"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    const patientName = selectedPatient || "Fernando Torres Méndez";
    const newNote: ClinicalNote = {
      id: Date.now().toString(),
      patientId: "6",
      patientName,
      date: new Date().toISOString().split("T")[0],
      inputType,
      rawInput: noteText,
      aiOutput: generatedNote || "",
      format: "Estructurado",
      doctorName: "Dr. Alejandro Ramírez",
    };
    setExtraNotes((prev) => [newNote, ...prev]);
    setNewNoteOpen(false);
    setNoteText("");
    setGeneratedNote(null);
    setSelectedPatient("");
    setGenProgress(0);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, []);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Notas Médicas</h1>
          <p className="text-sm text-destructive-foreground">Notas clínicas asistidas por IA — Formato estructurado profesional</p>
        </div>
        <Dialog open={newNoteOpen} onOpenChange={(open) => { setNewNoteOpen(open); if (!open) { setGeneratedNote(null); setNoteText(""); setGenProgress(0); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all">
              <Plus className="h-4 w-4" />
              Nueva nota clínica
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto glass-strong rounded-2xl border-border/40">
            <DialogHeader>
              <DialogTitle className="font-display flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generar Nota Médica con IA
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Paciente</label>
                  <select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-xl border border-border/40 bg-muted/30 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Seleccionar paciente...</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo de entrada</label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant={inputType === "texto" ? "default" : "outline"}
                      size="sm"
                      className="gap-1.5 flex-1"
                      onClick={() => setInputType("texto")}
                    >
                      <Type className="h-3.5 w-3.5" /> Texto
                    </Button>
                    <Button
                      variant={inputType === "voz" ? "default" : "outline"}
                      size="sm"
                      className="gap-1.5 flex-1"
                      onClick={() => setInputType("voz")}
                    >
                      <Mic className="h-3.5 w-3.5" /> Dictado por voz
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  {inputType === "voz" ? "Transcripción del dictado médico" : "Notas de la consulta"}
                </label>
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={inputType === "voz"
                    ? "Ejemplo: Paciente masculino 41 años con asma bronquial, acude por aumento de disnea y sibilancias de 3 días, asociado a exposición a polvo. Salbutamol de rescate 4-5 veces al día. Signos vitales: TA 120/78, FC 88, sat 94 por ciento..."
                    : "Describe los hallazgos de la consulta: motivo, síntomas, exploración, impresión diagnóstica..."
                  }
                  className="mt-1 min-h-[120px] bg-muted/30 border-border/40 rounded-xl"
                />
              </div>

              {/* Generate button */}
              <Button onClick={handleGenerate} className="w-full gap-2 h-11 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90" disabled={generating || !noteText.trim()}>
                {generating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> {genStep}</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Generar nota con IA</>
                )}
              </Button>

              {/* Progress bar */}
              {generating && (
                <div className="space-y-2 animate-fade-in">
                  <Progress value={genProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">{genStep}</p>
                </div>
              )}

              {/* Generated note */}
              {generatedNote && (
                <div className="rounded-2xl glass border-primary/20 p-5 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <p className="text-sm font-semibold text-primary">Nota generada por IA</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">Formato Estructurado</Badge>
                  </div>

                  <div
                    className="text-sm whitespace-pre-line leading-relaxed bg-muted/30 rounded-xl p-4 border border-border/30 max-h-[400px] overflow-y-auto"
                    dangerouslySetInnerHTML={{
                      __html: generatedNote
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em class="text-muted-foreground text-xs">$1</em>')
                        .replace(/━+/g, '<hr class="border-border my-2"/>')
                        .replace(/→/g, '<span class="text-primary">→</span>')
                    }}
                  />

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleSave} className="gap-2 flex-1">
                      <FileText className="h-4 w-4" /> Guardar nota
                    </Button>
                    <Button onClick={handleOptimize} variant="outline" className="gap-2" disabled={optimizing}>
                      {optimizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                      Optimizar nota
                    </Button>
                    <Button onClick={handleCopy} variant="outline" className="gap-2">
                      {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copiado" : "Copiar"}
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" /> Exportar PDF
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por paciente o contenido..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-muted/30 border-border/40 rounded-xl focus:border-primary/50"
        />
      </div>

      {/* Notes list */}
      <div className="space-y-4">
        {filtered.map((note) => (
          <Card key={note.id} className="glass border-border/40 hover:border-primary/20 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-base">{note.patientName}</CardTitle>
                <span className="text-xs text-muted-foreground">
                  {new Date(note.date).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-[10px]">{note.format}</Badge>
                <Badge variant="outline" className="text-[10px] gap-1">
                  {note.inputType === "voz" ? <Mic className="h-2.5 w-2.5" /> : <Type className="h-2.5 w-2.5" />}
                  {note.inputType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-muted/20 p-4 border border-border/20">
                <p className="text-xs text-muted-foreground mb-2 font-medium">📋 Nota generada por IA:</p>
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
              <div className="mt-3 pt-3 border-t border-border flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Entrada original:</p>
                  <p className="text-sm text-muted-foreground italic">{note.rawInput}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs h-7">
                    <Copy className="h-3 w-3" /> Copiar
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs h-7">
                    <Download className="h-3 w-3" /> PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
