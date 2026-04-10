import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, AlertTriangle, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { patients, Patient } from "@/data/mockData";
import { chatPatientToPatient } from "@/stores/patientChatStore";
import { useStoreSync } from "@/hooks/useStoreSync";
import { toast } from "sonner";

export default function Pacientes() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "activo" | "inactivo" | "nuevo">("todos");
  const { chatPatients } = useStoreSync();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: "", age: "", sex: "M", phone: "", email: "", condition: "", insuranceProvider: "", emergencyContact: "", allergies: "" });
  const [localPatients, setLocalPatients] = useState<Patient[]>([]);

  const chatPats = chatPatients.map(chatPatientToPatient);
  const chatIds = new Set(chatPats.map(p => p.id));
  const allPatients: Patient[] = [...patients.filter(p => p.id !== "10"), ...localPatients, ...chatPats];

  const filtered = allPatients.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.conditions.some(c => c.toLowerCase().includes(search.toLowerCase()));
    if (filter === "nuevo") return matchSearch && chatIds.has(p.id);
    const matchFilter = filter === "todos" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAddPatient = () => {
    if (!newPatient.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    const p: Patient = {
      id: `local-${Date.now()}`,
      name: newPatient.name,
      age: parseInt(newPatient.age) || 0,
      sex: newPatient.sex as "M" | "F",
      phone: newPatient.phone,
      email: newPatient.email,
      lastVisit: new Date().toISOString().split("T")[0],
      status: "activo",
      conditions: newPatient.condition ? [newPatient.condition] : [],
    };
    setLocalPatients(prev => [...prev, p]);
    setDialogOpen(false);
    setNewPatient({ name: "", age: "", sex: "M", phone: "", email: "", condition: "" });
    toast.success("Paciente registrado", { description: `${p.name} fue agregado exitosamente` });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Pacientes</h1>
          <p className="text-sm text-destructive-foreground">
            {patients.filter(p => p.status === "activo" && p.id !== "10").length + localPatients.length} registrados · {chatPats.length} nuevos vía chat
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => setDialogOpen(true)} className="gap-2 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all">
              <Plus className="h-4 w-4" />
              Nuevo paciente
            </Button>
          </TooltipTrigger>
          <TooltipContent>Registrar un nuevo paciente</TooltipContent>
        </Tooltip>
      </div>

      {/* New patient dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Registrar nuevo paciente</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Nombre completo *</Label>
                <Input value={newPatient.name} onChange={e => setNewPatient(p => ({ ...p, name: e.target.value }))} placeholder="Nombre del paciente" className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label>Edad</Label>
                <Input type="number" value={newPatient.age} onChange={e => setNewPatient(p => ({ ...p, age: e.target.value }))} placeholder="Edad" className="mt-1 rounded-xl" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Sexo</Label>
                <Select value={newPatient.sex} onValueChange={v => setNewPatient(p => ({ ...p, sex: v }))}>
                  <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input value={newPatient.phone} onChange={e => setNewPatient(p => ({ ...p, phone: e.target.value }))} placeholder="+52 55 ..." className="mt-1 rounded-xl" />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={newPatient.email} onChange={e => setNewPatient(p => ({ ...p, email: e.target.value }))} placeholder="correo@ejemplo.com" className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label>Condición principal (opcional)</Label>
              <Input value={newPatient.condition} onChange={e => setNewPatient(p => ({ ...p, condition: e.target.value }))} placeholder="Ej: Diabetes mellitus tipo 2" className="mt-1 rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button onClick={handleAddPatient} className="rounded-xl bg-gradient-to-r from-primary to-accent">Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-foreground" />
          <Input
            placeholder="Buscar por nombre o condición..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/30 border-border/40 rounded-xl focus:border-primary/50"
          />
        </div>
        <div className="flex gap-2">
          {([
            { key: "todos", label: "Todos" },
            { key: "activo", label: "Activos" },
            { key: "nuevo", label: `Nuevos (${chatPats.length})` },
            { key: "inactivo", label: "Inactivos" },
          ] as const).map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.key as typeof filter)}
              className={`rounded-xl ${filter === f.key ? "bg-primary/20 text-destructive-foreground border-primary/30 hover:bg-primary/30" : "border-border/40 hover:border-primary/30"}`}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Patient list */}
      <div className="space-y-3">
        {filtered.map((p) => {
          const isFromChat = chatIds.has(p.id);
          return (
            <Link key={p.id} to={`/pacientes/${p.id}`}>
              <Card className={`glass border-border/40 hover:border-primary/30 hover:shadow-glow transition-all duration-300 cursor-pointer ${isFromChat ? "border-success/30 bg-success/5" : ""}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold ${isFromChat ? "bg-success/15 text-success" : "bg-gradient-to-br from-primary/20 to-accent/20 text-primary"}`}>
                    {isFromChat ? <MessageCircle className="h-5 w-5" /> : p.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{p.name}</p>
                      <Badge variant={p.status === "activo" ? "default" : "secondary"} className="text-[10px] shrink-0 rounded-full bg-primary/15 text-primary border-primary/20">
                        {p.status}
                      </Badge>
                      {isFromChat && (
                        <Badge variant="outline" className="text-[10px] shrink-0 border-success/30 text-success gap-0.5 rounded-full">
                          <MessageCircle className="h-2.5 w-2.5" />
                          Vía chat
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {p.age} años · {p.sex === "M" ? "Masculino" : "Femenino"} {p.phone ? `· ${p.phone}` : ""}
                    </p>
                    {p.conditions.length > 0 && (
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {p.conditions.map((c) => (
                          <Badge key={c} variant="outline" className="text-[10px] rounded-full border-border/40">{c}</Badge>
                        ))}
                      </div>
                    )}
                    {p.allergies && p.allergies.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertTriangle className="h-3 w-3 text-warning" />
                        <span className="text-[10px] text-warning">Alergias: {p.allergies.join(", ")}</span>
                      </div>
                    )}
                  </div>
                  <div className="hidden sm:block text-right shrink-0">
                    {p.lastVisit ? (
                      <>
                        <p className="text-xs text-muted-foreground">Última visita</p>
                        <p className="text-sm font-medium">
                          {new Date(p.lastVisit).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        {p.insuranceProvider && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">🏥 {p.insuranceProvider}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">Sin visitas previas</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No se encontraron pacientes</p>
          </div>
        )}
      </div>
    </div>
  );
}
