import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { specialties, regionCards } from "@/content/site";
import { cn } from "@/lib/utils";

const navItemsWithDropdowns = [
  {
    label: "Services",
    to: "/services",
    width: "min-w-[280px]",
    children: [
      ...specialties.map((s) => ({
        label: s.title,
        to: `/services/${s.slug}`,
      })),
      { label: "What your offer buys", to: "/offer-calibration" },
    ],
  },
  { label: "How Pods Work", to: "/pods" },
  {
    label: "Global Delivery",
    to: "/global-delivery",
    width: "min-w-[200px]",
    children: regionCards.map((r) => ({
      label: r.title,
      to: r.to,
    })),
  },
  { label: "Why CSG", to: "/why-csg" },
  { label: "About", to: "/about" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Only prevent scroll on desktop when menu is open
    if (window.innerWidth >= 1024) {
      document.body.style.overflow = open ? "hidden" : "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

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
        <Link
          to="/"
          className="group relative flex min-w-0 items-center gap-2"
          activeProps={{ className: "logo-active" }}
        >
          <motion.img
            src="/images/brand/CSG.png"
            alt="CSG"
            className="h-12 w-auto shrink-0 object-contain [filter:invert(68%)_sepia(60%)_saturate(50%)_hue-rotate(5deg)_brightness(105%)] transition-all duration-300"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={scrolled ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.1 }}
          />
          <span className="hidden min-w-0 flex-col leading-none sm:flex">
            <span className="truncate font-display text-[0.92rem] font-semibold transition-colors group-[.logo-active]:text-gold">
              Career Source Group
            </span>
            <span className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-muted-foreground">
              US · LATAM · Pakistan
            </span>
          </span>
          {/* Gold underline when on home page */}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItemsWithDropdowns.map((item) => {
            const hasChildren = "children" in item && item.children && item.children.length > 0;

            if (hasChildren) {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={item.to}
                    className={cn(
                      "gold-underline flex items-center gap-1 px-3 py-2 text-[0.9rem] text-muted-foreground transition-colors hover:text-gold",
                      openDropdown === item.label && "text-foreground",
                    )}
                    activeProps={{ className: "text-foreground", "data-active": "true" }}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        openDropdown === item.label && "rotate-180",
                      )}
                    />
                  </Link>

                  <AnimatePresence>
                    {openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-0 top-full pt-2"
                        onMouseEnter={() => handleMouseEnter(item.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className={cn("rounded-md border border-border bg-background/95 p-2 shadow-xl backdrop-blur-xl", item.width || "min-w-[220px]")}>
                          <Link
                            to={item.to}
                            onClick={() => setOpenDropdown(null)}
                            className="block rounded-md px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                          >
                            View All
                          </Link>
                          <div className="my-1 h-px bg-border" />
                          {item.children.map((child) => (
                            <Link
                              key={child.to}
                              to={child.to}
                              onClick={() => setOpenDropdown(null)}
                              className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-navy"
                              activeProps={{ className: "text-gold" }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.to}
                className="gold-underline px-3 py-2 text-[0.9rem] text-muted-foreground transition-colors hover:text-gold"
                activeProps={{ className: "text-foreground", "data-active": "true" }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/get-started"
            className="hidden items-center gap-2 rounded-md bg-cream px-5 py-2.5 font-display text-[0.82rem] font-semibold text-navy transition-all duration-300 hover:bg-gold xl:inline-flex"
          >
            Submit a Requirement
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-md border border-border text-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-border bg-background/98 backdrop-blur-xl lg:hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="container-page flex flex-col gap-1 py-6">
              {navItemsWithDropdowns.map((item) => {
                const hasChildren = "children" in item && item.children && item.children.length > 0;

                if (hasChildren) {
                  return (
                    <MobileDropdown
                      key={item.label}
                      item={item}
                      onClose={() => setOpen(false)}
                    />
                  );
                }

                return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="border-b border-border/60 py-3.5 font-display text-lg"
                  activeProps={{ className: "text-gold" }}
                >
                  {item.label}
                </Link>
                );
              })}
              <div className="mt-5 flex flex-col gap-3">
                <Link
                  to="/get-started"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-cream px-5 py-3 text-center font-display text-sm font-semibold text-navy"
                >
                  Submit a Requirement
                </Link>
                <Link
                  to="/join-our-bench"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-border px-5 py-3 text-center font-display text-sm"
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

function MobileDropdown({
  item,
  onClose,
}: {
  item: { label: string; to: string; children?: readonly { label: string; to: string }[] };
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-border/60">
      <div className="flex items-center justify-between py-3.5">
        <Link
          to={item.to}
          onClick={onClose}
          className="font-display text-lg"
        >
          {item.label}
        </Link>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="grid h-8 w-8 place-items-center text-muted-foreground"
          aria-label={`Expand ${item.label} submenu`}
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              expanded && "rotate-180",
            )}
          />
        </button>
      </div>
      <AnimatePresence>
        {expanded && item.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 pb-4 pl-4">
              {item.children.map((child) => (
                <Link
                  key={child.to}
                  to={child.to}
                  onClick={onClose}
                  className="rounded-md py-2.5 text-sm text-muted-foreground transition-colors hover:text-gold"
                  activeProps={{ className: "text-gold" }}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
