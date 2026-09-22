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

    const grids = Array.from(
      root.querySelectorAll<HTMLElement>(".cards-grid")
    );
    if (!grids.length) return;

    const intervalIds: number[] = [];
    const cleanupFns: Array<() => void> = [];

    grids.forEach((grid, gridIndex) => {
      // The Substations grid auto-flips its own cards — don't also
      // auto-scroll it, or the two animations fight each other.
      if (grid.querySelector(".flip-card")) return;

      let paused = false;
      let resumeTimeout: number | undefined;

      const pause = () => {
        paused = true;
        window.clearTimeout(resumeTimeout);
        resumeTimeout = window.setTimeout(() => {
          paused = false;
        }, 4000);
      };

      grid.addEventListener("touchstart", pause, { passive: true });
      grid.addEventListener("pointerdown", pause);

      const tick = () => {
        if (paused) return;
        if (grid.scrollWidth <= grid.clientWidth + 4) return;

        const firstCard = grid.querySelector<HTMLElement>(":scope > *");
        const step =
          (firstCard?.getBoundingClientRect().width ?? grid.clientWidth * 0.78) +
          14; // matches the mobile card gap

        const atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 4;

        if (atEnd) {
          grid.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          grid.scrollBy({ left: step, behavior: "smooth" });
        }
      };

      // Stagger each strip's start slightly so multiple carousels on
      // the page don't all move in lockstep.
      const startDelay = 1500 + gridIndex * 400;
      const startTimeout = window.setTimeout(() => {
        const id = window.setInterval(tick, 3200);
        intervalIds.push(id);
      }, startDelay);

      cleanupFns.push(() => {
        window.clearTimeout(startTimeout);
        window.clearTimeout(resumeTimeout);
        grid.removeEventListener("touchstart", pause);
        grid.removeEventListener("pointerdown", pause);
      });
    });

    return () => {
      intervalIds.forEach((id) => window.clearInterval(id));
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return null;
}