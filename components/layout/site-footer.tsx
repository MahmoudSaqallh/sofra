import Link from "next/link";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { contact, footerMenuLinks, footerMobileLinks, footerQuickLinks, type NavLink } from "@/lib/site";

const socials = [
  { label: "إنستغرام", href: "https://instagram.com", icon: "instagram" },
  { label: "الموقع", href: "/", icon: "globe" },
  { label: "البريد", href: `mailto:${contact.email}`, icon: "mail" },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-inverse text-canvas">
      <div className="shell-wide flex flex-col gap-6 pt-10 pb-7 md:gap-14 md:pt-20 md:pb-8">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12 lg:flex lg:items-start lg:justify-between">
          <div className="flex flex-col items-start gap-5 md:max-w-[340px]">
            <Logo size="lg" />
            <p className="text-body-s md:max-w-[320px]">
              <span className="md:hidden">مطعم عربي معاصر يقدّم الفطور والغداء والعشاء بلمسة ضيافة فاخرة.</span>
              <span className="hidden md:inline">
                مطعم عربي معاصر يقدّم الفطور والغداء والعشاء بلمسة ضيافة فاخرة منذ 2012.
              </span>
            </p>
            {/* Mobile footer: single wrapped link row (Figma 390 frame) */}
            <ul className="flex flex-wrap gap-x-5 gap-y-3 md:hidden">
              {footerMobileLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-label-m font-medium hover:text-accent-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Socials />
          </div>

          <LinkColumn title="روابط سريعة" links={footerQuickLinks} />
          <LinkColumn title="القائمة" links={footerMenuLinks} />

          <div className="hidden flex-col items-start gap-3.5 md:flex">
            <h2 className="text-label-l font-medium text-accent-light">تواصل معنا</h2>
            <ContactRow icon={<Phone size={16} strokeWidth={1.75} />} href={contact.phoneHref}>
              <span dir="ltr">{contact.phone}</span>
            </ContactRow>
            <ContactRow icon={<Mail size={16} strokeWidth={1.75} />} href={`mailto:${contact.email}`}>
              {contact.email}
            </ContactRow>
            <ContactRow icon={<MapPin size={16} strokeWidth={1.75} />}>{contact.address}</ContactRow>
          </div>
        </div>

        <hr className="border-0 border-t border-white/12" />

        <div className="flex flex-col gap-2 text-caption md:flex-row md:items-center md:justify-between">
          <p className="text-accent-light md:text-canvas">© 2026 مطاعم سُفرة. جميع الحقوق محفوظة.</p>
          <p className="hidden text-accent-light md:block">
            <Link href="/privacy" className="hover:underline">
              سياسة الخصوصية
            </Link>
            {" · "}
            <Link href="/terms" className="hover:underline">
              الشروط والأحكام
            </Link>
            {" · "}الرقم الضريبي 300012345600003
          </p>
        </div>
      </div>
    </footer>
  );
}

function LinkColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div className="hidden flex-col items-start gap-3.5 md:flex">
      <h2 className="text-label-l font-medium text-accent-light">{title}</h2>
      <ul className="flex flex-col gap-3.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-body-s transition-colors hover:text-accent-light">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactRow({ icon, href, children }: { icon: React.ReactNode; href?: string; children: React.ReactNode }) {
  const content = (
    <>
      <span aria-hidden className="text-accent-light">
        {icon}
      </span>
      <span className="text-body-s">{children}</span>
    </>
  );
  return href ? (
    <a href={href} className="flex items-center gap-2.5 transition-colors hover:text-accent-light">
      {content}
    </a>
  ) : (
    <p className="flex items-center gap-2.5">{content}</p>
  );
}

function Socials() {
  return (
    <ul className="flex items-center gap-2.5">
      {socials.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            aria-label={s.label}
            {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="flex size-10 items-center justify-center rounded-full border border-accent-line text-accent-light transition-colors hover:bg-white/8"
          >
            {s.icon === "instagram" ? (
              // Original Figma asset — Lucide 1.x no longer ships brand icons.
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/icons/instagram.svg" alt="" width={16.3125} height={16.3125} />
            ) : s.icon === "globe" ? (
              <Globe size={18} strokeWidth={1.75} aria-hidden />
            ) : (
              <Mail size={18} strokeWidth={1.75} aria-hidden />
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
