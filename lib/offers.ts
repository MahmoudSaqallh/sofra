import type { BadgeTone } from "@/lib/menu";

export type OfferChannel = "delivery" | "dine-in" | "members" | "family";

export type Offer = {
  id: string;
  title: string;
  text: string;
  when: string;
  code: string | null;
  badge: { label: string; tone: BadgeTone };
  image: string;
  channels: OfferChannel[];
  /** What the card button does. */
  action: { kind: "apply"; label: string } | { kind: "link"; label: string; href: string };
};

// Six offer cards from the Figma Offers grid (RTL order: first card on the right).
export const offers: Offer[] = [
  {
    id: "breakfast",
    title: "فطور لشخصين بـ 79 ر.س",
    text: "فطور شامي كامل مع مشروبين ساخنين، يومياً حتى 12 ظهراً.",
    when: "يومياً · 7 ص – 12 م",
    code: "BREAKFAST",
    badge: { label: "الفطور", tone: "info" },
    image: "/images/breakfast.png",
    channels: ["dine-in", "delivery", "family"],
    action: { kind: "apply", label: "استخدم العرض" },
  },
  {
    id: "burger",
    title: "اشترِ برجر واحصل على الثاني مجاناً",
    text: "على جميع أصناف البرجر عند الطلب عبر التطبيق كل ثلاثاء.",
    when: "كل ثلاثاء",
    code: "BURGER11",
    badge: { label: "1+1", tone: "error" },
    image: "/images/burger.png",
    channels: ["delivery"],
    action: { kind: "apply", label: "استخدم العرض" },
  },
  {
    id: "welcome",
    title: "حلى مجاني مع طلبك الأول",
    text: "كنافة بالفستق مجاناً لأول طلب عبر الموقع أو التطبيق.",
    when: "لمرة واحدة",
    code: "WELCOME",
    badge: { label: "هدية", tone: "gold" },
    image: "/images/kunafa.png",
    channels: ["delivery"],
    action: { kind: "apply", label: "استخدم العرض" },
  },
  {
    id: "pizza-night",
    title: "ليلة البيتزا",
    text: "خصم 25٪ على جميع البيتزا بعد الساعة 9 مساءً.",
    when: "يومياً بعد 9 م",
    code: "PIZZANIGHT",
    badge: { label: "-25٪", tone: "warning" },
    image: "/images/pizza.png",
    channels: ["dine-in", "delivery"],
    action: { kind: "apply", label: "استخدم العرض" },
  },
  {
    id: "gold-drink",
    title: "مشروب مجاني للأعضاء الذهبيين",
    text: "مشروب بارد أو ساخن مجاناً مع أي طبق رئيسي.",
    when: "حتى 31 ديسمبر",
    code: "GOLDDRINK",
    badge: { label: "للأعضاء", tone: "dark" },
    image: "/images/drinks.png",
    channels: ["members"],
    action: { kind: "link", label: "مستويات العضوية", href: "#loyalty" },
  },
  {
    id: "free-delivery",
    title: "توصيل مجاني فوق 150 ر.س",
    text: "لكل الطلبات ضمن نطاق 7 كم من الفرع.",
    when: "دائماً",
    code: null,
    badge: { label: "مجاناً", tone: "success" },
    image: "/images/arabic-coffee.png",
    channels: ["delivery"],
    action: { kind: "link", label: "اطلب الآن", href: "/order" },
  },
];

export const loyaltyTiers = [
  {
    id: "bronze",
    name: "برونزي",
    range: "0 – 999 نقطة",
    perks: ["نقطة لكل 10 ر.س", "حلى مجاني في يوم ميلادك", "عروض خاصة بالبريد"],
  },
  {
    id: "silver",
    name: "فضي",
    range: "1,000 – 2,999 نقطة",
    perks: ["نقطة لكل 8 ر.س", "توصيل مجاني دائماً", "أولوية في الحجوزات"],
  },
  {
    id: "gold",
    name: "ذهبي",
    range: "+3,000 نقطة",
    perks: ["نقطة لكل 5 ر.س", "مشروب مجاني مع كل طبق", "دعوات حصرية لتذوّق الأطباق الجديدة", "مضيف شخصي في الحجوزات"],
  },
];

export function tierFor(points: number) {
  return points >= 3000 ? loyaltyTiers[2] : points >= 1000 ? loyaltyTiers[1] : loyaltyTiers[0];
}
