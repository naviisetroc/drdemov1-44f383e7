import { useFontSize } from "@/hooks/useFontSize";
import { Button } from "@/components/ui/button";
import { Type } from "lucide-react";

export default function FontSizeButton() {
  const { label, cycle } = useFontSize();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      className="text-primary-foreground hover:bg-primary-foreground/20 rounded-xl relative"
      title="Cambiar tamaño de fuente"
    >
      <Type className="h-4 w-4" />
      <span className="absolute -bottom-0.5 -right-0.5 text-[8px] font-bold bg-primary-foreground/30 rounded-full h-3.5 w-3.5 flex items-center justify-center leading-none">
        {label === "A" ? "1" : label === "A+" ? "2" : "3"}
      </span>
    </Button>
  );
}
