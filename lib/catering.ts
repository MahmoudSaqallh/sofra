// Content for the Catering page (Figma "Catering" 51:3614). RTL order: first item sits on the right.

export const services = [
  { title: "الغرف الخاصة", text: "غرف أنيقة في فروعنا مع قائمة مخصصة ومضيف خاص.", badge: "حتى 24 ضيفاً", image: "/images/interior.png" },
  { title: "ضيافة الشركات", text: "غداء عمل، اجتماعات، ومؤتمرات بتقديم احترافي في موقعك.", badge: "من 20 إلى 500", image: "/images/grill.png" },
  { title: "السُفر العائلية", text: "سُفر جاهزة للمنازل في الأعياد والمناسبات العائلية.", badge: "من 6 أشخاص", image: "/images/mansaf.png" },
  { title: "ركن القهوة والتمر", text: "ركن ضيافة عربية مع مضيفين في مناسباتكم.", badge: "بالساعة", image: "/images/arabic-coffee.png" },
];

export type PackageId = "basic" | "premium" | "luxury";

export const packages: { id: PackageId; name: string; tagline: string; price: number; features: string[]; featured?: boolean }[] = [
  {
    id: "basic",
    name: "باقة الأساسية",
    tagline: "مثالية لغداء العمل والاجتماعات",
    price: 95,
    features: ["طبق رئيسي من اختيارك", "سلطتان ومقبلات", "مشروبات باردة", "تقديم بوفيه"],
  },
  {
    id: "premium",
    name: "باقة المميزة",
    tagline: "الأكثر طلباً للمناسبات العائلية",
    price: 165,
    features: ["تشكيلة مشاوي على الفحم", "4 مقبلات و3 سلطات", "حلويات شرقية", "قهوة عربية وتمر", "مضيف لكل 15 ضيفاً"],
    featured: true,
  },
  {
    id: "luxury",
    name: "باقة الفاخرة",
    tagline: "لحفلات الزفاف والمناسبات الكبرى",
    price: 260,
    features: ["قائمة بإشراف رئيس الطهاة", "محطة شواء حية", "بوفيه حلويات كامل", "ركن قهوة مختصة", "تنسيق طاولات وزهور"],
  },
];

export const eventTypes = [
  { value: "family", label: "مناسبة عائلية" },
  { value: "corporate", label: "شركة" },
  { value: "wedding", label: "زفاف" },
  { value: "other", label: "أخرى" },
] as const;

export type EventType = (typeof eventTypes)[number]["value"];

// Figma shows one value ("40 – 60 ضيفاً"); the other brackets are spread across the 20–500 range stated on the services card.
export const guestRanges = [
  { value: "6-20", label: "6 – 20 ضيفاً", min: 6, max: 20 },
  { value: "20-40", label: "20 – 40 ضيفاً", min: 20, max: 40 },
  { value: "40-60", label: "40 – 60 ضيفاً", min: 40, max: 60 },
  { value: "60-100", label: "60 – 100 ضيف", min: 60, max: 100 },
  { value: "100-250", label: "100 – 250 ضيفاً", min: 100, max: 250 },
  { value: "250-500", label: "250 – 500 ضيف", min: 250, max: 500 },
];

// Figma shows "في المنزل — حي النرجس"; the remaining venue types are the ones the services section mentions.
export const venues = [
  { value: "home", label: "في المنزل" },
  { value: "office", label: "مقر الشركة" },
  { value: "hall", label: "قاعة مناسبات" },
  { value: "private-room", label: "غرفة خاصة في أحد فروعنا" },
];

export const addOns = [
  { id: "grill-station", label: "محطة شواء حية" },
  { id: "coffee-corner", label: "ركن قهوة وتمر" },
  { id: "flowers", label: "تنسيق وزهور" },
];

export const clients = ["شركة رؤى", "شركة مدار", "شركة نخيل", "شركة أفق", "شركة تمكين", "شركة وجهة"];
