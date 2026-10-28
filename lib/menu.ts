import type { LucideIcon } from "lucide-react";
import {
  CakeSlice,
  CupSoda,
  Flame,
  Hamburger,
  Moon,
  Pizza,
  Star,
  Sun,
  Utensils,
} from "lucide-react";

/* ----------------------------------------------------------------------------
 * Taxonomy
 * Chips (home + menu header) mix meal times and dish types, exactly as in Figma.
 * The menu sidebar lists dish types only.
 * ------------------------------------------------------------------------- */

export type Category = {
  slug: string;
  label: string;
  icon: LucideIcon;
};

export const categories: Category[] = [
  { slug: "all", label: "الكل", icon: Star },
  { slug: "breakfast", label: "الفطور", icon: Sun },
  { slug: "lunch", label: "الغداء", icon: Utensils },
  { slug: "dinner", label: "العشاء", icon: Moon },
  { slug: "grills", label: "المشاوي", icon: Flame },
  { slug: "burgers", label: "البرجر", icon: Hamburger },
  { slug: "pizza", label: "البيتزا", icon: Pizza },
  { slug: "desserts", label: "الحلويات", icon: CakeSlice },
  { slug: "drinks", label: "المشروبات", icon: CupSoda },
];

export type DishType =
  | "breakfast"
  | "starters"
  | "grills"
  | "mains"
  | "burgers"
  | "pizza"
  | "desserts"
  | "hot-drinks"
  | "cold-drinks";

export const dishTypes: { slug: DishType; label: string; blurb: string }[] = [
  { slug: "breakfast", label: "الفطور", blurb: "فطور شامي ونجدي ومناقيش من الفرن" },
  { slug: "starters", label: "المقبلات والسلطات", blurb: "مقبلات باردة وسلطات طازجة" },
  { slug: "grills", label: "المشاوي", blurb: "مشوية على فحم السمر الطبيعي" },
  { slug: "mains", label: "الأطباق الرئيسية", blurb: "أطباق عائلية مطهوة ببطء" },
  { slug: "burgers", label: "البرجر", blurb: "لحم طازج يُفرم يومياً" },
  { slug: "pizza", label: "البيتزا", blurb: "عجينة مخمّرة 48 ساعة" },
  { slug: "desserts", label: "الحلويات", blurb: "حلويات شرقية وغربية" },
  { slug: "hot-drinks", label: "المشروبات الساخنة", blurb: "قهوة مختصة وعربية" },
  { slug: "cold-drinks", label: "المشروبات الباردة", blurb: "عصائر ومشروبات منعشة" },
];

type Meal = "breakfast" | "lunch" | "dinner";

/* ----------------------------------------------------------------------------
 * Dishes
 * ------------------------------------------------------------------------- */

export type BadgeTone = "brand" | "gold" | "success" | "info" | "warning" | "error" | "dark";
export type DishBadge = { label: string; tone: BadgeTone };

export type SizeOption = { id: string; label: string; price: number; serves: number };
export type ExtraOption = { id: string; label: string; price: number };

export type Dish = {
  slug: string;
  name: string;
  /** Card description (desktop grid). */
  description: string;
  /** Shorter line for compact horizontal cards (mobile/cart). */
  short: string;
  /** Long description for the dish page. Falls back to `description`. */
  story?: string;
  type: DishType;
  meals: Meal[];
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount?: number;
  prepMinutes: number;
  prepMaxMinutes?: number;
  image: string;
  gallery?: string[];
  badge?: DishBadge;
  extraBadges?: DishBadge[];
  diet: { vegetarian?: boolean; glutenFree?: boolean; lowCalorie?: boolean; spicy?: boolean; family?: boolean };
  /** Sort weight for "الأكثر طلباً". */
  popularity: number;
  sizes?: SizeOption[];
  extras?: { max: number; options: ExtraOption[] };
  ingredients?: string[];
  calories?: number;
  serves?: number;
  halal?: boolean;
};

