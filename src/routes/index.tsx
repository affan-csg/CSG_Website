import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Suspense, lazy, useEffect, useRef } from "react";

import { Reveal } from "@/components/site/reveal";
import {
  ArrowLink,
  ButtonLink,
  CtaBand,
  FaqSection,
  NumberedItem,
  Panel,
  Pill,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { home } from "@/content/pages";
import { regionCards, specialties, specialtyTags } from "@/content/site";

const HeroCanvas = lazy(() => import("@/components/site/hero-canvas"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Career Source Group — US, LATAM & Pakistan Staffing, One Contract",
      },
      {
        name: "description",
        content:
          "US staffing and talent delivery across the US, LATAM and Pakistan. Direct hire at 10%, contract and contract-to-hire — one contract, one invoice, one point of contact.",
      },
      {
        property: "og:title",
        content: "Career Source Group — Three countries. One contract.",
      },
      {
        property: "og:description",
        content:
          "US, LATAM and Pakistan talent under a single relationship — so you stop managing four vendors to build one team.",
      },
    ],
  }),
  component: HomePage,
});

function Hero() {
  const wordsRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = wordsRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: { revert: () => void } | undefined;
    void import("gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.from(el.querySelectorAll("[data-word]"), {
          yPercent: 118,
          opacity: 0,
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.12,
        });
      }, el);
    });

    return () => ctx?.revert();
  }, []);

  return (
    <section className="grain relative flex min-h-[92vh] items-center overflow-hidden border-b border-border pt-28">
      <div aria-hidden className="absolute inset-0 opacity-70">
        <ClientOnly fallback={null}>
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
        </ClientOnly>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-background to-transparent"
      />

      <div className="container-page relative w-full py-16">
        <Reveal y={12}>
          <p className="eyebrow">US · LATAM · Pakistan</p>
        </Reveal>

        <h1
          ref={wordsRef}
          className="mt-8 font-display text-[2.5rem] font-semibold leading-[1.02] tracking-tight sm:text-[4rem] lg:text-[5.4rem]"
        >
          {home.hero.words.map((word) => (
            <span key={word} className="block overflow-hidden pb-1">
              <span data-word className="block">
                {word}
              </span>
            </span>
          ))}
        </h1>

        <Reveal delay={0.35} className="mt-10 max-w-xl">
          <p className="text-[1.05rem] leading-relaxed text-muted-foreground">
            {home.hero.sub}
          </p>
        </Reveal>

        <Reveal delay={0.45} className="mt-10 flex flex-wrap gap-4">
          <ButtonLink to={home.hero.primary.to} label={home.hero.primary.label} />
          <ButtonLink
            to={home.hero.secondary.to}
            label={home.hero.secondary.label}
            variant="outline"
          />
        </Reveal>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <Hero />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="eyebrow">{home.who.heading}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-balance font-display text-xl leading-[1.5] md:text-[1.75rem]">
              {home.who.body}
            </p>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
          <SectionHeading
            eyebrow="Fee structure"
            title={home.fee.heading}
            body={home.fee.body}
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
            <div className="mt-8">
              <ArrowLink to={home.fee.cta.to} label={home.fee.cta.label} />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Global delivery" title="Three ways we deliver talent" />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {regionCards.map((card, i) => (
            <Reveal key={card.to} delay={i * 0.08}>
              <Link to={card.to} className="group block h-full">
                <Panel className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl font-semibold">{card.title}</h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-gold" />
                  </div>
                  <p className="mt-5 grow text-[0.98rem] leading-relaxed text-muted-foreground">
                    {card.body}
                  </p>
                  <span className="mt-7 font-display text-sm font-semibold text-gold">
                    {card.cta}
                  </span>
                </Panel>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Specialties" title="What we place" />
        <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
          {specialties.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group bg-card p-7 transition-colors duration-500 hover:bg-navy-soft md:p-9"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-lg font-semibold leading-snug">
                  {s.title}
                </h3>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-gold" />
              </div>
              <p className="mt-4 text-[0.96rem] leading-relaxed text-muted-foreground">
                {s.tagline}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {specialtyTags.map((tag) => (
                  <Pill key={tag}>{tag}</Pill>
                ))}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <ArrowLink to="/services" label="See all specialties" />
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="The pod model"
            title={home.pods.heading}
            body={home.pods.body}
          />
          <Reveal delay={0.1}>
            <div className="glass-panel rounded-md p-8">
              <p className="eyebrow">Sized against four variables</p>
              <ul className="mt-6 space-y-4">
                {["Experience", "Communication skills", "Technical skills", "Cost"].map(
                  (v, i) => (
                    <li key={v} className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-gold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-lg">{v}</span>
                    </li>
                  ),
                )}
              </ul>
              <div className="mt-8">
                <ArrowLink to={home.pods.cta.to} label={home.pods.cta.label} />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Differentiators" title={home.whyCsg.heading} />
        <div className="mt-12">
          {home.whyCsg.items.map((item, i) => (
            <Reveal key={item} delay={i * 0.05}>
              <NumberedItem index={i + 1} body={item} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <ArrowLink to={home.whyCsg.cta.to} label={home.whyCsg.cta.label} />
        </div>
      </Section>

      <FaqSection questions={home.faqQuestions} />
      <CtaBand />
    </>
  );
}
