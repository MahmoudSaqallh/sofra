import { toast } from "sonner";
import { Heart } from "lucide-react";

/*
 * App notifications, shown with the Sonner toast library (<Toaster /> in the root layout).
 * `notify()` keeps one call shape for every action; links navigate client-side via the navigator the Toaster registers.
 */

export type NotificationTone = "success" | "info" | "error" | "favorite";

export type NotificationInput = {
  title: string;
  description?: string;
  tone?: NotificationTone;
  /** Dish photo shown as the toast icon. */
  image?: string;
  action?: { label: string; href: string } | { label: string; onClick: () => void };
};

let navigate: (href: string) => void = (href) => window.location.assign(href);

/** Called by <Toaster /> with the App Router's push, so toast links don't reload the page. */
export function setNavigator(fn: (href: string) => void) {
  navigate = fn;
}

export function notify({ title, description, tone = "success", image, action }: NotificationInput) {
  const options = {
    description,
    icon: image ? (
      // eslint-disable-next-line @next/next/no-img-element -- tiny local thumbnail inside the toast icon slot
      <img src={image} alt="" width={36} height={36} className="size-9 rounded-lg object-cover" />
    ) : tone === "favorite" ? (
      <Heart size={18} strokeWidth={1.75} className="fill-error text-error" />
    ) : undefined,
    action: action
      ? { label: action.label, onClick: () => ("href" in action ? navigate(action.href) : action.onClick()) }
      : undefined,
  };
  if (tone === "error") return toast.error(title, options);
  if (tone === "info") return toast.info(title, options);
  if (tone === "favorite") return toast(title, options);
  return toast.success(title, options);
}