export const dishes: Dish[] = [
  {
    slug: "sufra-mixed-grill",
    name: "مشاوي سُفرة المشكّلة",
    description: "كباب لحم، شيش طاووق، ريش غنم، أرز بالزعفران.",
    short: "كباب، شيش طاووق، ريش، أرز بالزعفران",
    story:
      "تشكيلة الشيف من أجود المشاوي على فحم السمر: كباب لحم بلدي، شيش طاووق متبّل بالزعفران، ريش غنم، وكفتة بالبقدونس. تُقدّم مع أرز بالزعفران، خضار مشوية، خبز التنور، حمص وثومية.",
    type: "grills",
    meals: ["lunch", "dinner"],
    price: 148,
    oldPrice: 172,
    rating: 4.9,
    reviewCount: 1284,
    prepMinutes: 25,
    prepMaxMinutes: 30,
    image: "/images/grill.png",
    gallery: ["/images/grill.png", "/images/steak.png", "/images/fattoush.png", "/images/arabic-coffee.png"],
    badge: { label: "الأكثر طلباً", tone: "brand" },
    extraBadges: [{ label: "اختيار الشيف", tone: "gold" }],
    diet: { family: true },
    popularity: 100,
    sizes: [
      { id: "single", label: "لشخص", price: 148, serves: 1 },
      { id: "double", label: "لشخصين", price: 268, serves: 2 },
      { id: "family", label: "عائلي", price: 420, serves: 4 },
    ],
    extras: {
      max: 3,
      options: [
        { id: "toum", label: "ثومية إضافية", price: 6 },
        { id: "bread", label: "خبز تنور إضافي", price: 4 },
        { id: "halloumi", label: "حلوم مشوي", price: 18 },
        { id: "fattoush", label: "سلطة فتوش صغيرة", price: 16 },
      ],
    },
    ingredients: [
      "كباب لحم بلدي",
      "شيش طاووق متبّل بالزعفران",
      "ريش غنم",
      "كفتة بالبقدونس",
      "أرز بالزعفران",
      "خضار مشوية",
      "خبز التنور",
      "حمص",
      "ثومية",
    ],
    calories: 1240,
    serves: 1,
    halal: true,
  },
  {
    slug: "family-grill-platter",
    name: "سُفرة المشاوي العائلية",
    description: "كباب، شيش طاووق، ريش، كفتة، أرز بالزعفران، 4 مقبلات، خبز تنور و4 مشروبات.",
    short: "تكفي 4–6 أشخاص مع المقبلات والمشروبات",
    type: "grills",
    meals: ["lunch", "dinner"],
    price: 420,
    oldPrice: 525,
    rating: 4.9,
    prepMinutes: 35,
    image: "/images/grill.png",
    badge: { label: "يكفي 4–6", tone: "brand" },
    extraBadges: [{ label: "اختيار الشيف", tone: "gold" }],
    diet: { family: true },
    popularity: 70,
    serves: 5,
    halal: true,
  },
  {
    slug: "aged-ribeye-300",
    name: "ريبآي معتّق 300غ",
    description: "ستيك ريبآي معتّق 28 يوماً مع بطاطا مشوية وهليون.",
    short: "معتّق 28 يوماً، بطاطا وهليون",
    type: "grills",
    meals: ["dinner"],
    price: 189,
    rating: 4.9,
    prepMinutes: 25,
    image: "/images/steak.png",
    badge: { label: "اختيار الشيف", tone: "gold" },
    diet: { glutenFree: true },
    popularity: 80,
    halal: true,
  },
  {
    slug: "shish-tawook",
    name: "شيش طاووق",
    description: "صدور دجاج متبّلة بالزعفران والليمون مع ثومية.",
    short: "دجاج بالزعفران والليمون مع ثومية",
    type: "grills",
    meals: ["lunch", "dinner"],
    price: 68,
    rating: 4.9,
    prepMinutes: 25,
    image: "/images/grill.png",
    diet: { glutenFree: true, lowCalorie: true },
    popularity: 75,
    halal: true,
  },
  {
    slug: "baladi-mansaf",
    name: "منسف لحم بلدي",
    description: "لحم غنم بلدي مطهو ببطء، جميد كركي، أرز ولوز محمّص.",
    short: "لحم غنم، جميد كركي، لوز محمّص",
    type: "mains",
    meals: ["lunch"],
    price: 165,
    rating: 4.9,
    prepMinutes: 25,
    image: "/images/mansaf.png",
    badge: { label: "يكفي شخصين", tone: "dark" },
    diet: { family: true },
    popularity: 85,
    serves: 2,
    halal: true,
  },
  {
    slug: "fattoush-halloumi",
    name: "فتوش مع حلوم مشوي",
    description: "خضار طازجة، خبز محمّص، دبس رمان وسماق.",
    short: "خضار طازجة ودبس رمان",
    type: "starters",
    meals: ["lunch", "dinner"],
    price: 38,
    rating: 4.9,
    prepMinutes: 15,
    image: "/images/fattoush.png",
    badge: { label: "نباتي", tone: "success" },
    diet: { vegetarian: true, lowCalorie: true },
    popularity: 60,
  },
  {
    slug: "small-fattoush",
    name: "فتوش صغير",
    description: "خضار طازجة، خبز محمّص، دبس رمان وسماق.",
    short: "خضار طازجة ودبس رمان",
    type: "starters",
    meals: ["lunch", "dinner"],
    price: 22,
    rating: 4.8,
    prepMinutes: 10,
    image: "/images/fattoush.png",
    badge: { label: "نباتي", tone: "success" },
    diet: { vegetarian: true, lowCalorie: true },
    popularity: 40,
  },
  {
    slug: "wagyu-truffle-burger",
    name: "برجر واغيو بالترافل",
    description: "لحم واغيو، شيدر معتّق، بصل مكرمل، صوص الترافل.",
    short: "واغيو، شيدر معتّق، صوص الترافل",
    type: "burgers",
    meals: ["lunch", "dinner"],
    price: 78,
    rating: 4.9,
    prepMinutes: 25,
    image: "/images/burger.png",
    badge: { label: "جديد", tone: "info" },
    diet: { spicy: true },
    popularity: 90,
    halal: true,
  },
  {
    slug: "pizza-napoletana",
    name: "بيتزا نابوليتانا",
    description: "عجينة مخمّرة 48 ساعة، موزاريلا طازجة وريحان.",
    short: "عجينة 48 ساعة، موزاريلا وريحان",
    type: "pizza",
    meals: ["lunch", "dinner"],
    price: 64,
    rating: 4.9,
    prepMinutes: 25,
    image: "/images/pizza.png",
    badge: { label: "نباتي", tone: "success" },
    diet: { vegetarian: true },
    popularity: 78,
  },
  {
    slug: "shami-breakfast",
    name: "فطور شامي",
    description: "حمص، فول، لبنة، مناقيش من الفرن.",
    short: "حمص، فول، لبنة، مناقيش",
    type: "breakfast",
    meals: ["breakfast"],
    price: 56,
    rating: 4.9,
    prepMinutes: 20,
    image: "/images/breakfast.png",
    diet: { vegetarian: true, family: true },
    popularity: 72,
  },
  {
    slug: "pistachio-kunafa",
    name: "كنافة بالفستق",
    description: "كنافة ناعمة بالقشطة، فستق حلبي وماء الورد.",
    short: "قشطة، فستق حلبي، ماء الورد",
    type: "desserts",
    meals: ["lunch", "dinner"],
    price: 42,
    rating: 4.9,
    prepMinutes: 25,
    image: "/images/kunafa.png",
    badge: { label: "اختيار الشيف", tone: "gold" },
    diet: { vegetarian: true },
    popularity: 82,
  },
  {
    slug: "chocolate-fondant",
    name: "فوندان الشوكولاتة",
    description: "قلب ذائب مع آيس كريم فانيلا.",
    short: "قلب ذائب مع آيس كريم فانيلا",
    type: "desserts",
    meals: ["lunch", "dinner"],
    price: 36,
    rating: 4.8,
    prepMinutes: 15,
    image: "/images/chocolate-fondant.png",
    diet: { vegetarian: true },
    popularity: 55,
  },
  {
    slug: "arabic-coffee",
    name: "قهوة عربية ودلّة",
    description: "هيل وزعفران مع تمر.",
    short: "هيل وزعفران مع تمر",
    type: "hot-drinks",
    meals: ["breakfast", "lunch", "dinner"],
    price: 28,
    rating: 4.9,
    prepMinutes: 10,
    image: "/images/arabic-coffee.png",
    diet: { vegetarian: true, glutenFree: true, lowCalorie: true },
    popularity: 65,
  },
  {
    slug: "lemon-mint",
    name: "ليمون بالنعناع",
    description: "منعش، سكر خفيف.",
    short: "منعش، سكر خفيف",
    type: "cold-drinks",
    meals: ["breakfast", "lunch", "dinner"],
    price: 18,
    rating: 4.8,
    prepMinutes: 5,
    image: "/images/drinks.png",
    diet: { vegetarian: true, glutenFree: true, lowCalorie: true },
    popularity: 68,
  },
];

