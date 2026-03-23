import { useState } from "react";
import { ArrowRightLeft, Plus, FileDown, Sparkles, Loader2, Copy, CheckCircle2, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { referrals, patients, type Referral } from "@/data/mockData";

const referralTemplates: Record<string, string> = {
  neumologia: `**REFERENCIA MÉDICA**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**De:** Dr. Alejandro Ramírez — Medicina General
**Para:** Servicio de Neumología
**Fecha:** ${new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}

**DATOS DEL PACIENTE:**
Nombre: Fernando Torres Méndez
Edad: 41 años | Sexo: Masculino
Expediente: MDS-2024-0892

**MOTIVO DE REFERENCIA:**
Valoración por neumología para escalamiento terapéutico en paciente con asma bronquial de difícil control.

**RESUMEN CLÍNICO:**
Paciente masculino de 41 años con diagnóstico de asma bronquial de 5 años de evolución, actualmente con exacerbaciones frecuentes (2-3 episodios por mes) a pesar de tratamiento optimizado con budesonida/formoterol 160/4.5 mcg cada 12 horas y salbutamol de rescate.

**Antecedentes relevantes:**
• Asma bronquial diagnosticada en 2019
• Sin hospitalizaciones previas por asma
• Alergia ambiental no tipificada
• No tabaquismo activo
• Sin comorbilidades cardiovasculares

**Estudios previos:**
• Espirometría (agosto 2024): Patrón obstructivo leve — FEV1 72% del predicho, relación FEV1/FVC 0.68
• BH, QS: Sin alteraciones significativas
• Rx tórax (enero 2025): Sin infiltrados, hiperinsuflación leve

**Tratamiento actual:**
1. Budesonida/formoterol 160/4.5 mcg — 1 inh c/12h
2. Salbutamol 100 mcg — PRN (uso actual: 4-5 veces/día)
3. Montelukast 10 mg — c/24h (nocturno)

**SOLICITUD:**
Se solicita amablemente su valoración para considerar:
1. Escalamiento a paso 4-5 de GINA
2. Valorar necesidad de biológicos
3. Estudio complementario con espirometría de control y pruebas de alergia
4. Ajuste de esquema terapéutico

Quedo a sus órdenes para cualquier información adicional.

Atentamente,
**Dr. Alejandro Ramírez Gutiérrez**
Cédula Profesional: 12345678
Tel: (55) 1234-5678
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 *Resumen generado por MediSec IA — Revisión médica requerida*`,

  default: `**REFERENCIA MÉDICA**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**De:** Dr. Alejandro Ramírez — Medicina General
**Para:** Especialidad de referencia
**Fecha:** ${new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}

**DATOS DEL PACIENTE:**
Se incluyen datos del paciente seleccionado.

**MOTIVO DE REFERENCIA:**
Valoración especializada por hallazgos en consulta de medicina general.

**RESUMEN CLÍNICO:**
Se adjunta resumen clínico con antecedentes relevantes, hallazgos de exploración física, estudios previos y tratamiento actual del paciente.

**SOLICITUD:**
Se solicita amablemente su valoración y manejo especializado del caso. Quedo a sus órdenes para cualquier información adicional.

Atentamente,
**Dr. Alejandro Ramírez Gutiérrez**
Cédula Profesional: 12345678
Tel: (55) 1234-5678
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 *Resumen generado por MediSec IA — Revisión médica requerida*`,
};

function getRefTemplateKey(text: string): string {
  const lower = text.toLowerCase();
  if (/neum|asma|pulmon|respir|disnea/.test(lower)) return "neumologia";
  return "default";
}

export default function Referencias() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [specialty, setSpecialty] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStep, setGenStep] = useState("");
  const [generatedRef, setGeneratedRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [extraRefs, setExtraRefs] = useState<Referral[]>([]);

  const allRefs = [...referrals, ...extraRefs];

  const handleGenerate = () => {
    if (!notes.trim()) return;
    setGenerating(true);
    setGeneratedRef(null);
    setGenProgress(0);
    setGenStep("Analizando historial del paciente...");

    const steps = [
      { at: 20, text: "Recopilando antecedentes clínicos..." },
      { at: 40, text: "Estructurando resumen médico..." },
      { at: 60, text: "Adjuntando estudios relevantes..." },
      { at: 80, text: "Formateando referencia médica..." },
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5 + 2;
      if (progress > 98) progress = 98;
      setGenProgress(Math.min(progress, 98));
      const step = [...steps].reverse().find((s) => progress >= s.at);
      if (step) setGenStep(step.text);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setGenProgress(100);
      setGenStep("¡Referencia generada exitosamente!");
      setTimeout(() => {
        const key = getRefTemplateKey(notes + " " + specialty);
        setGeneratedRef(referralTemplates[key]);
        setGenerating(false);
      }, 400);
    }, 2800);
  };

  const handleCopy = () => {
    if (generatedRef) {
      navigator.clipboard.writeText(generatedRef.replace(/\*\*/g, "").replace(/━+/g, "—"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    const newRef: Referral = {
      id: Date.now().toString(),
      patientId: "6",
      patientName: selectedPatient || "Fernando Torres Méndez",
      toSpecialty: specialty || "Neumología",
      date: new Date().toISOString().split("T")[0],
      notes,
      summary: generatedRef || "",
    };
    setExtraRefs((prev) => [newRef, ...prev]);
    setDialogOpen(false);
    setNotes("");
    setSpecialty("");
    setGeneratedRef(null);
    setSelectedPatient("");
    setGenProgress(0);
  };

  const renderRefContent = (content: string) => (
    <div
      className="text-sm whitespace-pre-line leading-relaxed"
      dangerouslySetInnerHTML={{
        __html: content
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em class="text-muted-foreground text-xs">$1</em>')
          .replace(/━+/g, '<hr class="border-border my-2"/>')
      }}
    />
  );

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Referencias Médicas</h1>
          <p className="text-sm text-muted-foreground">{allRefs.length} referencias generadas — Formato profesional listo para enviar</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setGeneratedRef(null); setNotes(""); setGenProgress(0); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva referencia
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generar Referencia Médica con IA
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Paciente</label>
                  <select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Seleccionar paciente...</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Especialidad destino</label>
                  <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Ej: Neumología, Cardiología..." className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Motivo de referencia y contexto clínico</label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe el motivo de la referencia, antecedentes relevantes, tratamiento actual y lo que esperas de la valoración del especialista..." className="mt-1 min-h-[120px]" />
              </div>

              <Button onClick={handleGenerate} className="w-full gap-2 h-11" disabled={generating || !notes.trim()}>
                {generating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> {genStep}</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Crear resumen con IA</>
                )}
              </Button>

              {generating && (
                <div className="space-y-2 animate-fade-in">
                  <Progress value={genProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">{genStep}</p>
                </div>
              )}

              {generatedRef && (
                <div className="rounded-xl bg-muted/50 border border-primary/20 p-5 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <p className="text-sm font-semibold text-primary">Referencia generada por IA</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">Formato Profesional</Badge>
                  </div>

                  <div className="bg-background rounded-lg p-4 border border-border max-h-[400px] overflow-y-auto">
                    {renderRefContent(generatedRef)}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleSave} className="gap-2 flex-1">
                      <ArrowRightLeft className="h-4 w-4" /> Guardar referencia
                    </Button>
                    <Button onClick={handleCopy} variant="outline" className="gap-2">
                      {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copiado" : "Copiar"}
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <FileDown className="h-4 w-4" /> Exportar PDF
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {allRefs.map((ref) => (
          <Card key={ref.id} className="shadow-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-base">{ref.patientName}</CardTitle>
                <span className="text-xs text-muted-foreground">
                  {new Date(ref.date).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <Badge className="w-fit">{ref.toSpecialty}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Motivo de referencia:</p>
                <p className="text-sm">{ref.notes}</p>
              </div>
              <Separator />
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground font-medium mb-2">📋 Resumen clínico adjunto:</p>
                {renderRefContent(ref.summary)}
              </div>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Copy className="h-3.5 w-3.5" /> Copiar
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <FileDown className="h-3.5 w-3.5" /> Exportar PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
