import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/reveal";
import {
  ArrowLink,
  CtaBand,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { staffingRolesPage } from "@/content/staffing";
import { buildBreadcrumbJsonLd, buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/staffing/roles")({
  head: () => ({
    ...buildSeoMeta({
      title: "Staffing Roles — Individual Specialists, Priced by Region",
      description:
        "Direct hire, contract, and contract-to-hire specialists placed into a seat you've already defined, priced across the US, LATAM, and Pakistan.",
      path: "/staffing/roles",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          buildBreadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Staffing", url: "/staffing" },
            { name: "Staffing Roles", url: "/staffing/roles" },
          ]),
        ),
      },
    ],
  }),
  component: StaffingRolesPage,
});

function StaffingRolesPage() {
  return (
    <>
      <PageHero eyebrow="Staffing Roles" title={staffingRolesPage.title} showParticles={true} />

      <Section>
        <SectionHeading eyebrow="Positioning" title="How we price a role" />
        <div className="mt-10 max-w-3xl">
          {staffingRolesPage.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <p className="mt-6 text-[1.04rem] leading-[1.75] text-muted-foreground">{p}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <ArrowLink to={staffingRolesPage.cta.to} label={staffingRolesPage.cta.label} />
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Related" title="Looking for something else?" />
        <div className="mt-8 flex flex-wrap gap-6">
          <ArrowLink to="/staffing/pods" label="See how Pods work" />
          <ArrowLink to="/staffing/specialized-roles" label="See Specialized Roles" />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
