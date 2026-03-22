import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { patients } from "@/data/mockData";

export default function Pacientes() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "activo" | "inactivo">("todos");

  const filtered = patients.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "todos" || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Pacientes</h1>
          <p className="text-sm text-muted-foreground">{patients.length} pacientes registrados</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo paciente
        </Button>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["todos", "activo", "inactivo"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Patient list */}
      <div className="space-y-3">
        {filtered.map((p) => (
          <Link key={p.id} to={`/pacientes/${p.id}`}>
            <Card className="shadow-card hover:shadow-medium transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                  {p.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{p.name}</p>
                    <Badge variant={p.status === "activo" ? "default" : "secondary"} className="text-[10px] shrink-0">
                      {p.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {p.age} años · {p.sex === "M" ? "Masculino" : "Femenino"} · {p.phone}
                  </p>
                  {p.conditions.length > 0 && (
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      {p.conditions.map((c) => (
                        <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <p className="text-xs text-muted-foreground">Última visita</p>
                  <p className="text-sm font-medium">
                    {new Date(p.lastVisit).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No se encontraron pacientes</p>
          </div>
        )}
      </div>
    </div>
  );
}
