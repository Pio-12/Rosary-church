"use client";

import { useEffect } from "react";

/**
 * Mount once inside <main className="about-page">. On mobile widths
 * (where .cards-grid becomes a horizontal swipeable strip) this
 * automatically advances every card strip on a timer, so people who
 * never bother to swipe still see every card. A manual touch/drag on
 * a strip pauses its autoplay for a few seconds so it doesn't fight
 * the user, then resumes.
 *
 * No-op on desktop, where .cards-grid is a normal (non-scrolling)
 * grid.
 */
export function AutoScrollCards() {
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 600px)").matches;
    if (!isMobile) return;

    const root = document.querySelector(".about-page");
    if (!root) return;

    const rails = Array.from(
      root.querySelectorAll<HTMLElement>(".cards-grid, .mobile-snap-rail")
    );
    if (!rails.length) return;

    const intervalIds: number[] = [];
    const cleanupFns: Array<() => void> = [];

    rails.forEach((rail, railIndex) => {
      // The Substations grid auto-flips its own cards — don't also
      // auto-scroll it, or the two animations fight each other.
      if (rail.querySelector(".flip-card")) return;

      let paused = false;
      let resumeTimeout: number | undefined;

      const pause = () => {
        paused = true;
        window.clearTimeout(resumeTimeout);
        resumeTimeout = window.setTimeout(() => {
          paused = false;
        }, 4500);
      };

      rail.addEventListener("touchstart", pause, { passive: true });
      rail.addEventListener("pointerdown", pause);

      const tick = () => {
        if (paused) return;
        if (rail.scrollWidth <= rail.clientWidth + 6) return;

        const firstCard = rail.querySelector<HTMLElement>(":scope > *");
        const step =
          (firstCard?.getBoundingClientRect().width ?? rail.clientWidth * 0.78) +
          16; // card gap

        const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;

        if (atEnd) {
          rail.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          rail.scrollBy({ left: step, behavior: "smooth" });
        }
      };

      // Stagger each strip's start slightly so multiple carousels don't advance in lockstep
      const startDelay = 1800 + railIndex * 450;
      const startTimeout = window.setTimeout(() => {
        const id = window.setInterval(tick, 3500);
        intervalIds.push(id);
      }, startDelay);

      cleanupFns.push(() => {
        window.clearTimeout(startTimeout);
        window.clearTimeout(resumeTimeout);
        rail.removeEventListener("touchstart", pause);
        rail.removeEventListener("pointerdown", pause);
      });
    });

    return () => {
      intervalIds.forEach((id) => window.clearInterval(id));
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return null;
}