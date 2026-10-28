"use client";

import Image from "next/image";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Beef,
  CakeSlice,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Filter,
  Flame,
  Gift,
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  Utensils,
  X,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Checkbox } from "@/components/ui/checkbox";
import { RangeSlider } from "@/components/ui/range-slider";
import { Button, ButtonLink } from "@/components/ui/button";
import { ErrorHero } from "@/components/ui/error-hero";
import { MenuCard } from "@/components/menu/menu-card";
import { MenuListCard } from "@/components/menu/menu-list-card";
import {
  categories,
  dishCountLabel,
  dishes,
  dishMatches,
  dishTypes,
  filterBlurb,
  filterLabel,
  formatPrice,
  type Dish,
} from "@/lib/menu";
import { cn } from "@/lib/cn";

const PAGE_SIZE = 6;
const PRICE_MIN = Math.floor(Math.min(...dishes.map((d) => d.price)) / 10) * 10;
const PRICE_MAX = Math.ceil(Math.max(...dishes.map((d) => d.price)) / 10) * 10;

const sorts = [
  { value: "popular", label: "الأكثر طلباً" },
  { value: "rating", label: "الأعلى تقييماً" },
  { value: "price-asc", label: "السعر: من الأقل" },
  { value: "price-desc", label: "السعر: من الأعلى" },
] as const;
type Sort = (typeof sorts)[number]["value"];

const diets = [
  { value: "vegetarian", label: "نباتي" },
  { value: "glutenFree", label: "خالٍ من الغلوتين" },
  { value: "lowCalorie", label: "قليل السعرات" },
  { value: "spicy", label: "حار" },
  { value: "family", label: "يناسب العائلة" },
] as const;
type Diet = (typeof diets)[number]["value"];

function useMenuQuery() {
  const params = useSearchParams();
  const category = params.get("category") ?? "all";
  const q = params.get("q") ?? "";
  const sortParam = params.get("sort");
  const sort: Sort = sorts.some((s) => s.value === sortParam) ? (sortParam as Sort) : "popular";
  const diet = (params.get("diet")?.split(",").filter((d) => diets.some((x) => x.value === d)) ?? []) as Diet[];
  const min = Number(params.get("min") ?? PRICE_MIN) || PRICE_MIN;
  const max = Number(params.get("max") ?? PRICE_MAX) || PRICE_MAX;
  const page = Math.max(1, Number(params.get("page") ?? 1) || 1);
  return { params, category, q, sort, diet, price: [min, max] as [number, number], page };
}

