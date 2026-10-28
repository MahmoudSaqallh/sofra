import { Minus, Plus } from "lucide-react";
import { faqs } from "@/lib/faq";

// Figma FAQ accordion: open item gets a 2px forest border and a filled minus button.
// Native <details> keeps it keyboard- and screen-reader-friendly without JS.
export function Faq() {
  return (
    <div className="flex flex-col gap-3">
      {faqs.map((item, i) => (
        <details
          key={item.q}
          open={i === 0}
          className="group rounded-2xl border border-line bg-surface transition-colors open:border-2 open:border-brand"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
            <span className="text-label-l font-medium text-ink">{item.q}</span>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-subtle text-brand group-open:bg-brand group-open:text-canvas">
              <Plus size={16} strokeWidth={1.75} className="group-open:hidden" aria-hidden />
              <Minus size={16} strokeWidth={1.75} className="hidden group-open:block" aria-hidden />
            </span>
          </summary>
          <p className="px-5 pb-5 text-body-m text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
