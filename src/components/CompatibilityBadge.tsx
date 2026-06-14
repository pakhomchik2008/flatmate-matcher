import { compatibilityColor } from "@/lib/matching";

const COLORS = {
  good: "bg-good text-white",
  warn: "bg-warn text-white",
  bad: "bg-bad text-white",
} as const;

export default function CompatibilityBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const cls = COLORS[compatibilityColor(score)];
  const sizes = {
    sm: "w-10 h-10 text-xs",
    md: "w-14 h-14 text-sm",
    lg: "w-20 h-20 text-lg",
  } as const;
  return (
    <div className={`rounded-full font-bold flex items-center justify-center shadow ${cls} ${sizes[size]}`}>
      {score}%
    </div>
  );
}
