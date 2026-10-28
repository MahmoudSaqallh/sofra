"use client";

import { useMemo, useSyncExternalStore } from "react";
import { cartStore, priceCart } from "@/lib/cart";

/** Cart state (persisted in localStorage) with derived totals. Empty during SSR/hydration. */
export function useCart() {
  const state = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const priced = useMemo(() => priceCart(state), [state]);
  return {
    ...priced,
    promo: state.promo,
    mode: state.mode,
    addressId: state.addressId,
    branchId: state.branchId,
    kitchenNote: state.kitchenNote,
    setAddress: cartStore.setAddress,
    setBranch: cartStore.setBranch,
    setKitchenNote: cartStore.setKitchenNote,
    add: cartStore.add,
    setQty: cartStore.setQty,
    remove: cartStore.remove,
    applyPromo: cartStore.applyPromo,
    clearPromo: cartStore.clearPromo,
    setMode: cartStore.setMode,
    clear: cartStore.clear,
  };
}
