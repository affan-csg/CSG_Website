import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/reveal";
import { buildSeoMeta } from "@/lib/seo";
import {
  CtaBand,
  PageHero,
  Panel,
  PullQuote,
  Section,
  SectionHeading,
} from "@/components/site/primitives";

export const Route = createFileRoute("/offer-calibration")({
  head: () => ({
    meta: buildSeoMeta({
      title: "What Your Offer Actually Buys, by Region | Career Source Group",
      description: "US starting-salary benchmarks for nine technical roles, and what the same budget buys in LATAM and Pakistan.",
      path: "/offer-calibration"
    }),
  }),
  component: OfferCalibrationPage,
});

const calibrationData = [
  {
    role: "AI/ML Engineer",
    us: "$140K – $180K",
    latam: "$45K – $75K",
    pakistan: "$25K – $45K",
  },
  {
    role: "Data Engineer",
    us: "$120K – $160K",
    latam: "$40K – $65K",
    pakistan: "$22K – $40K",
  },
  {
    role: "DevOps Engineer",
    us: "$120K – $155K",
    latam: "$40K – $60K",
    pakistan: "$20K – $38K",
  },
  {
    role: "Cloud Architect",
    us: "$140K – $180K",
    latam: "$50K – $75K",
    pakistan: "$28K – $48K",
  },
  {
    role: "Full-Stack Developer",
    us: "$100K – $140K",
    latam: "$35K – $55K",
    pakistan: "$18K – $35K",
  },
  {
    role: "Product Manager",
    us: "$120K – $160K",
    latam: "$40K – $65K",
    pakistan: "$22K – $40K",
  },
  {
    role: "DevSecOps Engineer",
    us: "$130K – $170K",
    latam: "$45K – $70K",
    pakistan: "$25K – $45K",
  },
  {
    role: "MLOps Engineer",
    us: "$125K – $165K",
    latam: "$42K – $68K",
    pakistan: "$24K – $42K",
  },
  {
    role: "Project Manager",
    us: "$90K – $130K",
    latam: "$30K – $50K",
    pakistan: "$16K – $32K",
  },
];

function OfferCalibrationPage() {
  return (
    <>
      <PageHero
        eyebrow="Offer calibration"
        title="What Your Offer Actually Buys, by Region"
        body="Using US starting-salary benchmarks as the baseline."
      />

      <Section>
        <SectionHeading
          eyebrow="The comparison"
          title="Salary ranges by region"
          body="These are starting-salary benchmarks for nine technical roles. The same budget buys very different things depending on where the seat sits."
        />
        <Reveal className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-4 pr-6 eyebrow font-normal">
                  &nbsp;
                </th>
                <th scope="col" className="py-4 pr-6 font-display text-base">
                  United States
                </th>
                <th scope="col" className="py-4 pr-6 font-display text-base">
                  LATAM
                </th>
                <th scope="col" className="py-4 font-display text-base">
                  Pakistan
                </th>
              </tr>
            </thead>
            <tbody>
              {calibrationData.map((row) => (
                <tr
                  key={row.role}
                  className="border-b border-border/70 align-top"
                >
                  <th
                    scope="row"
                    className="w-48 py-6 pr-6 font-mono text-[0.66rem] font-normal uppercase tracking-[0.16em] text-gold"
                  >
                    {row.role}
                  </th>
                  <td className="py-6 pr-6 leading-relaxed text-muted-foreground">
                    {row.us}
                  </td>
                  <td className="py-6 pr-6 leading-relaxed text-muted-foreground">
                    {row.latam}
                  </td>
                  <td className="py-6 leading-relaxed text-muted-foreground">
                    {row.pakistan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <Reveal className="mt-8 max-w-2xl">
          <p className="text-[0.98rem] leading-[1.75] text-muted-foreground">
            This is not an argument for offshoring everything. It's an argument
            for knowing what your money buys before you spend it.
          </p>
        </Reveal>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="How we think"
          title="A note on how we think about this"
        />
        <Reveal className="mt-8 max-w-3xl">
          <p className="text-[1.04rem] leading-[1.75] text-muted-foreground">
            Calibrating cost across regions is about designing capacity
            intelligently, not replacing US roles indiscriminately. The seats
            that need to be in the room, stay in the room.
          </p>
        </Reveal>
      </Section>

      <Section className="border-t border-border">
        <PullQuote>
          Give us the offer — base, bonus, equity, remote flexibility, and how
          fast you need someone — and before we source a single candidate we'll
          tell you what it realistically buys in the US market and how long that
          search will take, what it buys in LATAM, and what it buys in Pakistan.
          Then you decide.
        </PullQuote>
      </Section>

      <CtaBand />
    </>
  );
}
