"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Bell, Heart, Menu, ShoppingBag, User, X } from "lucide-react";
import { sessionStore } from "@/lib/session";
import { useFavorites } from "@/lib/favorites";
import { Logo } from "@/components/ui/logo";
import { notify } from "@/lib/notifications";
import { ButtonLink } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/cn";

/*
 * Figma "Website Nav / Desktop": Transparent theme over the hero photo, Light theme (canvas + bottom border,
 * forest CTA) everywhere else. "Website Nav / Mobile" is the canvas bar on all pages.
 * The nav stays pinned while scrolling; over a hero it turns Light once the page leaves the top.
 */

const SCROLLED_AT = 24;

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export function SiteHeader() {
  const pathname = usePathname();
  // Pages that open with a photo hero use the Transparent nav theme on desktop.
  const overlay = ["/", "/menu", "/reservations", "/branches", "/about", "/contact", "/offers", "/catering"].includes(pathname);
  // The 390 dish and cart frames bring their own top bars — no site header on phones there.
  const isDishPage = /^\/menu\/[^/]+$/.test(pathname) || pathname === "/cart";
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > SCROLLED_AT, () => false);
  const { count } = useCart();
  const favorites = useFavorites().length;
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const light = overlay && !scrolled; // light text on the hero photo (desktop only)
  const iconButton = light ? "bg-white/12 text-canvas hover:bg-white/20" : "border border-line text-ink hover:border-brand hover:text-brand";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-canvas transition-[background-color,box-shadow] duration-300",
        scrolled && "shadow-md",
        overlay
          ? cn("lg:fixed lg:inset-x-0", scrolled ? "lg:bg-canvas" : "lg:bg-transparent")
          : "lg:border-b lg:border-line",
        isDishPage && "max-md:hidden",
      )}
    >
      {/* Mobile / tablet bar */}
      <div className="shell flex h-16 items-center justify-between lg:hidden">
        <Logo size="sm" eager />
        <div className="flex items-center gap-2">
          <BellButton className="size-10 border border-line text-ink" />
          <FavoritesLink count={favorites} className="size-10 border border-line text-ink" />
          <CartLink count={count} className="size-10 border border-line text-ink" />
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            className="flex size-10 items-center justify-center rounded-full border border-line text-ink"
          >
            {open ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel (not drawn in Figma; built from nav tokens) */}
      <nav
        id={menuId}
        aria-label="القائمة الرئيسية"
        hidden={!open}
        className="absolute inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-canvas shadow-md lg:hidden"
      >
        <ul className="shell flex flex-col py-3">
          {[...mainNav, { label: "حسابي", href: "/account" }].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "flex min-h-12 items-center border-b border-line text-label-l font-medium last:border-0",
                  isActive(link.href) ? "text-accent-ink" : "text-ink",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="shell pb-5">
          <ButtonLink href="/reservations" variant="accent" size="md" fullWidth onClick={() => setOpen(false)}>
            احجز طاولة
          </ButtonLink>
        </div>
      </nav>

      {/* Desktop bar */}
      <div className="shell-wide hidden h-[88px] items-center justify-between lg:flex">
        <Logo eager />

        <nav aria-label="القائمة الرئيسية">
          <ul className="flex items-center gap-6 xl:gap-9">
            {mainNav.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex flex-col items-center gap-1 text-label-m font-medium whitespace-nowrap transition-colors",
                      active
                        ? light
                          ? "text-accent-light"
                          : "text-brand"
                        : light
                          ? "text-canvas hover:text-accent-light"
                          : "text-ink hover:text-brand",
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className={cn("h-0.5 w-5 rounded-[2px] bg-accent", active ? "opacity-100" : "opacity-0")}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink href="/reservations" variant={light ? "accent" : "primary"} size="md" className="h-11 px-[22px]">
            احجز طاولة
          </ButtonLink>
          <BellButton className={cn("size-11", iconButton)} />
          <CartLink count={count} className={cn("size-11", iconButton)} />
          <FavoritesLink count={favorites} className={cn("size-11", iconButton)} />
          <AccountLink className={cn("size-11", iconButton)} />
        </div>
      </div>
    </header>
  );
}

// Bell next to «احجز طاولة» (icon only — no notification list). Notifications themselves are Sonner toasts.
function BellButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => notify({ tone: "info", title: "لا توجد إشعارات جديدة", description: "سنُعلمك هنا بكل جديد عن طلباتك وعروضنا." })}
      aria-label="الإشعارات"
      className={cn("flex items-center justify-center rounded-full transition-colors", className)}
    >
      <Bell size={20} strokeWidth={1.75} />
    </button>
  );
}

// Not in the Figma nav: entry point to Sign In / My Account, styled like the cart button.
function AccountLink({ className }: { className?: string }) {
  const signedIn = useSyncExternalStore(sessionStore.subscribe, sessionStore.getSnapshot, sessionStore.getServerSnapshot) !== null;
  return (
    <Link
      href={signedIn ? "/account" : "/sign-in"}
      aria-label={signedIn ? "حسابي" : "تسجيل الدخول"}
      className={cn("flex items-center justify-center rounded-full transition-colors", className)}
    >
      <User size={20} strokeWidth={1.75} />
    </Link>
  );
}

function FavoritesLink({ count, className }: { count: number; className?: string }) {
  return (
    <Link
      href="/favorites"
      aria-label={count > 0 ? `المفضلة (${count})` : "المفضلة"}
      className={cn("relative flex items-center justify-center rounded-full transition-colors", className)}
    >
      <Heart size={20} strokeWidth={1.75} />
      <CountBadge count={count} />
    </Link>
  );
}

function CartLink({ count, className }: { count: number; className?: string }) {
  return (
    <Link
      href="/cart"
      aria-label={count > 0 ? `السلة، ${count} أصناف` : "السلة"}
      className={cn("relative flex items-center justify-center rounded-full transition-colors", className)}
    >
      <ShoppingBag size={20} strokeWidth={1.75} />
      <CountBadge count={count} />
    </Link>
  );
}

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      aria-hidden
      className="absolute -top-0.5 -start-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-label-s font-medium text-brand"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
