"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Milestone = { year: string; title: string; text: string };

const LINE_MS = 1600;

/**
 * "محطات في رحلة سُفرة" timeline, animated when it scrolls into view: the gold line draws from the first
 * milestone (right, RTL) to the latest, each dot pops in as the line reaches it, then its text rises in.
 * Phones get the same sequence on a vertical line. Reduced motion shows the final state (see globals.css).
 */
export function MilestoneTimeline({ milestones }: { milestones: Milestone[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const step = LINE_MS / Math.max(1, milestones.length - 1);

  return (
    <ol ref={ref} className="relative grid gap-8 md:grid-cols-5 md:gap-4">
      {/* Desktop: horizontal line between the first and last dot centres, drawn right → left. */}
      <span
        aria-hidden
        className={cn(
          "absolute top-2.5 right-[10%] left-[10%] hidden h-0.5 origin-right bg-accent-line transition-transform ease-out md:block",
          shown ? "scale-x-100" : "scale-x-0",
        )}
        style={{ transitionDuration: `${LINE_MS}ms` }}
      />
      {/* Phones: vertical line through the dots, drawn top → bottom. */}
      <span
        aria-hidden
        className={cn(
          "absolute top-3 right-[9px] bottom-3 w-0.5 origin-top bg-accent-line transition-transform ease-out md:hidden",
          shown ? "scale-y-100" : "scale-y-0",
        )}
        style={{ transitionDuration: `${LINE_MS}ms` }}
      />

      {milestones.map((m, i) => {
        const latest = i === milestones.length - 1;
        const at = Math.round(i * step);
        return (
          <li key={m.year} className="group relative flex gap-4 md:flex-col md:items-center md:gap-0 md:text-center">
            <span aria-hidden className="relative z-10 mt-1 size-5 shrink-0 md:mt-0">
              <span
                className={cn(
                  "absolute inset-0 rounded-full border-2 transition-[transform,opacity,background-color,border-color] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  latest ? "border-brand bg-brand ring-4 ring-brand/15" : "border-accent-line bg-subtle group-hover:border-accent group-hover:bg-accent-subtle",
                  shown ? "scale-100 opacity-100" : "scale-0 opacity-0",
                )}
                style={{ transitionDelay: shown ? `${at}ms` : "0ms" }}
              >
                {/* Latest milestone: a few soft pulses once its dot has landed (inside the dot, so it appears with it). */}
                {latest && shown && (
                  <span
                    className="absolute -inset-0.5 animate-ping rounded-full bg-brand/40 [animation-iteration-count:3]"
                    style={{ animationDelay: `${at + 500}ms` }}
                  />
                )}
              </span>
            </span>
            <div
              className={cn(
                "flex flex-col items-start gap-2 transition-[transform,opacity] duration-700 ease-out md:items-center md:pt-6",
                shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
              style={{ transitionDelay: shown ? `${at + 150}ms` : "0ms" }}
            >
              <span className="text-number-l font-semibold text-accent-ink">{m.year}</span>
              <h3 className="font-display text-h4 font-semibold text-brand">{m.title}</h3>
              <p className="max-w-[220px] text-body-s text-muted">{m.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
