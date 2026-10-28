/** Date/time option builders shared by reservations and scheduled orders. Call only in the browser. */

const dateFormatter = new Intl.DateTimeFormat("ar-u-nu-latn-ca-gregory", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function upcomingDates(days: number, from = new Date()) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { value, label: dateFormatter.format(d) };
  });
}

export function formatTimeLabel(h24: number, m: number) {
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const period = h24 < 12 ? "صباحاً" : h24 < 15 ? "ظهراً" : "مساءً";
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/** Compact slot label used on time chips: "8:30 م" / "10:00 ص". */
export function shortTimeLabel(minutes: number) {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h24 < 12 ? "ص" : "م"}`;
}

/** 30-minute slots across opening hours (7:00 ص – 1:00 ص); last slot 12:30 ص. */
export const timeOptions = Array.from({ length: 36 }, (_, i) => {
  const minutes = 7 * 60 + i * 30;
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return { value: `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`, label: formatTimeLabel(h24, m) };
});
