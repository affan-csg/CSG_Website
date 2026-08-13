import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/reveal";
import {
  CtaBand,
  FaqSection,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { faqs } from "@/content/site";
import { buildFaqJsonLd, buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => ({
    ...buildSeoMeta({
      title: "Frequently Asked Questions",
      description:
        "Answers for clients hiring AI/ML, MLOps, Data, DevOps, DevSecOps, Cloud, Software Development, and Product talent.",
      path: "/faq",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildFaqJsonLd(faqs.map((f) => ({ question: f.q, answer: f.a })))),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const clientFaqs = faqs.filter((f) => f.audience === "clients");
  const talentFaqs = faqs.filter((f) => f.audience === "talent");

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        body="Client questions and talent questions, answered directly."
      />

      <Section>
        <SectionHeading eyebrow="For clients" title="Hiring and engagement questions" />
        <Reveal className="mt-8">
          <FaqSection questions={clientFaqs.map((f) => f.q)} showAllLink={false} />
        </Reveal>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="For talent" title="Application and placement questions" />
        <Reveal className="mt-8">
          <FaqSection questions={talentFaqs.map((f) => f.q)} showAllLink={false} />
        </Reveal>
      </Section>

      <CtaBand />
    </>
  );
}
