import { Gift, Globe, Mail, Phone } from "lucide-react";
import { contactChannels } from "@/lib/site";

// Branches page: stacked channel rows (label, value, note) with a forest icon tile.
export function ChannelList() {
  const rows = [
    { ...contactChannels.unified, icon: Phone },
    { ...contactChannels.email, icon: Mail },
    { ...contactChannels.events, icon: Gift },
    { ...contactChannels.hq, icon: Globe, href: undefined },
  ];
  return (
    <ul className="flex flex-col gap-4">
      {rows.map(({ label, value, note, href, icon: Icon }) => {
        const body = (
          <>
            <span className="flex size-[52px] shrink-0 items-center justify-center rounded-2xl bg-brand text-canvas">
              <Icon size={22} strokeWidth={1.75} aria-hidden />
            </span>
            <span className="flex flex-col items-start gap-0.5">
              <span className="text-caption text-muted">{label}</span>
              <span className="text-label-l font-medium text-brand" dir={href ? "ltr" : undefined}>
                {value}
              </span>
              <span className="text-caption text-faint">{note}</span>
            </span>
          </>
        );
        return (
          <li key={label}>
            {href ? (
              <a href={href} className="flex items-center gap-4 rounded-[20px] border border-line bg-surface p-6 transition-colors hover:border-brand">
                {body}
              </a>
            ) : (
              <div className="flex items-center gap-4 rounded-[20px] border border-line bg-surface p-6">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
