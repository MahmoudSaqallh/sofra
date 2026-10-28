"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Full-screen routes (the Figma Sign In frame) have no site header/footer.
const CHROMELESS = ["/sign-in"];

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return CHROMELESS.includes(pathname) ? null : children;
}
