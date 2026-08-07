import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/site/reveal";
import { ctaBand, faqsByQuestion, type Faq } from "@/content/site";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative py-20 md:py-28", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={cn(align === "center" && "text-center", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2
        className={cn(
          "mt-4 text-balance text-3xl font-semibold leading-[1.08] md:text-[2.7rem]",
          align === "center" && "mx-auto max-w-3xl",
        )}
      >
        {title}
      </h2>
      {body ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {body}
        </p>
      ) : null}
    </Reveal>
  );
}

export function PageHero({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body?: string | string[];
  children?: ReactNode;
}) {
  const paragraphs = Array.isArray(body) ? body : body ? [body] : [];
  return (
    <section className="grain relative overflow-hidden border-b border-border pt-36 pb-16 md:pt-44 md:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full opacity-[0.16] blur-[110px]"
        style={{ background: "var(--electric)" }}
      />
      <div className="container-page relative">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-6 max-w-4xl text-balance font-display text-[2.1rem] font-semibold leading-[1.06] md:text-[3.4rem]">
            {title}
          </h1>
          {paragraphs.map((p) => (
            <p
              key={p}
              className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-muted-foreground"
            >
              {p}
            </p>
          ))}
        </Reveal>
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}

export function ArrowLink({
  to,
  label,
  className,
}: {
  to: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      to={to as never}
      className={cn(
        "group inline-flex items-center gap-2 font-display text-sm font-semibold text-gold",
        className,
      )}
    >
      {label}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export function ButtonLink({
  to,
  label,
  variant = "solid",
}: {
  to: string;
  label: string;
  variant?: "solid" | "outline";
}) {
  return (
    <Link
      to={to as never}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3.5 font-display text-[0.88rem] font-semibold transition-all duration-300",
        variant === "solid"
          ? "bg-cream text-navy hover:bg-gold"
          : "border border-border text-foreground hover:border-gold hover:text-gold",
      )}
    >
      {label}
    </Link>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </span>
  );
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-panel rounded-md p-7 transition-colors duration-500 hover:border-gold/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function NumberedItem({
  index,
  heading,
  body,
}: {
  index: number;
  heading?: string;
  body: string;
}) {
  return (
    <div className="grid gap-5 border-t border-border py-8 md:grid-cols-[5rem_1fr]">
      <span className="font-mono text-sm text-gold">
        {String(index).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        {heading ? (
          <h3 className="text-xl font-semibold leading-snug">{heading}</h3>
        ) : null}
        <p
          className={cn(
            "text-[1.02rem] leading-relaxed text-muted-foreground",
            heading && "mt-3",
          )}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <Reveal className="my-4 border-l-2 border-gold pl-7">
      <p className="font-display text-xl leading-relaxed text-foreground md:text-[1.6rem]">
        {children}
      </p>
    </Reveal>
  );
}

export function StatGrid({
  stats,
}: {
  stats: readonly { value: string; label: string }[];
}) {
  return (
    <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-card p-7">
          <p className="font-display text-3xl font-semibold text-gold md:text-4xl">
            {s.value}
          </p>
          <p className="mt-3 text-sm leading-snug text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export function FaqSection({
  questions,
  items,
  heading = "Frequently asked questions",
  showAllLink = true,
}: {
  questions?: string[];
  items?: Faq[];
  heading?: string;
  showAllLink?: boolean;
}) {
  const list = items ?? faqsByQuestion(questions ?? []);
  if (!list.length) return null;

  return (
    <Section className="border-t border-border">
      <SectionHeading eyebrow="FAQ" title={heading} />
      <Accordion type="single" collapsible className="mt-12">
        {list.map((faq) => (
          <AccordionItem key={faq.q} value={faq.q} className="border-border">
            <AccordionTrigger className="py-6 text-left font-display text-[1.05rem] font-medium hover:no-underline md:text-lg">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="max-w-3xl pb-7 text-[0.98rem] leading-relaxed text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {showAllLink ? (
        <div className="mt-10">
          <ArrowLink to="/faq" label="See all FAQs" />
        </div>
      ) : null}
    </Section>
  );
}

export function CtaBand() {
  return (
    <section className="grain relative overflow-hidden border-t border-border bg-navy-deep py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 left-1/2 h-[30rem] w-[46rem] -translate-x-1/2 rounded-full opacity-[0.13] blur-[120px]"
        style={{ background: "var(--gold)" }}
      />
      <div className="container-page relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-balance font-display text-3xl font-semibold leading-tight md:text-[2.75rem]">
            {ctaBand.title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[1.02rem] leading-relaxed text-muted-foreground">
            {ctaBand.body}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink to={ctaBand.primary.to} label={ctaBand.primary.label} />
            <ButtonLink
              to={ctaBand.secondary.to}
              label={ctaBand.secondary.label}
              variant="outline"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Minimal markdown-ish renderer for long-form content (blog, legal). */
export function Prose({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="max-w-3xl">
      {blocks.map((block, i) => {
        const trimmed = block.trim();

        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="mt-12 font-display text-xl font-semibold md:text-2xl"
            >
              {trimmed.slice(4)}
            </h3>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="mt-14 font-display text-2xl font-semibold md:text-3xl"
            >
              {trimmed.slice(3)}
            </h2>
          );
        }
        if (/^[-*] /m.test(trimmed)) {
          const lines = trimmed.split("\n").filter((l) => /^[-*] /.test(l.trim()));
          return (
            <ul key={i} className="mt-6 space-y-3">
              {lines.map((line, j) => (
                <li
                  key={j}
                  className="flex gap-3 text-[1.02rem] leading-relaxed text-muted-foreground"
                >
                  <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-gold" />
                  <span>{line.trim().replace(/^[-*] /, "")}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p
            key={i}
            className="mt-6 text-[1.04rem] leading-[1.75] text-muted-foreground"
          >
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
