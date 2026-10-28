import type { Metadata } from "next";
import { AccountView } from "@/components/account/account-view";

export const metadata: Metadata = {
  title: "حسابي",
  description: "طلباتك ونقاط الولاء وعناوينك وأطباقك المفضلة في سُفرة.",
  robots: { index: false },
};

// Figma "My Account" (49:3097). The account lives in this browser (demo session), so the view renders client-side.
export default function AccountPage() {
  return <AccountView />;
}