const bySlug = new Map(dishes.map((d) => [d.slug, d]));

export function getDish(slug: string) {
  return bySlug.get(slug);
}

/** Does a dish match a chip/sidebar filter slug? */
export function dishMatches(dish: Dish, filter: string) {
  if (filter === "all") return true;
  if (filter === "drinks") return dish.type === "hot-drinks" || dish.type === "cold-drinks";
  if (filter === "breakfast" || filter === "lunch" || filter === "dinner") {
    return dish.meals.includes(filter) || dish.type === filter;
  }
  return dish.type === filter;
}

export function filterLabel(filter: string) {
  return (
    categories.find((c) => c.slug === filter)?.label ??
    dishTypes.find((t) => t.slug === filter)?.label ??
    "كل الأطباق"
  );
}

export function filterBlurb(filter: string) {
  return dishTypes.find((t) => t.slug === filter)?.blurb ?? "من الفطور حتى العشاء";
}

/** Home "Menu highlights" — the four cards drawn in Figma, in RTL order. */
export const featuredDishes: Dish[] = ["sufra-mixed-grill", "wagyu-truffle-burger", "pizza-napoletana", "pistachio-kunafa"].map(
  (slug) => bySlug.get(slug)!,
);

export function relatedDishes(dish: Dish, count = 4) {
  return dishes
    .filter((d) => d.slug !== dish.slug && d.slug !== "small-fattoush")
    .sort((a, b) => Number(b.type === dish.type) - Number(a.type === dish.type) || b.popularity - a.popularity)
    .slice(0, count);
}

