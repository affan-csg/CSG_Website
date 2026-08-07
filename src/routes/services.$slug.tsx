import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import {
  CtaBand,
  FaqSection,
  PageHero,
  Panel,
  PullQuote,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { getService, otherServices, services } from "@/content/services";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Specialty not found | Career Source Group" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { service } = loaderData;
    const title = `${service.title} Staffing | Career Source Group`;
    return {
      meta: [
        { title },
        { name: "description", content: service.tagline },
        { property: "og:title", content: `${service.title} — ${service.tagline}` },
        { property: "og:description", content: service.blocks[0]?.body ?? service.tagline },
      ],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();

  return (
    <>
      <PageHero eyebrow="Specialty" title={service.title} body={service.tagline} />

      <Section>
        <div className="max-w-3xl">
          {service.blocks.map((block, i) => (
            <Reveal key={block.heading} delay={i * 0.05} className="mt-14 first:mt-0">
              <p className="eyebrow">{block.heading}</p>
              <p className="mt-5 text-[1.06rem] leading-[1.75] text-muted-foreground">
                {block.body}
              </p>
            </Reveal>
          ))}
        </div>
        {service.pullQuote ? (
          <div className="mt-16">
            <PullQuote>{service.pullQuote}</PullQuote>
          </div>
        ) : null}
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Delivery" title="Where this role can sit" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {service.regions.map((r, i) => (
            <Reveal key={r.region} delay={i * 0.07}>
              <Panel className="h-full">
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-gold">
                  {r.region}
                </p>
                <p className="mt-5 text-[0.98rem] leading-relaxed text-muted-foreground">
                  {r.body}
                </p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Related" title="Other practices" />
        <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {otherServices(service.slug).map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group bg-card p-7 transition-colors duration-500 hover:bg-navy-soft"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-base font-semibold leading-snug">
                  {s.title}
                </h3>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-gold" />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {s.tagline}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      {service.faqQuestions.length ? (
        <FaqSection questions={service.faqQuestions} />
      ) : null}
      <CtaBand />
    </>
  );
}

export const allServiceSlugs = services.map((s) => s.slug);
