import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import {
  ArrowLink,
  CtaBand,
  PageHero,
  Panel,
  Pill,
  PullQuote,
  Section,
  SectionHeading,
  StatGrid,
} from "@/components/site/primitives";
import { servicesPage } from "@/content/services";
import { specialties, specialtyTags } from "@/content/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Specialized Technical Roles We Fill | Career Source Group" },
      {
        name: "description",
        content:
          "AI/ML, MLOps, data, DevOps, DevSecOps, cloud, software development and product roles — placed as specialists or pods across the US, LATAM and Pakistan.",
      },
      {
        property: "og:title",
        content: "Specialized Roles: The Ones Everyone Else Is Struggling to Fill",
      },
      {
        property: "og:description",
        content:
          "We don't sell resumes. We sell the right seat, in the right region, at the right number.",
      },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <>
      <PageHero eyebrow="Specialties" title={servicesPage.title} />

      <Section>
        <SectionHeading
          eyebrow="Positioning"
          title={servicesPage.positioning.heading}
        />
        <div className="mt-10 max-w-3xl">
          {servicesPage.positioning.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <p className="mt-6 text-[1.04rem] leading-[1.75] text-muted-foreground">
                {p}
              </p>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <ArrowLink
            to={servicesPage.positioning.cta.to}
            label={servicesPage.positioning.cta.label}
          />
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Market" title={servicesPage.whyNow.heading} />
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="min-w-0">
            {servicesPage.whyNow.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="mt-6 text-[1.04rem] leading-[1.75] text-muted-foreground">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
              {servicesPage.whyNow.stats.map((s) => (
                <div key={s.label} className="bg-card p-6">
                  <p className="font-display text-2xl font-semibold text-gold">
                    {s.value}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Practices" title="Eight technical practices" />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {specialties.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 2) * 0.06}>
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group block h-full"
              >
                <Panel className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-lg font-semibold leading-snug">
                      {s.title}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-gold" />
                  </div>
                  <p className="mt-4 grow text-[0.98rem] leading-relaxed text-muted-foreground">
                    {s.tagline}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {specialtyTags.map((tag) => (
                      <Pill key={tag}>{tag}</Pill>
                    ))}
                  </div>
                </Panel>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <PullQuote>{servicesPage.closing}</PullQuote>
        <div className="mt-8">
          <StatGrid
            stats={[
              { value: "8", label: "Technical practices" },
              { value: "3", label: "Delivery regions" },
              { value: "4", label: "Engagement models" },
              { value: "1", label: "Point of contact" },
            ]}
          />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
