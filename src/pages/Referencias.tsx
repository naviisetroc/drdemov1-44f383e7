import { useState } from "react";
import { ArrowRightLeft, Plus, FileDown, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { referrals, patients, type Referral } from "@/data/mockData";

const generatedSummary = `Paciente masculino de 41 años con diagnóstico de asma bronquial de 5 años de evolución. Actualmente con exacerbaciones frecuentes (2-3 episodios/mes) a pesar de tratamiento con salbutamol de rescate y budesonida inhalada. Última espirometría (hace 8 meses) mostró patrón obstructivo leve. Se ha optimizado tratamiento con combinación budesonida/formoterol sin mejoría significativa. Se solicita valoración por neumología para considerar escalamiento terapéutico y estudio complementario.`;

export default function Referencias() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [specialty, setSpecialty] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedRef, setGeneratedRef] = useState<string | null>(null);
  const [extraRefs, setExtraRefs] = useState<Referral[]>([]);

  const allRefs = [...referrals, ...extraRefs];

  const handleGenerate = () => {
    if (!notes.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setGeneratedRef(generatedSummary);
      setGenerating(false);
    }, 1800);
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
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Referencias Médicas</h1>
          <p className="text-sm text-muted-foreground">{allRefs.length} referencias generadas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setGeneratedRef(null); setNotes(""); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva referencia
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">Generar Referencia Médica</DialogTitle>
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
                <label className="text-sm font-medium">Especialidad destino</label>
                <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Ej: Neumología, Cardiología..." className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Motivo y notas clínicas</label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe el motivo de la referencia y antecedentes relevantes..." className="mt-1 min-h-[100px]" />
              </div>
              <Button onClick={handleGenerate} className="w-full gap-2" disabled={generating || !notes.trim()}>
                {generating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Generando resumen con IA...</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Generar referencia con IA</>
                )}
              </Button>
              {generatedRef && (
                <div className="rounded-lg bg-muted/50 border border-primary/20 p-4 space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold text-primary">Resumen generado por IA</p>
                  </div>
                  <p className="text-sm leading-relaxed">{generatedRef}</p>
                  <Button onClick={handleSave} className="w-full gap-2 mt-2">
                    <ArrowRightLeft className="h-4 w-4" /> Guardar referencia
                  </Button>
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
                <p className="text-xs text-muted-foreground font-medium mb-1">Resumen clínico adjunto:</p>
                <p className="text-sm leading-relaxed">{ref.summary}</p>
              </div>
              <div className="flex gap-2 pt-1">
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
