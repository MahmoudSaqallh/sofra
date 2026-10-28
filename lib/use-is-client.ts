import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during prerender/SSR and hydration, true afterwards — for values that depend on "now". */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
