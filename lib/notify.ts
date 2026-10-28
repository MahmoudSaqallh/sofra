import { cartStore, PROMOS, type CartLine } from "@/lib/cart";
import { toggleFavorite } from "@/lib/favorites";
import { dishCountLabel, getDish, type Dish } from "@/lib/menu";
import { notify } from "@/lib/notifications";

/* User actions that should always confirm with a notification, so every entry point says the same thing. */

export function addToCart(dish: Dish, options: { qty?: number; sizeId?: string; extras?: string[]; note?: string } = {}) {
  cartStore.add({ slug: dish.slug, ...options });
  const qty = options.qty ?? 1;
  notify({
    title: "أُضيف إلى السلة",
    description: qty > 1 ? `${dish.name} × ${qty}` : dish.name,
    image: dish.image,
    action: { label: "عرض السلة", href: "/cart" },
  });
}

export function addManyToCart(items: { slug: string; qty?: number }[], title = "أُضيفت الأطباق إلى السلة") {
  items.forEach((i) => cartStore.add({ slug: i.slug, qty: i.qty }));
  const count = items.reduce((n, i) => n + (i.qty ?? 1), 0);
  const first = getDish(items[0]?.slug ?? "");
  notify({ title, description: dishCountLabel(count), image: first?.image, action: { label: "عرض السلة", href: "/cart" } });
}

/** Removes a cart line, with an undo that puts it back (same size, extras and note). */
export function removeLineAndNotify(line: CartLine & { dish: Dish }) {
  cartStore.remove(line.key);
  notify({
    tone: "info",
    title: "أُزيل من السلة",
    description: line.qty > 1 ? `${line.dish.name} × ${line.qty}` : line.dish.name,
    image: line.dish.image,
    action: {
      label: "تراجع",
      onClick: () => cartStore.add({ slug: line.slug, qty: line.qty, sizeId: line.sizeId, extras: line.extras, note: line.note }),
    },
  });
}

export function toggleFavoriteAndNotify(dish: Dish, isFavorite: boolean) {
  toggleFavorite(dish.slug);
  if (isFavorite) {
    notify({
      tone: "info",
      title: "أُزيل من المفضلة",
      description: dish.name,
      action: { label: "تراجع", onClick: () => toggleFavorite(dish.slug) },
    });
  } else {
    notify({
      tone: "favorite",
      title: "أُضيف إلى المفضلة",
      description: dish.name,
      image: dish.image,
      action: { label: "المفضلة", href: "/favorites" },
    });
  }
}

/** Applies a promo code; returns false (and warns) when the code is unknown. */
export function applyPromoAndNotify(code: string, options: { silentError?: boolean } = {}) {
  const normalized = code.trim().toUpperCase();
  if (!cartStore.applyPromo(normalized)) {
    if (!options.silentError) notify({ tone: "error", title: "رمز غير صالح", description: "تأكد من الرمز وحاول مرة أخرى." });
    return false;
  }
  notify({
    tone: "success",
    title: `تم تفعيل الرمز ${normalized}`,
    description: PROMOS[normalized]?.label,
    action: { label: "عرض السلة", href: "/cart" },
  });
  return true;
}

export function clearPromoAndNotify(code: string | null) {
  cartStore.clearPromo();
  notify({ tone: "info", title: "أُزيل رمز الخصم", description: code ?? undefined });
}
