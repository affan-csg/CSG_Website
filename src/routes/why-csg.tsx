import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/reveal";
import {
  ArrowLink,
  CtaBand,
  FaqSection,
  NumberedItem,
  PageHero,
  PullQuote,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { whyCsg } from "@/content/pages";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/why-csg")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Why Companies Work With Us | Career Source Group",
      description: "Three regions with no reason to push one over another, 10% direct-hire fees, communication scored before anything else.",
      path: "/why-csg"
    }) }),
  component: WhyCsgPage,
});

function WhyCsgPage() {
  return (
    <>
      <PageHero
        eyebrow="Why CSG"
        title={whyCsg.title}
        body="Five reasons companies work with us instead of managing multiple vendors across regions."
        showParticles={true}
      />

      <Section>
        <div className="space-y-0">
          {whyCsg.reasons.map((reason, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <NumberedItem
                index={i + 1}
                heading={reason.heading}
                body={reason.body}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <PullQuote>
          We're the only staffing firm that sells all three regions — US, LATAM,
          and Pakistan — so our incentive is to put the work where it actually
          belongs.
        </PullQuote>
        <Reveal className="mt-8 max-w-2xl">
          <p className="text-[1.02rem] leading-[1.75] text-muted-foreground">
            While other firms push their own region because that's all they
            sell, we have no reason to push one over another. Geography is
            decided after experience, communication skills, and technical skills
            are settled — not before.
          </p>
        </Reveal>
      </Section>

      <Section className="border-t border-border">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Fee structure"
            title="10% for direct hire. The market charges 20-30%."
            body="Same vetting. Same guarantee. A third of the fee. On a $150,000 hire, that's $15,000 instead of $30,000-$45,000. On five hires a year, that's a quarter of a million dollars back in your budget."
          />
          <Reveal delay={0.1}>
            <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
              {[
                { value: "10%", label: "Our direct-hire fee" },
                { value: "20-30%", label: "What the market charges" },
                { value: "$250K+", label: "Saved across five hires a year" },
              ].map((s) => (
                <div key={s.label} className="bg-card p-7">
                  <p className="font-display text-3xl font-semibold text-gold">
                    {s.value}
                  </p>
                  <p className="mt-3 text-sm leading-snug text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Communication"
          title="We score communication before we score anything else."
        />
        <Reveal className="mt-8 max-w-3xl">
          <p className="text-[1.04rem] leading-[1.75] text-muted-foreground">
            Most offshore engagements don't fail on technical skill. They fail
            because nobody designed for how the work would actually get
            discussed. We staff communication-critical seats differently than
            execution seats, on purpose. Every pod is scored on communication
            first, then on technical skill against the client's actual stack.
          </p>
        </Reveal>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Enterprise"
          title="Enterprise delivery history."
          body="Synovus. Deloitte. BCBS. M3. TK Elevators. We're not a low-cost offshore reseller that learned staffing last year."
        />
        <Reveal className="mt-8">
          <div className="glass-panel rounded-md p-8">
            <p className="eyebrow">Who we've delivered for</p>
            <div className="mt-6 flex flex-wrap gap-8">
              {["Synovus", "Deloitte", "BCBS", "M3", "TK Elevators"].map(
                (logo) => (
                  <span
                    key={logo}
                    className="font-display text-xl font-semibold text-muted-foreground/60"
                  >
                    {logo}
                  </span>
                ),
              )}
            </div>
          </div>
        </Reveal>
      </Section>

      <FaqSection questions={whyCsg.faqQuestions} />
      <CtaBand />
    </>
  );
}
