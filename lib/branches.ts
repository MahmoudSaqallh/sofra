/* Branch directory — names, addresses, hours and phones from the Figma Branches page. */

export type Branch = {
  id: string;
  name: string;
  city: "الرياض" | "جدة" | "الدمام";
  address: string;
  phone: string;
  /** Opening/closing as minutes after midnight; close may pass midnight (e.g. 25*60 = 1:00 ص). */
  opens: number;
  closes: number;
  hoursLabel: string;
  tablesTonight: number;
  /** Photo shown in reservation/branch cards. Malqa has no photo in Figma, so it reuses a site photo. */
  image: string;
  /** Pin position on the stylised map (% from top/left). */
  pin: { top: number; left: number };
};

export const branchList: Branch[] = [
  {
    id: "olaya",
    name: "فرع العليا",
    city: "الرياض",
    address: "طريق العليا، حي العليا، الرياض",
    phone: "920012345",
    opens: 7 * 60,
    closes: 25 * 60,
    hoursLabel: "7:00 ص – 1:00 ص",
    tablesTonight: 18,
    image: "/images/interior.png",
    pin: { top: 41, left: 44 },
  },
  {
    id: "malqa",
    name: "فرع الملقا",
    city: "الرياض",
    address: "طريق أنس بن مالك، حي الملقا، الرياض",
    phone: "920012346",
    opens: 7 * 60,
    closes: 25 * 60,
    hoursLabel: "7:00 ص – 1:00 ص",
    tablesTonight: 14,
    image: "/images/breakfast.png",
    pin: { top: 23, left: 72 },
  },
  {
    id: "corniche",
    name: "فرع الكورنيش",
    city: "جدة",
    address: "طريق الكورنيش، حي الشاطئ، جدة",
    phone: "920012347",
    opens: 7 * 60,
    closes: 26 * 60,
    hoursLabel: "7:00 ص – 2:00 ص",
    tablesTonight: 9,
    image: "/images/chef.png",
    pin: { top: 62, left: 21 },
  },
  {
    id: "shati",
    name: "فرع الشاطئ",
    city: "الدمام",
    address: "طريق الخليج، الدمام",
    phone: "920012348",
    opens: 8 * 60,
    closes: 24 * 60,
    hoursLabel: "8:00 ص – 12:00 ص",
    tablesTonight: 12,
    image: "/images/arabic-coffee.png",
    pin: { top: 83, left: 83 },
  },
];

export const cities = ["الرياض", "جدة", "الدمام"] as const;

export function getBranch(id: string) {
  return branchList.find((b) => b.id === id) ?? branchList[0];
}

/** Minutes since midnight in Riyadh (UTC+3, no DST). */
function riyadhMinutes(now: number) {
  const d = new Date(now + 3 * 3600_000);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

export function branchStatus(branch: Branch, now: number) {
  const m = riyadhMinutes(now);
  const open = (m >= branch.opens && m < branch.closes) || m + 24 * 60 < branch.closes;
  const h = Math.floor(branch.opens / 60);
  return { open, label: open ? "مفتوح الآن" : `مغلق · يفتح ${h}:00 ص` };
}
