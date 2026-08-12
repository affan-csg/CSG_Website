import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/reveal";
import { PageHero, Section } from "@/components/site/primitives";
import { legalPages } from "@/content/pages";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/legal-notice")({
  head: () =>
    buildSeoMeta({
      title: "Legal Notice",
      description: "Legal notice and company information for Career Source Group.",
      path: "/legal-notice"
    }),
  component: LegalNoticePage,
});

function LegalNoticePage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={legalPages.legalNotice.title}
      />

      <Section>
        <div className="max-w-3xl">
          <Reveal>
            <div className="space-y-0 overflow-hidden rounded-md border border-border">
              {legalPages.legalNotice.rows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-4 border-b border-border/70 bg-card p-6 last:border-0 md:grid-cols-[1fr_1.5fr]"
                >
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-gold">
                    {label}
                  </p>
                  <p className="text-[1.02rem] leading-relaxed text-muted-foreground">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
