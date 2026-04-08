import { useFontSize } from "@/hooks/useFontSize";
import { Button } from "@/components/ui/button";

export default function FontSizeButton() {
  const { label, cycle } = useFontSize();

  const level = label === "A" ? 1 : label === "A+" ? 2 : 3;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      className="text-primary-foreground hover:bg-primary-foreground/20 rounded-xl relative h-11 w-11 animate-bounce-subtle"
      title="Cambiar tamaño de fuente"
    >
      <span className="font-bold leading-none tracking-tight" style={{ fontFamily: "system-ui, sans-serif" }}>
        <span className="text-lg">A</span>
        <span className="text-sm">a</span>
      </span>
      <span className="absolute -bottom-0.5 -right-0.5 text-[9px] font-bold bg-primary-foreground/30 rounded-full h-4 w-4 flex items-center justify-center leading-none">
        {level}
      </span>
    </Button>
  );
}
