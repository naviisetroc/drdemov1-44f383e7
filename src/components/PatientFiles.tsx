import { useState, useRef } from "react";
import {
  Folder,
  Upload,
  FileText,
  Image,
  File,
  Trash2,
  Eye,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export interface PatientFile {
  id: string;
  name: string;
  type: "receta" | "estudio" | "análisis" | "imagen" | "otro";
  date: string;
  size: string;
}

const TYPE_CONFIG: Record<string, { label: string; icon: typeof FileText; color: string }> = {
  receta: { label: "Receta", icon: FileText, color: "text-primary" },
  estudio: { label: "Estudio", icon: File, color: "text-accent" },
  "análisis": { label: "Análisis", icon: FileText, color: "text-emerald-600" },
  imagen: { label: "Imagen", icon: Image, color: "text-amber-600" },
  otro: { label: "Otro", icon: File, color: "text-muted-foreground" },
};

const SEED_FILES: PatientFile[] = [
  { id: "f-1", name: "Resonancia_rodilla_derecha.pdf", type: "estudio", date: "2026-03-14", size: "2.4 MB" },
  { id: "f-2", name: "Resultados_laboratorio_marzo.pdf", type: "análisis", date: "2026-03-18", size: "540 KB" },
  { id: "f-3", name: "Receta_post_artroscopia.pdf", type: "receta", date: "2026-03-20", size: "120 KB" },
];

interface PatientFilesProps {
  patientId: string;
}

export default function PatientFiles({ patientId }: PatientFilesProps) {
  const [files, setFiles] = useState<PatientFile[]>(SEED_FILES);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PatientFile | null>(null);
  const [viewTarget, setViewTarget] = useState<PatientFile | null>(null);

  // Upload form state
  const [uploadName, setUploadName] = useState("");
  const [uploadType, setUploadType] = useState<PatientFile["type"]>("otro");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUpload() {
    if (!uploadName.trim()) {
      toast({ title: "Ingresa un nombre para el archivo", variant: "destructive" });
      return;
    }
    const newFile: PatientFile = {
      id: `f-${Date.now()}`,
      name: uploadName.trim(),
      type: uploadType,
      date: new Date().toISOString().split("T")[0],
      size: `${(Math.random() * 5 + 0.1).toFixed(1)} MB`,
    };
    setFiles((prev) => [newFile, ...prev]);
    setUploadOpen(false);
    setUploadName("");
    setUploadType("otro");
    toast({ title: "Archivo subido", description: `"${newFile.name}" se agregó correctamente.` });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setFiles((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    toast({ title: "Archivo eliminado", description: `"${deleteTarget.name}" fue eliminado.` });
    setDeleteTarget(null);
  }

  return (
    <>
      <Card className="glass-strong border-border/30 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Folder className="h-4 w-4 text-primary" />
              Archivos y estudios
              {files.length > 0 && (
                <Badge variant="secondary" className="rounded-full text-xs ml-1">
                  {files.length}
                </Badge>
              )}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 rounded-xl"
              onClick={() => setUploadOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Subir
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="flex flex-col items-center text-center py-8 text-muted-foreground">
              <Folder className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm">Sin archivos por el momento</p>
              <p className="text-xs mt-1">Sube tus estudios, análisis y documentos médicos.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => {
                const cfg = TYPE_CONFIG[file.type] ?? TYPE_CONFIG.otro;
                const Icon = cfg.icon;
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-card hover:shadow-sm transition-all overflow-hidden"
                  >
                    <div className={`h-9 w-9 rounded-lg bg-muted/40 flex items-center justify-center shrink-0`}>
                      <Icon className={`h-4 w-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Badge className="rounded-full bg-muted text-muted-foreground border-transparent text-[10px] px-1.5 py-0 shrink-0">
                          {cfg.label}
                        </Badge>
                        <span className="whitespace-nowrap">
                          {new Date(file.date).toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                        <span>•</span>
                        <span>{file.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setViewTarget(file)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteTarget(file)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              Subir archivo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div
              className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Haz clic para seleccionar un archivo
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">PDF, imagen o documento</p>
              <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setUploadName(f.name);
              }} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Nombre del archivo</label>
              <Input
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                placeholder="Ej: Resonancia_rodilla.pdf"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Tipo de documento</label>
              <Select value={uploadType} onValueChange={(v) => setUploadType(v as PatientFile["type"])}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receta">Receta</SelectItem>
                  <SelectItem value="estudio">Estudio</SelectItem>
                  <SelectItem value="análisis">Análisis</SelectItem>
                  <SelectItem value="imagen">Imagen médica</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpload}>Subir archivo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View dialog */}
      <Dialog open={!!viewTarget} onOpenChange={() => setViewTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Detalle del archivo</DialogTitle>
          </DialogHeader>
          {viewTarget && (() => {
            const cfg = TYPE_CONFIG[viewTarget.type] ?? TYPE_CONFIG.otro;
            const Icon = cfg.icon;
            return (
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-muted/40 flex items-center justify-center">
                    <Icon className={`h-6 w-6 ${cfg.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{viewTarget.name}</p>
                    <p className="text-xs text-muted-foreground">{viewTarget.size}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-[11px] text-muted-foreground">Tipo</p>
                    <p className="text-sm font-medium">{cfg.label}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-[11px] text-muted-foreground">Fecha</p>
                    <p className="text-sm font-medium">
                      {new Date(viewTarget.date).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-dashed border-border/40 text-center text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Vista previa no disponible en modo demo</p>
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTarget(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar archivo</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar "{deleteTarget?.name}"? Esta acción no se puede deshacer.
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
