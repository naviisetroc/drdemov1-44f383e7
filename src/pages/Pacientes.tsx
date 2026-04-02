import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, UserPlus, AlertTriangle, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { patients, Patient } from "@/data/mockData";
import { chatPatientToPatient } from "@/stores/patientChatStore";
import { useStoreSync } from "@/hooks/useStoreSync";

export default function Pacientes() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "activo" | "inactivo" | "nuevo">("todos");
  const { chatPatients } = useStoreSync();

  const chatPats = chatPatients.map(chatPatientToPatient);
  const chatIds = new Set(chatPats.map(p => p.id));
  const allPatients: Patient[] = [...patients.filter(p => p.id !== "10"), ...chatPats];

  const filtered = allPatients.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.conditions.some(c => c.toLowerCase().includes(search.toLowerCase()));
    if (filter === "nuevo") return matchSearch && chatIds.has(p.id);
    const matchFilter = filter === "todos" || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Pacientes</h1>
          <p className="text-sm text-destructive-foreground">
            {patients.filter(p => p.status === "activo" && p.id !== "10").length} registrados · {chatPats.length} nuevos vía chat
          </p>
        </div>
...
      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-foreground" />
          <Input
...
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
