import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/site/primitives";
import { legalPages } from "@/content/pages";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Terms & Conditions | Career Source Group",
      description: "Terms and conditions for Career Source Group.",
      path: "/terms"
    }),
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={legalPages.terms.title}
      />

      <Section>
        <div className="max-w-3xl">
          <p className="text-[1.04rem] leading-[1.75] text-muted-foreground">
            {legalPages.terms.body}
          </p>
          <p className="mt-6 text-[1.04rem] leading-[1.75] text-muted-foreground">
            For questions about our terms and conditions, please{" "}
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
