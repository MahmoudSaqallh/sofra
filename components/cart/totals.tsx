import { formatPrice } from "@/lib/menu";
import { cn } from "@/lib/cn";

type Props = {
  subtotal: number;
  delivery: number;
  freeDelivery: boolean;
  showDelivery: boolean;
  discount: number;
  promo: string | null;
  vat: number;
  total: number;
  compact?: boolean;
};

// Figma "Order summary" rows: subtotal, delivery, discount, VAT 15%, rule, total.
export function Totals({ subtotal, delivery, freeDelivery, showDelivery, discount, promo, vat, total, compact }: Props) {
  const label = compact ? "text-body-s" : "text-body-m";
  return (
    <dl className={cn("flex flex-col", compact ? "gap-3" : "gap-5")}>
      <Row label="المجموع الفرعي" value={formatPrice(subtotal)} labelClass={label} />
      {showDelivery && (
        <Row
          label={compact ? "التوصيل" : "رسوم التوصيل"}
          value={freeDelivery || delivery === 0 ? "مجاناً" : formatPrice(delivery)}
          valueClass={freeDelivery || delivery === 0 ? "text-success" : undefined}
          labelClass={label}
        />
      )}
      {discount > 0 && (
        <Row
          label={compact ? "الخصم" : `خصم ${promo}`}
          value={`-${formatPrice(discount)}`}
          valueClass="text-success"
          labelClass={label}
        />
      )}
      <Row label={compact ? "الضريبة 15٪" : "ضريبة القيمة المضافة 15٪"} value={formatPrice(vat)} labelClass={label} />
      <div className="h-px bg-track" />
      <div className="flex items-center justify-between">
        <dt className="text-label-l font-medium text-ink">الإجمالي</dt>
        <dd className="text-number-l font-semibold text-brand">{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}

function Row({
  label,
  value,
  valueClass,
  labelClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
  labelClass?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className={cn("text-muted", labelClass)}>{label}</dt>
      <dd className={cn("text-label-m font-medium text-ink", valueClass)}>{value}</dd>
    </div>
  );
}

export function PaymentBadges() {
  return (
    <ul aria-label="طرق الدفع المقبولة" className="flex flex-wrap items-center justify-center gap-2">
      {["مدى", "Apple Pay", "VISA", "Mastercard", "STC Pay"].map((p) => (
        <li key={p} className="rounded-md border border-line px-2 py-1 text-label-s font-medium text-muted">
          {p}
        </li>
      ))}
    </ul>
  );
}
