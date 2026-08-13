import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/reveal";
import { PageHero, Section } from "@/components/site/primitives";
import { legalPages } from "@/content/pages";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/merchant-policies")({
  head: () =>
    buildSeoMeta({
      title: "Merchant Policies",
      description: "Merchant policies and payment information for Career Source Group.",
      path: "/merchant-policies",
    }),
  component: MerchantPoliciesPage,
});

function MerchantPoliciesPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title={legalPages.merchant.title} />

      <Section>
        <div className="max-w-3xl">
          <Reveal>
            <div className="space-y-0 overflow-hidden rounded-md border border-border">
              {legalPages.merchant.rows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-4 border-b border-border/70 bg-card p-6 last:border-0 md:grid-cols-[1fr_1.5fr]"
                >
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-gold">
                    {label}
                  </p>
                  <p className="text-[1.02rem] leading-relaxed text-muted-foreground">{value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
