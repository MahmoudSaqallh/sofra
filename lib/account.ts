/*
 * Demo customer used by Checkout and My Account until real authentication exists.
 * Every value comes from the Figma frames (name, saved addresses, loyalty balance).
 */
export const demoCustomer = {
  name: "نورة العتيبي",
  firstName: "نورة",
  initials: "نع",
  phone: "0551 234 567",
  email: "noura@example.com",
  points: 420,
  memberSince: 2021,
  addresses: [
    { id: "home", label: "المنزل", line: "حي الملقا، شارع أنس بن مالك، فيلا 12", icon: "home" as const },
    { id: "work", label: "العمل", line: "برج المملكة، الطابق 21، مكتب 2104", icon: "store" as const },
  ],
};

/** "كل 500 نقطة = 50 ر.س" */
export const POINTS_REDEEM = { points: 500, value: 50 };

export type PastOrder = {
  id: string;
  dateLabel: string;
  branch: string;
  modeLabel: string;
  status: "delivered" | "cancelled";
  total: number;
  items: { slug: string; qty: number }[];
};

/*
 * The demo customer's order history from the Figma "My Account" frame (ids, dates, branches, totals, photos).
 * Figma only shows photos and a dish count, so the exact dishes and quantities behind each order are an assumption.
 */
export const pastOrders: PastOrder[] = [
  {
    id: "A-2031",
    dateLabel: "الخميس، 22 أكتوبر 2026",
    branch: "فرع العليا",
    modeLabel: "توصيل",
    status: "delivered",
    total: 296,
    items: [
      { slug: "sufra-mixed-grill", qty: 1 },
      { slug: "lemon-mint", qty: 2 },
      { slug: "pistachio-kunafa", qty: 1 },
    ],
  },
  {
    id: "A-1987",
    dateLabel: "السبت، 17 أكتوبر 2026",
    branch: "فرع الملقا",
    modeLabel: "استلام",
    status: "delivered",
    total: 114,
    items: [
      { slug: "wagyu-truffle-burger", qty: 1 },
      { slug: "lemon-mint", qty: 1 },
    ],
  },
  {
    id: "A-1942",
    dateLabel: "الجمعة، 9 أكتوبر 2026",
    branch: "فرع العليا",
    modeLabel: "في المطعم",
    status: "delivered",
    total: 612,
    items: [
      { slug: "baladi-mansaf", qty: 2 },
      { slug: "fattoush-halloumi", qty: 1 },
      { slug: "arabic-coffee", qty: 2 },
      { slug: "chocolate-fondant", qty: 2 },
    ],
  },
  {
    id: "A-1901",
    dateLabel: "الأربعاء، 30 سبتمبر 2026",
    branch: "فرع العليا",
    modeLabel: "توصيل",
    status: "cancelled",
    total: 64,
    items: [{ slug: "pizza-napoletana", qty: 1 }],
  },
];
