import { useState } from "react";
import { FileText, Plus, Mic, Type, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { clinicalNotes } from "@/data/mockData";

export default function NotasMedicas() {
  const [search, setSearch] = useState("");
  const [newNoteOpen, setNewNoteOpen] = useState(false);

  const filtered = clinicalNotes.filter(
    (n) =>
      n.patientName.toLowerCase().includes(search.toLowerCase()) ||
      n.rawInput.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Notas Médicas</h1>
          <p className="text-sm text-muted-foreground">Notas clínicas asistidas por IA</p>
        </div>
        <Dialog open={newNoteOpen} onOpenChange={setNewNoteOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva nota
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">Nueva Nota Médica</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium">Paciente</label>
                <Input placeholder="Buscar paciente..." className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Tipo de entrada</label>
                <div className="flex gap-2 mt-1">
                  <Button variant="outline" size="sm" className="gap-1.5 flex-1">
                    <Type className="h-3.5 w-3.5" /> Texto
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5 flex-1">
                    <Mic className="h-3.5 w-3.5" /> Voz
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Notas de la consulta</label>
                <Textarea
                  placeholder="Escribe las notas de la consulta. La IA generará una nota estructurada automáticamente..."
                  className="mt-1 min-h-[120px]"
                />
              </div>
              <Button className="w-full gap-2">
                <FileText className="h-4 w-4" />
                Generar nota con IA
              </Button>
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
                <div className="text-sm whitespace-pre-line leading-relaxed">{note.aiOutput}</div>
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
