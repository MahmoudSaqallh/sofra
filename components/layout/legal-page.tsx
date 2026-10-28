import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { contact } from "@/lib/site";

/**
 * Footer legal pages. Not designed in Figma: they reuse the canvas page + Heading/Body type styles,
 * and only state rules the site itself applies (no invented legal terms).
 */
export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { heading: string; body: ReactNode }[] }) {
  return (
    <article className="shell flex max-w-[860px] flex-col gap-8 py-10 md:py-16">
      <div className="flex flex-col gap-3">
        <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: title }]} />
        <h1 className="font-display text-h1 font-bold text-brand md:text-display-m">{title}</h1>
        <p className="text-caption text-muted">آخر تحديث: {updated}</p>
      </div>
      {sections.map((s) => (
        <section key={s.heading} className="flex flex-col gap-2">
          <h2 className="font-display text-h3 font-semibold text-brand">{s.heading}</h2>
          <div className="flex flex-col gap-2 text-body-m text-ink">{s.body}</div>
        </section>
      ))}
      <p className="rounded-2xl bg-subtle p-5 text-body-s text-muted">
        لأي استفسار راسلنا على{" "}
        <a href={`mailto:${contact.email}`} className="font-medium text-brand hover:underline">
          {contact.email}
        </a>{" "}
        أو اتصل بنا على <span dir="ltr">{contact.phone}</span>.
      </p>
    </article>
  );
}
