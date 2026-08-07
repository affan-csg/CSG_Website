import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { company, footerColumns } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-navy-deep">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr]">
          <div className="min-w-0">
            <Link to="/" className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-gold/50 font-display text-[0.85rem] font-semibold text-gold">
                CSG
              </span>
              <span className="font-display text-base font-semibold">
                Career Source Group
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {company.tagline}
            </p>
            <div className="mt-7 space-y-3 text-sm">
              <p className="flex gap-3 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{company.address}</span>
              </p>
              <a
                href={company.phoneHref}
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                {company.phone}
              </a>
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                {company.email}
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((col) => (
              <div key={col.title} className="min-w-0">
                <h3 className="eyebrow">{col.title}</h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/legal-notice" className="hover:text-foreground">
              Legal Notice
            </Link>
            <Link to="/merchant-policies" className="hover:text-foreground">
              Merchant Policies
            </Link>
            <Link to="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
