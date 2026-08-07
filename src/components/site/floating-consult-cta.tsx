import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * FloatingConsultCTA — Floating button that appears after scrolling past the hero.
 * Opens Calendly popup when clicked.
 */
export function FloatingConsultCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const calendlyUrl = "https://calendly.com/affan-careersourcegroup/30min";

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(calendlyUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={cn(
        "fixed right-6 bottom-20 z-40 transition-all duration-300 ease-out lg:bottom-6",
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
      aria-hidden={!isVisible}
    >
      <a
        href={calendlyUrl}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group flex items-center gap-2 rounded-full bg-gold px-5 py-3 font-display text-sm font-semibold text-navy shadow-xl transition-all duration-300 hover:bg-cream hover:shadow-2xl",
          "ring-1 ring-white/15",
        )}
      >
        <CalendarDays className="h-4 w-4" />
        Schedule a Consultation
      </a>
    </div>
  );
}