export function MenuBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const { params, category, q, sort, diet, price, page } = useMenuQuery();
  const [query, setQuery] = useState(q);
  const [showFilters, setShowFilters] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const sheetRef = useRef<HTMLDialogElement>(null);

  function update(patch: Record<string, string | null>, resetPage = true) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    if (resetPage) next.delete("page");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const setCategory = (slug: string) => update({ category: slug === "all" ? null : slug });
  const toggleDiet = (value: Diet) => {
    const next = diet.includes(value) ? diet.filter((d) => d !== value) : [...diet, value];
    update({ diet: next.length ? next.join(",") : null });
  };
  const setPrice = ([lo, hi]: [number, number]) =>
    update({ min: lo === PRICE_MIN ? null : String(lo), max: hi === PRICE_MAX ? null : String(hi) });
  const clearFilters = () => {
    setQuery("");
    router.replace(pathname, { scroll: false });
  };

  const results = useMemo(() => {
    const needle = q.trim();
    const list = dishes.filter(
      (d) =>
        dishMatches(d, category) &&
        (!needle || d.name.includes(needle) || d.description.includes(needle)) &&
        diet.every((k) => d.diet[k]) &&
        d.price >= price[0] &&
        d.price <= price[1],
    );
    const sorted = [...list];
    if (sort === "popular") sorted.sort((a, b) => b.popularity - a.popularity);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating || b.popularity - a.popularity);
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [category, q, diet, price, sort]);

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const pageItems = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const title = category === "all" ? "كل الأطباق" : filterLabel(category);
  const filtersActive = category !== "all" || q || diet.length > 0 || price[0] !== PRICE_MIN || price[1] !== PRICE_MAX;

  const searchForm = (variant: "desktop" | "mobile") => (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        update({ q: query.trim() || null });
      }}
      className={cn(
        "flex items-center rounded-full border border-line bg-surface",
        variant === "desktop" ? "h-14 w-full max-w-[420px] gap-3 ps-5 pe-2 shadow-sm" : "h-12 flex-1 gap-2.5 px-4",
      )}
    >
      {variant === "mobile" && <Search size={18} strokeWidth={1.75} className="shrink-0 text-faint" aria-hidden />}
      <label htmlFor={`menu-search-${variant}`} className="sr-only">
        ابحث في القائمة
      </label>
      <input
        id={`menu-search-${variant}`}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!e.target.value) update({ q: null });
        }}
        placeholder={variant === "desktop" ? "ابحث عن طبق أو مكوّن…" : "ابحث عن طبق…"}
        className={cn(
          "min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-faint",
          variant === "desktop" ? "text-body-m" : "text-body-s",
        )}
      />
      {variant === "desktop" && (
        <button
          type="submit"
          aria-label="بحث"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-canvas hover:bg-inverse"
        >
          <Search size={18} strokeWidth={1.75} />
        </button>
      )}
    </form>
  );

  const chips = (
    <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:gap-2.5 md:overflow-visible md:px-0">
      {categories.map((c) => {
        const Icon = c.icon;
        const selected = c.slug === category;
        return (
          <li key={c.slug} className={c.slug === "all" ? "hidden md:block" : undefined}>
            <button
              type="button"
              onClick={() => setCategory(c.slug)}
              aria-pressed={selected}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-label-m font-medium whitespace-nowrap transition-colors",
                // On the hero photo the selected chip is gold (Figma), the rest stay white.
                selected ? "bg-accent text-brand" : "border border-line bg-surface text-ink hover:border-accent",
              )}
            >
              <Icon size={18} strokeWidth={1.75} aria-hidden />
              {c.label}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const filterPanel = (
    <>
      <FilterCard>
        <h2 className="px-1 pb-1 text-label-l font-medium text-ink">التصنيفات</h2>
        <ul className="flex flex-col gap-1">
          {dishTypes.map((t) => {
            const count = dishes.filter((d) => d.type === t.slug).length;
            const selected = category === t.slug;
            return (
              <li key={t.slug}>
                <button
                  type="button"
                  onClick={() => setCategory(selected ? "all" : t.slug)}
                  aria-pressed={selected}
                  className={cn(
                    "flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-start transition-colors",
                    selected ? "bg-brand-subtle text-brand" : "text-ink hover:bg-subtle",
                  )}
                >
                  <span className="text-body-s">{t.label}</span>
                  <span className={cn("text-label-s font-medium", selected ? "text-brand" : "text-faint")}>{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </FilterCard>

      <FilterCard className="gap-3.5 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-label-l font-medium text-ink">تفضيلات غذائية</h2>
          {diet.length > 0 && (
            <button type="button" onClick={() => update({ diet: null })} className="text-label-s font-medium text-accent-ink">
              مسح
            </button>
          )}
        </div>
        {diets.map((d) => (
          <Checkbox key={d.value} label={d.label} checked={diet.includes(d.value)} onChange={() => toggleDiet(d.value)} />
        ))}
        <hr className="border-0 border-t border-track" />
        <h2 className="text-label-l font-medium text-ink">نطاق السعر</h2>
        <RangeSlider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={2}
          value={price}
          onChange={setPrice}
          label="نطاق السعر"
          format={formatPrice}
        />
      </FilterCard>
    </>
  );

  return (
    <>
      {/* ---------- Page header (Figma "Page hero" 89:5019: steak photo + forest overlay, nav sits on top on desktop) ---------- */}
      <section className="relative isolate overflow-hidden bg-inverse">
        <Image src="/images/steak.png" alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[rgb(11_32_25/0.82)] md:bg-transparent md:bg-linear-to-r md:from-[rgb(11_32_25/0.55)] md:via-[rgb(11_32_25/0.75)] md:to-[rgb(11_32_25/0.94)]"
        />
        <div className="shell flex flex-col gap-3.5 pt-6 pb-5 md:gap-5 md:pt-14 md:pb-14 lg:pt-36 lg:pb-[72px]">
          <div className="flex flex-col gap-3.5 md:flex-row md:items-end md:justify-between md:gap-8">
            <div className="flex flex-col items-start gap-3">
              <div className="hidden md:block">
                <Breadcrumbs tone="light" items={[{ label: "الرئيسية", href: "/" }, { label: "القائمة" }]} />
              </div>
              <h1 className="font-display text-display-m font-bold text-canvas md:text-display-l">قائمة الطعام</h1>
              <p className="hidden text-body-l text-accent-light md:block">
                أكثر من 180 طبقاً من الفطور حتى العشاء — اطلب للتوصيل أو الاستلام من أقرب فرع.
              </p>
            </div>
            <div className="hidden md:block md:w-[420px]">{searchForm("desktop")}</div>
            <div className="flex items-center gap-2.5 md:hidden">
              {searchForm("mobile")}
              <button
                type="button"
                onClick={() => sheetRef.current?.showModal()}
                aria-label="الفلاتر والترتيب"
                className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-brand text-canvas"
              >
                <Filter size={18} strokeWidth={1.75} />
                {(diet.length > 0 || price[0] !== PRICE_MIN || price[1] !== PRICE_MAX) && (
                  <span className="absolute -top-0.5 -start-0.5 size-3 rounded-full border-2 border-inverse bg-accent" />
                )}
              </button>
            </div>
          </div>
          <nav aria-label="تصنيفات القائمة">{chips}</nav>
        </div>
      </section>

      {/* ---------- Body ---------- */}
      <div className="shell flex gap-10 pt-5 pb-6 md:pt-12 md:pb-24">
        {showFilters && (
          <aside aria-label="الفلاتر" className="hidden w-[272px] shrink-0 flex-col gap-7 lg:flex">
            {filterPanel}
            <div className="flex flex-col items-start gap-2.5 rounded-[20px] bg-inverse p-5">
              <Gift size={26} strokeWidth={1.75} className="text-accent-light" aria-hidden />
              <p className="font-display text-h4 font-semibold text-canvas">توصيل مجاني</p>
              <p className="text-body-s text-accent-light">للطلبات فوق 150 ر.س ضمن نطاق 7 كم.</p>
            </div>
          </aside>
        )}

        <section aria-labelledby="results-title" className="flex min-w-0 flex-1 flex-col gap-7">
          <div className="flex items-end justify-between gap-4 md:items-center">
            <div className="flex flex-col items-start gap-0.5">
              <h2 id="results-title" className="font-display text-h3 font-semibold text-brand md:text-h2">
                {title}
              </h2>
              <p className="text-caption text-faint md:text-body-s md:text-muted">
                {dishCountLabel(results.length)}
                <span className="hidden md:inline"> · {q ? `نتائج البحث عن «${q}»` : filterBlurb(category)}</span>
              </p>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <SortSelect value={sort} onChange={(v) => update({ sort: v === "popular" ? null : v }, false)} />
              <div className="flex gap-1 rounded-full bg-subtle p-1">
                <IconToggle
                  label={showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
                  pressed={showFilters}
                  onClick={() => setShowFilters((v) => !v)}
                  className="hidden lg:flex"
                >
                  <Filter size={18} strokeWidth={1.75} />
                </IconToggle>
                <IconToggle
                  label={view === "grid" ? "عرض كقائمة" : "عرض كشبكة"}
                  pressed={view === "grid"}
                  onClick={() => setView((v) => (v === "grid" ? "list" : "grid"))}
                >
                  {view === "grid" ? <LayoutGrid size={18} strokeWidth={1.75} /> : <List size={18} strokeWidth={1.75} />}
                </IconToggle>
              </div>
            </div>
          </div>

          {results.length === 0 ? (
            // Figma "Error hero" adapted to an empty search: same plate, title and quick links, filter-aware copy.
            <ErrorHero
              headingLevel="h2"
              className="rounded-[28px] bg-surface py-12 md:py-16"
              badge={q ? "لا توجد نتائج للبحث" : "لا توجد أطباق بهذه الفلاتر"}
              title="يبدو أن هذا الطبق ليس في قائمتنا!"
              text={
                q ? (
                  <>
                    لم نجد ما يطابق «{q.trim()}». جرّب اسماً آخر أو تصفّح التصنيفات — أطباقنا المفضلة ما زالت بانتظارك.
                  </>
                ) : (
                  "جرّب تصنيفاً آخر أو وسّع نطاق السعر — أطباقنا المفضلة ما زالت بانتظارك."
                )
              }
              query={q}
              actions={
                <>
                  <Button onClick={clearFilters}>
                    <RotateCcw size={20} strokeWidth={1.75} aria-hidden />
                    مسح البحث والفلاتر
                  </Button>
                  <ButtonLink href="/order" variant="outline">
                    <Utensils size={20} strokeWidth={1.75} aria-hidden />
                    اطلب أونلاين
                  </ButtonLink>
                </>
              }
              linksLabel="أو جرّب:"
              links={[
                { label: "المشاوي", href: "/menu?category=grills", icon: Flame },
                { label: "البرجر", href: "/menu?category=burgers", icon: Beef },
                { label: "الحلويات", href: "/menu?category=desserts", icon: CakeSlice },
                { label: "الفطور", href: "/menu?category=breakfast", icon: Coffee },
              ]}
            />
          ) : (
            <>
              {/* Mobile: grouped horizontal cards */}
              <div className="flex flex-col gap-3 md:hidden">
                <MobileGroups items={results} grouped={category === "all" && !q} title={title} />
              </div>

              {/* Tablet/desktop */}
              <ul
                className={cn(
                  "hidden gap-6 md:grid",
                  view === "grid"
                    ? cn("md:grid-cols-2 xl:gap-10", showFilters ? "xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4")
                    : "md:grid-cols-1 xl:grid-cols-2",
                )}
              >
                {pageItems.map((dish) => (
                  <li key={dish.slug} className="flex">
                    {view === "grid" ? <MenuCard dish={dish} className="w-full" /> : <div className="w-full"><MenuListCard dish={dish} /></div>}
                  </li>
                ))}
              </ul>

              {pages > 1 && (
                <nav aria-label="الصفحات" className="hidden items-center justify-center gap-2 pt-4 md:flex">
                  <PageButton
                    label="الصفحة السابقة"
                    disabled={current === 1}
                    onClick={() => update({ page: String(current - 1) }, false)}
                  >
                    <ChevronRight size={18} strokeWidth={1.75} />
                  </PageButton>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                    <PageButton
                      key={n}
                      label={`الصفحة ${n}`}
                      current={n === current}
                      onClick={() => update({ page: n === 1 ? null : String(n) }, false)}
                    >
                      {n}
                    </PageButton>
                  ))}
                  <PageButton
                    label="الصفحة التالية"
                    disabled={current === pages}
                    onClick={() => update({ page: String(current + 1) }, false)}
                  >
                    <ChevronLeft size={18} strokeWidth={1.75} />
                  </PageButton>
                </nav>
              )}
            </>
          )}
        </section>
      </div>

      {/* ---------- Mobile filter sheet ---------- */}
      <dialog
        ref={sheetRef}
        aria-labelledby="filters-title"
        onClick={(e) => e.target === sheetRef.current && sheetRef.current?.close()}
        className="m-0 mt-auto max-h-[85vh] w-full max-w-none rounded-t-3xl bg-canvas p-0 backdrop:bg-ink/40 md:hidden"
      >
        <div className="flex flex-col gap-5 p-5">
          <div className="flex items-center justify-between">
            <h2 id="filters-title" className="font-display text-h3 font-semibold text-brand">
              الفلاتر والترتيب
            </h2>
            <button
              type="button"
              onClick={() => sheetRef.current?.close()}
              aria-label="إغلاق"
              className="flex size-10 items-center justify-center rounded-full border border-line"
            >
              <X size={20} strokeWidth={1.75} />
            </button>
          </div>
          <SortSelect value={sort} onChange={(v) => update({ sort: v === "popular" ? null : v }, false)} />
          {filterPanel}
          <div className="flex gap-3">
            <Button variant="primary" size="md" fullWidth onClick={() => sheetRef.current?.close()}>
              عرض {dishCountLabel(results.length)}
            </Button>
            {filtersActive && (
              <Button variant="outline" size="md" onClick={clearFilters}>
                مسح
              </Button>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}

function MobileGroups({ items, grouped, title }: { items: Dish[]; grouped: boolean; title: string }) {
  const groups = grouped
    ? dishTypes
        .map((t) => ({ title: t.label, items: items.filter((d) => d.type === t.slug) }))
        .filter((g) => g.items.length > 0)
    : [{ title, items }];
  return groups.map((g, i) => (
    <section key={g.title} aria-label={g.title} className="flex flex-col gap-3">
      {(grouped || i > 0) && (
        <div className="flex items-center justify-between pt-2">
          <h3 className="font-display text-h3 font-semibold text-brand">{g.title}</h3>
          <span className="text-caption text-faint">{dishCountLabel(g.items.length)}</span>
        </div>
      )}
      {g.items.map((dish) => (
        <MenuListCard key={dish.slug} dish={dish} />
      ))}
    </section>
  ));
}

function FilterCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-1 rounded-[20px] border border-line bg-surface p-4", className)}>{children}</div>;
}

function SortSelect({ value, onChange }: { value: Sort; onChange: (v: Sort) => void }) {
  return (
    <label className="relative flex h-11 items-center rounded-full border border-line bg-surface ps-4 pe-10 text-label-m font-medium text-ink">
      <span className="whitespace-nowrap">ترتيب:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Sort)}
        className="cursor-pointer appearance-none bg-transparent ps-1 outline-none"
      >
        {sorts.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} strokeWidth={1.75} className="pointer-events-none absolute end-4" aria-hidden />
    </label>
  );
}

function IconToggle({
  label,
  pressed,
  onClick,
  className,
  children,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "flex size-9 items-center justify-center rounded-full transition-colors",
        pressed ? "bg-surface text-brand shadow-sm" : "text-muted hover:text-brand",
        className,
      )}
    >
      {children}
    </button>
  );
}

function PageButton({
  label,
  current,
  disabled,
  onClick,
  children,
}: {
  label: string;
  current?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={current ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-11 items-center justify-center rounded-full text-label-m font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        current ? "bg-brand text-canvas" : "border border-line bg-surface text-ink hover:border-brand",
      )}
    >
      {children}
    </button>
  );
}
