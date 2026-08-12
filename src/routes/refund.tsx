import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/site/primitives";
import { legalPages } from "@/content/pages";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/refund")({
  head: () =>
    buildSeoMeta({
      title: "Refund Policy",
      description: "Refund policy for Career Source Group.",
      path: "/refund"
    }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={legalPages.refund.title}
      />

      <Section>
        <div className="max-w-3xl">
          <p className="text-[1.04rem] leading-[1.75] text-muted-foreground">
            {legalPages.refund.body}
          </p>
          <p className="mt-6 text-[1.04rem] leading-[1.75] text-muted-foreground">
            For questions about our refund policy, please{" "}
            <a
              href="mailto:hello@careersourcegroup.com"
              className="text-gold transition-colors hover:text-gold/80"
            >
              contact us
            </a>{" "}
            directly.
          </p>
        </div>
      </Section>
    </>
  );
}
