import { createFileRoute, Link } from "@tanstack/react-router";

import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/site/reveal";
import {
  PageHero,
  Panel,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { contact } from "@/content/pages";
import { company } from "@/content/site";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Contact Us | Career Source Group",
      description: "Reach Career Source Group by phone or email, or find our Alpharetta, GA office.",
      path: "/contact"
    }) }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={contact.title}
        body={contact.lead}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div>
              <SectionHeading
                eyebrow="Get in touch"
                title="Contact information"
              />
              <div className="mt-8 space-y-6">
                <div>
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Email
                  </p>
                  <a
                    href={`mailto:${company.email}`}
                    className="mt-1 block font-display text-lg text-gold transition-colors hover:text-gold/80"
                  >
                    {company.email}
                  </a>
                </div>
                <div>
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Phone
                  </p>
                  <a
                    href={company.phoneHref}
                    className="mt-1 block font-display text-lg text-gold transition-colors hover:text-gold/80"
                  >
                    {company.phone}
                  </a>
                </div>
                <div>
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Address
                  </p>
                  <p className="mt-1 text-[1.02rem] leading-relaxed text-muted-foreground">
                    {company.address}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Office Hours
                  </p>
                  <div className="mt-3 space-y-2">
                    {company.hours.map(([day, hours]) => (
                      <div
                        key={day}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">{day}</span>
                        <span className="font-medium">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Panel>
              <h3 className="font-display text-xl font-semibold">
                Send us a message
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {contact.lead}
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </Panel>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Intake forms"
          title="Looking for something specific?"
          body="For a staffing requirement or a bench application, use the dedicated intake forms instead of the general contact form."
        />
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/get-started"
            className="inline-flex items-center justify-center rounded-md bg-cream px-6 py-3.5 font-display text-[0.88rem] font-semibold text-navy transition-all duration-300 hover:bg-gold"
          >
            Submit a Requirement
          </Link>
          <Link
            to="/join-our-bench"
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3.5 font-display text-[0.88rem] font-semibold text-foreground transition-all duration-300 hover:border-gold hover:text-gold"
          >
            Join Our Bench
          </Link>
        </div>
      </Section>

    </>
  );
}
