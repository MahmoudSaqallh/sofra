import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { BranchDirectory } from "@/components/branches/branch-directory";
import { ChannelList } from "@/components/contact/channel-list";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "الفروع",
  description: "12 فرعاً في الرياض وجدة والدمام، جميعها تستقبلكم من الفطور حتى منتصف الليل.",
};

export default function BranchesPage() {
  return (
    <>
      <PageHero
        crumb="الفروع"
        title="فروعنا في المملكة"
        lead="12 فرعاً في الرياض وجدة والدمام، جميعها تستقبلكم من الفطور حتى منتصف الليل."
        image="/images/arabic-coffee.png"
        imageAlt="تقديم القهوة العربية في سُفرة"
      />
      <div className="shell flex flex-col gap-12 pt-8 pb-16 md:pt-14 md:pb-24">
        <BranchDirectory />

        <section aria-labelledby="contact-title" className="flex flex-col gap-6 pt-4 lg:flex-row lg:items-start lg:gap-8 lg:pt-12">
          <div className="flex flex-1 flex-col gap-5 rounded-[28px] border border-line bg-surface p-6 md:p-10">
            <div className="flex flex-col items-start gap-1.5">
              <h2 id="contact-title" className="font-display text-h1 font-bold text-brand md:text-display-m">
                تواصل معنا
              </h2>
              <p className="text-body-m text-muted">للاستفسارات، الطلبات الكبيرة، أو التعاون — نرد خلال ساعتين في أوقات العمل.</p>
            </div>
            <ContactForm variant="compact" />
          </div>
          <div className="lg:w-[468px] lg:shrink-0">
            <ChannelList />
          </div>
        </section>
      </div>
    </>
  );
}
