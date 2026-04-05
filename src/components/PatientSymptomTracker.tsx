import { useState } from "react";
import {
  HeartPulse,
  Plus,
  Trash2,
  Clock,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  getPatientSymptoms,
  addPatientSymptom,
  deletePatientSymptom,
  SymptomEntry,
} from "@/stores/patientSymptomStore";

function intensityLabel(v: number) {
  if (v <= 3) return { text: "Leve", color: "bg-emerald-500/10 text-emerald-600" };
  if (v <= 6) return { text: "Moderado", color: "bg-amber-500/10 text-amber-600" };
  return { text: "Intenso", color: "bg-destructive/10 text-destructive" };
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Justo ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `Hace ${days}d`;
}

interface PatientSymptomTrackerProps {
  patientId: string;
}

export default function PatientSymptomTracker({ patientId }: PatientSymptomTrackerProps) {
  const [entries, setEntries] = useState<SymptomEntry[]>(() => getPatientSymptoms(patientId));
  const [addOpen, setAddOpen] = useState(false);
  const [text, setText] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [deleteTarget, setDeleteTarget] = useState<SymptomEntry | null>(null);

  function refresh() {
    setEntries(getPatientSymptoms(patientId));
  }

  function handleAdd() {
    if (!text.trim()) {
      toast({ title: "Describe cómo te sientes", variant: "destructive" });
      return;
    }
    addPatientSymptom(patientId, text.trim(), intensity);
    setText("");
    setIntensity(5);
    setAddOpen(false);
    refresh();
    toast({ title: "Síntoma registrado", description: "Tu médico podrá verlo en tu expediente." });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deletePatientSymptom(deleteTarget.id);
    setDeleteTarget(null);
    refresh();
    toast({ title: "Registro eliminado" });
  }

  return (
    <>
      <Card className="glass-strong border-border/30 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-primary" />
              Seguimiento de síntomas
              {entries.length > 0 && (
                <Badge variant="secondary" className="rounded-full text-xs ml-1">
                  {entries.length}
                </Badge>
              )}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 rounded-xl"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Registrar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="flex flex-col items-center text-center py-8 text-muted-foreground">
              <HeartPulse className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm">Sin registros aún</p>
              <p className="text-xs mt-1">Registra cómo te sientes para que tu médico pueda dar seguimiento.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => {
                const il = intensityLabel(entry.intensity);
                return (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border/30 bg-card"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Gauge className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{entry.text}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge className={`rounded-full border-transparent text-[10px] px-2 py-0 ${il.color}`}>
                          {entry.intensity}/10 — {il.text}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(entry.date)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => setDeleteTarget(entry)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-primary" />
              ¿Cómo te sientes?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Describe tus síntomas
              </label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ej: Me duele la rodilla al caminar, siento inflamación..."
                className="rounded-xl resize-none min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">
                  Intensidad del malestar
                </label>
                <Badge className={`rounded-full border-transparent text-xs ${intensityLabel(intensity).color}`}>
                  {intensity}/10 — {intensityLabel(intensity).text}
                </Badge>
              </div>
              <Slider
                value={[intensity]}
                onValueChange={([v]) => setIntensity(v)}
                min={1}
                max={10}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                <span>Leve</span>
                <span>Moderado</span>
                <span>Intenso</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdd}>Guardar registro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar registro</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar este registro de síntomas?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