/* ----------------------------------------------------------------------------
 * Meal times (home)
 * ------------------------------------------------------------------------- */

export type MealTime = {
  slug: Meal;
  name: string;
  hours: string;
  description: string;
  image: string;
};

export const meals: MealTime[] = [
  {
    slug: "breakfast",
    name: "الفطور",
    hours: "7:00 ص – 12:00 م",
    description: "فطور شامي ونجدي، مناقيش من الفرن، وقهوة مختصة.",
    image: "/images/breakfast.png",
  },
  {
    slug: "lunch",
    name: "الغداء",
    hours: "12:00 م – 5:00 م",
    description: "أطباق رئيسية عائلية، مندي ومنسف وسلطات طازجة.",
    image: "/images/mansaf.png",
  },
  {
    slug: "dinner",
    name: "العشاء",
    hours: "6:00 م – 1:00 ص",
    description: "مشاوي على الفحم، ستيك معتّق، وأطباق الشيف الخاصة.",
    image: "/images/steak.png",
  },
];

/* ----------------------------------------------------------------------------
 * Formatting
 * ------------------------------------------------------------------------- */

const whole = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** "148 ر.س" for whole amounts, "362.48 ر.س" otherwise (as in the Figma totals). */
export function formatPrice(value: number) {
  const rounded = Math.round(value * 100) / 100;
  const text = Number.isInteger(rounded) ? whole.format(rounded) : cents.format(rounded);
  return `${text} ر.س`;
}

export function dishCountLabel(n: number) {
  if (n === 0) return "لا توجد أطباق";
  if (n === 1) return "طبق واحد";
  if (n === 2) return "طبقان";
  if (n <= 10) return `${n} أطباق`;
  return `${n} طبقاً`;
}
