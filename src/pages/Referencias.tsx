import { ArrowRightLeft, Plus, FileDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { referrals } from "@/data/mockData";

export default function Referencias() {
  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Referencias Médicas</h1>
          <p className="text-sm text-muted-foreground">{referrals.length} referencias generadas</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva referencia
        </Button>
      </div>

      <div className="space-y-4">
        {referrals.map((ref) => (
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
