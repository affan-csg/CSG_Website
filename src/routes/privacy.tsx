import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/site/primitives";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Privacy Policy | Career Source Group",
      description: "Privacy policy for Career Source Group.",
      path: "/privacy"
    }),
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
      />

      <Section>
        <div className="max-w-3xl">
          <p className="text-[1.04rem] leading-[1.75] text-muted-foreground">
            Please contact us for our full Privacy Policy.
          </p>
          <p className="mt-6 text-[1.04rem] leading-[1.75] text-muted-foreground">
            For questions about our privacy practices, please{" "}
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
