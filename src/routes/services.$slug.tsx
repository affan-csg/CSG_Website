import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import {
  FaqSection,
  PageHero,
  Panel,
  PullQuote,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import type { Service } from "@/content/services";
import { getService, otherServices, services } from "@/content/services";
import { buildSeoMeta } from "@/lib/seo";

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
    return {
      meta: buildSeoMeta({
        title: `${service.title} Staffing | Career Source Group`,
        description: service.tagline,
        path: `/services/${service.slug}`,
        noindex: false,
      }),
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service } = Route.useLoaderData() as { service: Service };

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
        <SectionHeading eyebrow="Next steps" title="Ready to get started?" />
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/get-started"
            search={{ skill: service.slug }}
            className="inline-flex items-center justify-center rounded-md bg-cream px-6 py-3.5 font-display text-[0.88rem] font-semibold text-navy transition-all duration-300 hover:bg-gold"
          >
            Submit a requirement
          </Link>
          <Link
            to="/join-our-bench"
            search={{ skill: service.slug }}
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3.5 font-display text-[0.88rem] font-semibold text-foreground transition-all duration-300 hover:border-gold hover:text-gold"
          >
            Apply as specialist
          </Link>
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
    </>
  );
}

export const allServiceSlugs = services.map((s) => s.slug);
