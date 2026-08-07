import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { navLinks } from "@/content/site";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border/70 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <Link to="/" className="group flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-gold/50 font-display text-[0.8rem] font-semibold tracking-tight text-gold">
            CSG
          </span>
          <span className="hidden min-w-0 flex-col leading-none sm:flex">
            <span className="truncate font-display text-[0.92rem] font-semibold">
              Career Source Group
            </span>
            <span className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-muted-foreground">
              US · LATAM · Pakistan
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="gold-underline text-[0.9rem] text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/get-started"
            className="hidden items-center gap-2 rounded-sm bg-cream px-5 py-2.5 font-display text-[0.82rem] font-semibold text-navy transition-all duration-300 hover:bg-gold sm:inline-flex"
          >
            Submit a Requirement
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-sm border border-border text-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-border bg-background/98 backdrop-blur-xl lg:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-6">
              {[
                ...navLinks,
                { label: "Blog", to: "/blog" },
                { label: "FAQ", to: "/faq" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="border-b border-border/60 py-3.5 font-display text-lg"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-5 flex flex-col gap-3">
                <Link
                  to="/get-started"
                  onClick={() => setOpen(false)}
                  className="rounded-sm bg-cream px-5 py-3 text-center font-display text-sm font-semibold text-navy"
                >
                  Submit a Requirement
                </Link>
                <Link
                  to="/join-our-bench"
                  onClick={() => setOpen(false)}
                  className="rounded-sm border border-border px-5 py-3 text-center font-display text-sm"
                >
                  Join our bench
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
