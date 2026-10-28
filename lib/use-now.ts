import { useSyncExternalStore } from "react";

const STEP = 15_000;

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, STEP);
  return () => window.clearInterval(id);
}

/** Current time rounded to 15s; 0 during SSR/prerender (render nothing time-based then). */
export function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / STEP) * STEP,
    () => 0,
  );
}
