import type { OrderMode } from "@/lib/cart";

/* Orders placed from Checkout, kept in localStorage until there is a backend. */

export type OrderRecord = {
  id: string;
  createdAt: string;
  mode: OrderMode;
  destination: { title: string; line: string };
  schedule: { asap: true } | { asap: false; dateLabel: string; timeLabel: string };
  payment: string;
  items: { slug: string; name: string; image: string; qty: number; label: string; total: number }[];
  subtotal: number;
  discount: number;
  delivery: number;
  vat: number;
  total: number;
  points: number;
  etaMinutes: [number, number];
  cancelledAt?: string;
};

const KEY = "sufra-orders-v1";

export function readOrders(): OrderRecord[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OrderRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: OrderRecord) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify([order, ...readOrders()].slice(0, 20)));
  } catch {
    // Storage blocked: the confirmation still shows for this session via the URL id.
  }
}

export function updateOrder(id: string, patch: Partial<OrderRecord>) {
  try {
    const next = readOrders().map((o) => (o.id === id ? { ...o, ...patch } : o));
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

/* ----------------------------------------------------------------------------
 * Simulated lifecycle (no backend): stage times are proportional to the ETA,
 * matching the Figma example (7:42 received → 7:45 preparing → 8:08 ready →
 * 8:12 on the way → 8:24 delivered for a 42-minute order).
 * ------------------------------------------------------------------------- */

export type StageKey = "received" | "preparing" | "ready" | "on-the-way" | "delivered";

export function orderStages(order: OrderRecord) {
  const start = new Date(order.createdAt).getTime();
  const eta = ((order.etaMinutes[0] + order.etaMinutes[1]) / 2) * 60_000;
  const delivery = order.mode === "delivery";
  const at = (fraction: number) => new Date(start + eta * fraction);
  const all: { key: StageKey; title: string; detail: string; at: Date }[] = [
    { key: "received", title: "تم استلام الطلب", detail: "الفرع وافق على طلبك", at: at(0) },
    { key: "preparing", title: "قيد التحضير", detail: "الشيف يحضّر طلبك الآن", at: at(0.07) },
    {
      key: "ready",
      title: delivery ? "جاهز للتوصيل" : "جاهز للاستلام",
      detail: delivery ? "تم التغليف والختم الحراري" : "طلبك بانتظارك في الفرع",
      at: at(delivery ? 0.62 : 0.85),
    },
    ...(delivery
      ? [{ key: "on-the-way" as const, title: "في الطريق إليك", detail: "حسن في طريقه إليك", at: at(0.71) }]
      : []),
    {
      key: "delivered",
      title: delivery ? "تم التوصيل" : order.mode === "pickup" ? "تم الاستلام" : "تم التقديم",
      detail: "استمتع بوجبتك!",
      at: at(1),
    },
  ];
  return { stages: all, start, end: start + eta };
}

export function findOrder(id: string) {
  return readOrders().find((o) => o.id === id);
}

export function newOrderId() {
  return `SF-${Math.floor(10000 + Math.random() * 90000)}`;
}
