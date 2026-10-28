"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Phase = "idle" | "loading" | "done";

/**
 * Thin gold bar at the top of the window while the next page loads (App Router has no router events,
 * so it starts on internal link clicks and completes when the URL changes). Fills right → left (RTL).
 */
export function RouteProgress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const url = `${pathname}?${search}`;
  const [phase, setPhase] = useState<Phase>("idle");
  const [lastUrl, setLastUrl] = useState(url);

  // The URL changed → the navigation landed.
  if (url !== lastUrl) {
    setLastUrl(url);
    if (phase === "loading") setPhase("done");
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const next = new URL(a.href, window.location.href);
      if (next.origin !== window.location.origin) return;
      const same = next.pathname === window.location.pathname && next.search === window.location.search;
      if (same) return; // hash jumps / current page
      setPhase("loading");
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (phase === "idle") return;
    // "done" fades out quickly; "loading" gives up after 10s (e.g. a navigation that was cancelled).
    const t = window.setTimeout(() => setPhase("idle"), phase === "done" ? 450 : 10_000);
    return () => window.clearTimeout(t);
  }, [phase]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div
        className={cn(
          "h-full origin-right bg-accent shadow-[0_0_10px_rgb(184_149_90/0.7)]",
          phase === "idle" && "scale-x-0 opacity-0",
          phase === "loading" && "animate-route-progress",
          phase === "done" && "scale-x-100 opacity-0 transition-[transform,opacity] duration-200 [transition-delay:0ms,200ms]",
        )}
      />
    </div>
  );
}
