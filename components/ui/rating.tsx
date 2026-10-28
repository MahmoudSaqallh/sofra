import { Star } from "lucide-react";

// Figma "Rating": five gold stars followed by the score.
export function Rating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`التقييم ${value.toFixed(1)} من 5`}>
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={16}
            strokeWidth={1.75}
            className={i < Math.round(value) ? "fill-accent text-accent" : "text-line-strong"}
          />
        ))}
      </div>
      <span className="text-label-m font-medium text-ink" aria-hidden>
        {value.toFixed(1)}
      </span>
    </div>
  );
}
