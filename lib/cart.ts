import { getDish, type Dish } from "@/lib/menu";

/* ----------------------------------------------------------------------------
 * Cart model + pricing. Numbers follow the Figma cart/checkout frames:
 * SUFRA20 = 20% off the subtotal, VAT 15% on (subtotal − discount + delivery),
 * free delivery above 150 ر.س, 1 loyalty point per 10 ر.س.
 * ------------------------------------------------------------------------- */

export type CartLine = {
  key: string;
  slug: string;
  qty: number;
  sizeId?: string;
  extras: string[];
  note?: string;
};

export type OrderMode = "delivery" | "pickup" | "dine-in";

export type CartState = {
  lines: CartLine[];
  promo: string | null;
  mode: OrderMode;
  /** Saved address id (delivery) / branch id (pickup, dine-in) chosen in the order bar or checkout. */
  addressId: string;
  branchId: string;
  /** "أضف ملاحظة للمطبخ…" on the Order Online cart panel. */
  kitchenNote: string;
};

type PromoLine = { dish: Dish; unit: number; qty: number; total: number };

export type Promo = {
  /** Short label: "خصم 20٪", "1+1"… */
  label: string;
  /** What must be in the cart for the code to do anything. */
  hint: string;
  discount: (lines: PromoLine[], subtotal: number) => number;
};

const isType = (...types: string[]) => (l: PromoLine) => types.includes(l.dish.type);

/* Codes and rules from the Figma Offers page. Time windows (e.g. "بعد 9 م") aren't enforced in this demo. */
export const PROMOS: Record<string, Promo> = {
  SUFRA20: {
    label: "خصم 20٪",
    hint: "",
    // The Figma totals take 20% of the whole subtotal (394 → 78.80).
    discount: (_lines, subtotal) => subtotal * 0.2,
  },
  PIZZANIGHT: {
    label: "خصم 25٪ على البيتزا",
    hint: "أضف بيتزا إلى سلتك",
    discount: (lines) => lines.filter(isType("pizza")).reduce((s, l) => s + l.total * 0.25, 0),
  },
  BURGER11: {
    label: "برجر مجاني مع كل برجر",
    hint: "أضف برجرين على الأقل",
    discount: (lines) => {
      const units = lines.filter(isType("burgers")).flatMap((l) => Array(l.qty).fill(l.unit) as number[]).sort((a, b) => a - b);
      return units.slice(0, Math.floor(units.length / 2)).reduce((s, u) => s + u, 0);
    },
  },
  WELCOME: {
    label: "كنافة مجانية",
    hint: "أضف كنافة بالفستق إلى سلتك",
    discount: (lines) => lines.find((l) => l.dish.slug === "pistachio-kunafa")?.unit ?? 0,
  },
  BREAKFAST: {
    label: "فطور لشخصين بـ 79 ر.س",
    hint: "أضف فطوراً شامياً ومشروبين ساخنين",
    discount: (lines) => {
      const breakfast = lines.find((l) => l.dish.slug === "shami-breakfast");
      const hot = lines.filter(isType("hot-drinks")).flatMap((l) => Array(l.qty).fill(l.unit) as number[]).sort((a, b) => b - a);
      if (!breakfast || hot.length < 2) return 0;
      return Math.max(0, breakfast.unit + hot[0] + hot[1] - 79);
    },
  },
  // GOLDDRINK is Gold-tier only, so it isn't redeemable from the cart (see the Offers page).
};

export const FREE_DELIVERY_FROM = 150;
// Not specified in Figma (only "free above 150 ر.س"); placeholder flat fee below that.
export const DELIVERY_FEE = 15;
export const VAT_RATE = 0.15;

export function lineKey(slug: string, sizeId: string | undefined, extras: string[], note?: string) {
  return [slug, sizeId ?? "", [...extras].sort().join("+"), note?.trim() ?? ""].join("|");
}

export function unitPrice(dish: Dish, sizeId: string | undefined, extras: string[]) {
  const base = dish.sizes?.find((s) => s.id === sizeId)?.price ?? dish.price;
  const add = (dish.extras?.options ?? []).filter((o) => extras.includes(o.id)).reduce((sum, o) => sum + o.price, 0);
  return base + add;
}

/** "لشخصين · ثومية إضافية، حلوم مشوي" */
export function optionsLabel(dish: Dish, line: Pick<CartLine, "sizeId" | "extras" | "note">) {
  const parts: string[] = [];
  const size = dish.sizes?.find((s) => s.id === line.sizeId);
  if (size) parts.push(size.label);
  const extras = (dish.extras?.options ?? []).filter((o) => line.extras.includes(o.id)).map((o) => o.label);
  if (extras.length) parts.push(extras.join("، "));
  if (line.note?.trim()) parts.push(line.note.trim());
  return parts.join(" · ");
}

