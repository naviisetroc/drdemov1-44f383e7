import { useState } from "react";
import { FileText, Plus, Mic, Type, Search, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { clinicalNotes, patients, type ClinicalNote } from "@/data/mockData";

const generatedSoapNote = `**S (Subjetivo):** Paciente masculino de 41 años acude por exacerbación de cuadro asmático. Refiere aumento de disnea y sibilancias en los últimos 3 días, asociado a exposición a polvo. Uso aumentado de salbutamol de rescate (4-5 veces/día).

**O (Objetivo):** TA: 120/78 mmHg. FC: 88 lpm. FR: 22 rpm. SatO2: 94%. Sibilancias espiratorias bilaterales. Sin uso de músculos accesorios.

**A (Análisis):** Exacerbación leve-moderada de asma bronquial. Posible componente alérgico ambiental.

**P (Plan):** Nebulización con salbutamol en consultorio. Ajustar esquema de control: agregar budesonida/formoterol 160/4.5 mcg c/12h. Evitar exposición a alérgenos. Control en 1 semana. Si persiste, solicitar espirometría.`;

export default function NotasMedicas() {
  const [search, setSearch] = useState("");
  const [newNoteOpen, setNewNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [inputType, setInputType] = useState<"texto" | "voz">("texto");
  const [generating, setGenerating] = useState(false);
  const [generatedNote, setGeneratedNote] = useState<string | null>(null);
  const [extraNotes, setExtraNotes] = useState<ClinicalNote[]>([]);

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
    setTimeout(() => {
      setGeneratedNote(generatedSoapNote);
      setGenerating(false);
    }, 2000);
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
      format: "SOAP",
      doctorName: "Dr. Alejandro Ramírez",
    };
    setExtraNotes((prev) => [newNote, ...prev]);
    setNewNoteOpen(false);
    setNoteText("");
    setGeneratedNote(null);
    setSelectedPatient("");
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Notas Médicas</h1>
          <p className="text-sm text-muted-foreground">Notas clínicas asistidas por IA</p>
        </div>
        <Dialog open={newNoteOpen} onOpenChange={(open) => { setNewNoteOpen(open); if (!open) { setGeneratedNote(null); setNoteText(""); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva nota
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">Nueva Nota Médica</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
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
                    <Mic className="h-3.5 w-3.5" /> Voz
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">
                  {inputType === "voz" ? "Transcripción de voz (simulada)" : "Notas de la consulta"}
                </label>
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={inputType === "voz"
                    ? "Simula una transcripción de voz aquí... Ej: Paciente presenta cuadro asmático con disnea..."
                    : "Escribe las notas de la consulta..."
                  }
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <Button onClick={handleGenerate} className="w-full gap-2" disabled={generating || !noteText.trim()}>
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generando nota con IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generar nota con IA
                  </>
                )}
              </Button>

              {generatedNote && (
                <div className="rounded-lg bg-muted/50 border border-primary/20 p-4 space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold text-primary">Nota generada por IA (SOAP)</p>
                  </div>
                  <div
                    className="text-sm whitespace-pre-line leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: generatedNote.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }}
                  />
                  <Button onClick={handleSave} className="w-full gap-2 mt-2">
                    <FileText className="h-4 w-4" /> Guardar nota
                  </Button>
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
          className="pl-9"
        />
      </div>

      {/* Notes list */}
      <div className="space-y-4">
        {filtered.map((note) => (
          <Card key={note.id} className="shadow-card">
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
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Nota generada por IA:</p>
                <div
                  className="text-sm whitespace-pre-line leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: note.aiOutput.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }}
                />
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Entrada original:</p>
                <p className="text-sm text-muted-foreground italic">{note.rawInput}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
