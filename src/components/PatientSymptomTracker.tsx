import { useState, useRef } from "react";
import {
  HeartPulse,
  Plus,
  Trash2,
  Clock,
  Gauge,
  Camera,
  Paperclip,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  getPatientSymptoms,
  addPatientSymptom,
  deletePatientSymptom,
  SymptomEntry,
  SymptomAttachment,
} from "@/stores/patientSymptomStore";
import { Appointment } from "@/data/mockData";

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
  appointments?: Appointment[];
}

export default function PatientSymptomTracker({ patientId, appointments = [] }: PatientSymptomTrackerProps) {
  const [entries, setEntries] = useState<SymptomEntry[]>(() => getPatientSymptoms(patientId));
  const [addOpen, setAddOpen] = useState(false);
  const [text, setText] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [painType, setPainType] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [history, setHistory] = useState("");
  const [notes, setNotes] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SymptomEntry | null>(null);
  const [attachments, setAttachments] = useState<SymptomAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const upcomingAppointments = appointments.filter(
    (a) => a.status === "programada" || a.status === "confirmada"
  );

  function refresh() {
    setEntries(getPatientSymptoms(patientId));
  }

  function resetForm() {
    setText("");
    setIntensity(5);
    setPainType("");
    setLocation("");
    setDuration("");
    setHistory("");
    setNotes("");
    setAppointmentId("");
    setAttachments([]);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments((prev) => [
          ...prev,
          { name: file.name, type: file.type, dataUrl: reader.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAdd() {
    if (!text.trim()) {
      toast({ title: "Describe cómo te sientes", variant: "destructive" });
      return;
    }
    addPatientSymptom(patientId, text.trim(), intensity, {
      painType: painType.trim() || undefined,
      location: location.trim() || undefined,
      duration: duration.trim() || undefined,
      history: history.trim() || undefined,
      notes: notes.trim() || undefined,
      appointmentId: appointmentId || undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
    });
    resetForm();
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
                    className="flex items-start gap-3 p-3 rounded-xl border border-border/30 bg-card overflow-hidden"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Gauge className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm break-words">{entry.text}</p>
                      {(entry.painType || entry.location || entry.duration) && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {entry.painType && (
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-md">{entry.painType}</span>
                          )}
                          {entry.location && (
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-md">{entry.location}</span>
                          )}
                          {entry.duration && (
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-md">{entry.duration}</span>
                          )}
                        </div>
                      )}
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
      <Dialog open={addOpen} onOpenChange={(open) => { if (!open) resetForm(); setAddOpen(open); }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-primary" />
              Reportar Síntomas
            </DialogTitle>
            <DialogDescription>
              Completa el formulario de preconsulta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Cita asociada */}
            {upcomingAppointments.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Cita asociada</Label>
                <Select value={appointmentId} onValueChange={setAppointmentId}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Seleccionar cita..." />
                  </SelectTrigger>
                  <SelectContent>
                    {upcomingAppointments.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.reason} — {new Date(a.datetime).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Tipo de dolor */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Tipo de dolor</Label>
              <Input
                value={painType}
                onChange={(e) => setPainType(e.target.value)}
                placeholder="Ej: Punzante, sordo, quemante..."
                className="rounded-xl"
              />
            </div>

            {/* Ubicación */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Ubicación</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Rodilla derecha, espalda baja..."
                className="rounded-xl"
              />
            </div>

            {/* Duración */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Duración</Label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ej: 3 días, intermitente..."
                className="rounded-xl"
              />
            </div>

            {/* Intensidad */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">
                  Intensidad: {intensity}/10
                </Label>
                <Badge className={`rounded-full border-transparent text-xs ${intensityLabel(intensity).color}`}>
                  {intensityLabel(intensity).text}
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

            {/* Antecedentes relevantes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Antecedentes relevantes</Label>
              <Textarea
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                placeholder="Ej: Cirugía previa, alergias, condiciones crónicas..."
                className="rounded-xl resize-none min-h-[70px]"
              />
            </div>

            {/* Notas adicionales */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Notas adicionales (opcional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Cualquier otra información que quieras compartir..."
                className="rounded-xl resize-none min-h-[70px]"
              />
            </div>

            {/* Descripción general - lo que antes era el único campo */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Describe tus síntomas <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ej: Me duele la rodilla al caminar, siento inflamación..."
                className="rounded-xl resize-none min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { resetForm(); setAddOpen(false); }}>Cancelar</Button>
            <Button onClick={handleAdd}>Enviar Síntomas</Button>
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
