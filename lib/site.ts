import { branchList } from "@/lib/branches";

export type NavLink = { label: string; href: string };

// Routes match the page frames in the Figma file (Menu, Reservations, Branches, …).
export const mainNav: NavLink[] = [
  { label: "الرئيسية", href: "/" },
  { label: "القائمة", href: "/menu" },
  { label: "الحجوزات", href: "/reservations" },
  { label: "الفروع", href: "/branches" },
  { label: "عن سُفرة", href: "/about" },
  { label: "تواصل معنا", href: "/contact" },
];

export const footerQuickLinks: NavLink[] = [
  { label: "القائمة", href: "/menu" },
  { label: "الحجوزات", href: "/reservations" },
  { label: "الفروع", href: "/branches" },
  { label: "العروض", href: "/offers" },
  { label: "بطاقات الهدايا", href: "/offers" },
];

export const footerMenuLinks: NavLink[] = [
  { label: "الفطور", href: "/menu?category=breakfast" },
  { label: "المشاوي", href: "/menu?category=grills" },
  { label: "البرجر والبيتزا", href: "/menu?category=burgers" },
  { label: "الحلويات", href: "/menu?category=desserts" },
  { label: "المشروبات", href: "/menu?category=drinks" },
];

// Compact link row used by the mobile footer.
export const footerMobileLinks: NavLink[] = [
  { label: "القائمة", href: "/menu" },
  { label: "الحجوزات", href: "/reservations" },
  { label: "الفروع", href: "/branches" },
  { label: "العروض", href: "/offers" },
  { label: "تواصل معنا", href: "/contact" },
];

export const contact = {
  phone: "920 012 345",
  phoneHref: "tel:920012345",
  email: "hello@sufra.sa",
  address: "طريق العليا، الرياض 12214",
};

export const branches = branchList.map((b) => ({ id: b.id, label: `${b.name} — ${b.city}` }));

export const contactChannels = {
  unified: { label: "الرقم الموحّد", value: "920012345", href: "tel:920012345", note: "يومياً من 9 ص حتى 12 م" },
  email: { label: "البريد الإلكتروني", value: "hello@sufra.sa", href: "mailto:hello@sufra.sa", note: "للاستفسارات العامة والشراكات" },
  events: { label: "الضيافة والمناسبات", value: "events@sufra.sa", href: "mailto:events@sufra.sa", note: "طلبات الشركات والمناسبات الكبيرة" },
  hq: { label: "المقر الرئيسي", value: "طريق العليا، الرياض 12214", note: "الأحد – الخميس، 9 ص – 5 م" },
};