export type PricedLine = CartLine & { dish: Dish; unit: number; total: number; label: string };

export function priceCart(state: CartState) {
  const lines: PricedLine[] = state.lines.flatMap((line) => {
    const dish = getDish(line.slug);
    if (!dish) return [];
    const unit = unitPrice(dish, line.sizeId, line.extras);
    return [{ ...line, dish, unit, total: unit * line.qty, label: optionsLabel(dish, line) }];
  });
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);
  const promo = state.promo ? PROMOS[state.promo] : undefined;
  const discount = promo ? round(Math.min(subtotal, promo.discount(lines, subtotal))) : 0;
  const delivery =
    state.mode !== "delivery" || subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const vat = round((subtotal - discount + delivery) * VAT_RATE);
  const total = round(subtotal - discount + delivery + vat);
  return {
    lines,
    count,
    subtotal,
    discount,
    promoInfo: promo,
    delivery,
    freeDelivery: state.mode === "delivery" && subtotal >= FREE_DELIVERY_FROM,
    vat,
    total,
    points: Math.floor(total / 10),
  };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

/* ----------------------------------------------------------------------------
 * Store — module singleton persisted to localStorage, read via useSyncExternalStore.
 * ------------------------------------------------------------------------- */

const STORAGE_KEY = "sufra-cart-v1";
export const EMPTY_CART: CartState = {
  lines: [],
  promo: null,
  mode: "delivery",
  addressId: "home",
  branchId: "olaya",
  kitchenNote: "",
};

let state: CartState = EMPTY_CART;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CartState>;
      state = {
        lines: Array.isArray(parsed.lines) ? parsed.lines.filter((l) => getDish(l.slug) && l.qty > 0) : [],
        promo: parsed.promo && PROMOS[parsed.promo] ? parsed.promo : null,
        mode: parsed.mode === "pickup" || parsed.mode === "dine-in" ? parsed.mode : "delivery",
        addressId: typeof parsed.addressId === "string" ? parsed.addressId : EMPTY_CART.addressId,
        branchId: typeof parsed.branchId === "string" ? parsed.branchId : EMPTY_CART.branchId,
        kitchenNote: typeof parsed.kitchenNote === "string" ? parsed.kitchenNote : "",
      };
    }
  } catch {
    // Storage unavailable (private mode, blocked) — the cart simply starts empty.
  }
}

function commit(next: CartState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota/blocked storage; in-memory state still works for this visit.
  }
  listeners.forEach((l) => l());
}

export const cartStore = {
  subscribe(listener: () => void) {
    load();
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      loaded = false;
      load();
      listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot() {
    load();
    return state;
  },
  getServerSnapshot() {
    return EMPTY_CART;
  },

  add(input: { slug: string; qty?: number; sizeId?: string; extras?: string[]; note?: string }) {
    const extras = input.extras ?? [];
    const dish = getDish(input.slug);
    const sizeId = input.sizeId ?? dish?.sizes?.[0]?.id;
    const key = lineKey(input.slug, sizeId, extras, input.note);
    const qty = Math.max(1, input.qty ?? 1);
    const existing = state.lines.find((l) => l.key === key);
    commit({
      ...state,
      lines: existing
        ? state.lines.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
        : [...state.lines, { key, slug: input.slug, qty, sizeId, extras, note: input.note?.trim() || undefined }],
    });
  },
  setQty(key: string, qty: number) {
    commit({
      ...state,
      lines: qty <= 0 ? state.lines.filter((l) => l.key !== key) : state.lines.map((l) => (l.key === key ? { ...l, qty } : l)),
    });
  },
  remove(key: string) {
    commit({ ...state, lines: state.lines.filter((l) => l.key !== key) });
  },
  /** Returns true when the code is valid. */
  applyPromo(code: string) {
    const normalized = code.trim().toUpperCase();
    if (!PROMOS[normalized]) return false;
    commit({ ...state, promo: normalized });
    return true;
  },
  clearPromo() {
    commit({ ...state, promo: null });
  },
  setMode(mode: OrderMode) {
    commit({ ...state, mode });
  },
  setAddress(addressId: string) {
    commit({ ...state, addressId });
  },
  setBranch(branchId: string) {
    commit({ ...state, branchId });
  },
  setKitchenNote(kitchenNote: string) {
    commit({ ...state, kitchenNote });
  },
  clear() {
    commit({ ...state, lines: [], promo: null, kitchenNote: "" });
  },
};
