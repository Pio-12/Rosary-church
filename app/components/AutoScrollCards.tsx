"use client";

import { useEffect } from "react";

/**
 * Mount once inside <main className="about-page">.
 * Automatically advances card rails on a timer ONLY WHEN that specific
 * section or card rail enters the viewport (via IntersectionObserver).
 *
 * Requirements addressed:
 * 1. Every card rail starts strictly at Card 1 (scrollLeft = 0).
 * 2. Auto-scrolling does NOT run when page opens; it triggers only when the section comes into view.
 * 3. Dwells on Card 1 for 2 seconds, then advances every 2.5 seconds (2-3s for each card).
 * 4. Pauses on hover (desktop) or touch/drag (mobile) and resumes gracefully.
 * 5. Pauses immediately when the section leaves the viewport.
 */
export function AutoScrollCards() {
  useEffect(() => {
    const root = document.querySelector(".about-page");
    if (!root) return;

    const rails = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".auto-scroll-rail, .mobile-snap-rail, .identity-cards-grid, .substations-grid, .parish-life-grid, .associations-grid, .structures-grid, .priest-timeline-grid, .communities-grid, .institutions-grid, .grottos-grid, .legacy-pillars-grid"
      )
    );
    if (!rails.length) return;

    const cleanupFns: Array<() => void> = [];

    rails.forEach((rail) => {
      // Guarantee starting at Card 1
      rail.scrollLeft = 0;

      let intervalId: number | undefined;
      let startTimeout: number | undefined;
      let resumeTimeout: number | undefined;
      let isPaused = false;
      let isVisible = false;

      const stopScrolling = () => {
        window.clearTimeout(startTimeout);
        window.clearInterval(intervalId);
        intervalId = undefined;
      };

      const tick = () => {
        if (isPaused || !isVisible) return;
        const cards = Array.from(rail.children) as HTMLElement[];
        if (cards.length <= 1) return;
        if (rail.scrollWidth <= rail.clientWidth + 8) return;

        // Find the currently active card index based on scroll offset
        const currentScroll = rail.scrollLeft;
        let activeIndex = 0;
        let minDiff = Infinity;

        cards.forEach((card, i) => {
          const diff = Math.abs(card.offsetLeft - rail.offsetLeft - currentScroll);
          if (diff < minDiff) {
            minDiff = diff;
            activeIndex = i;
          }
        });

        // Determine next card (looping back to 0 when end is reached)
        const nextIndex = activeIndex + 1 >= cards.length ? 0 : activeIndex + 1;
        const targetCard = cards[nextIndex];
        const targetLeft = targetCard.offsetLeft - rail.offsetLeft;

        rail.scrollTo({
          left: targetLeft,
          behavior: "smooth",
        });
      };

      const startScrolling = () => {
        stopScrolling();
        if (isPaused || !isVisible) return;
        if (rail.scrollWidth <= rail.clientWidth + 8) return;

        // Dwell on the first card for 2.0s when the section enters the viewport
        startTimeout = window.setTimeout(() => {
          if (isPaused || !isVisible) return;
          tick(); // advance to Card 2

          // Then advance every 2.5 seconds (2-3 seconds for each card)
          intervalId = window.setInterval(() => {
            tick();
          }, 2500);
        }, 2000);
      };

      // Desktop hover pause & resume
      const onMouseEnter = () => {
        isPaused = true;
        stopScrolling();
      };

      const onMouseLeave = () => {
        isPaused = false;
        if (isVisible) {
          startScrolling();
        }
      };

      // Mobile touch / pointer interaction pause
      const onUserInteraction = () => {
        isPaused = true;
        stopScrolling();
        window.clearTimeout(resumeTimeout);
        resumeTimeout = window.setTimeout(() => {
          isPaused = false;
          if (isVisible) {
            startScrolling();
          }
        }, 3500);
      };

      rail.addEventListener("mouseenter", onMouseEnter);
      rail.addEventListener("mouseleave", onMouseLeave);
      rail.addEventListener("touchstart", onUserInteraction, { passive: true });
      rail.addEventListener("pointerdown", onUserInteraction);

      // ONLY start auto-scrolling when this section or card rail enters the viewport!
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              isVisible = true;
              startScrolling();
            } else {
              isVisible = false;
              stopScrolling();
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
      );

      observer.observe(rail);

      cleanupFns.push(() => {
        stopScrolling();
        window.clearTimeout(resumeTimeout);
        observer.disconnect();
        rail.removeEventListener("mouseenter", onMouseEnter);
        rail.removeEventListener("mouseleave", onMouseLeave);
        rail.removeEventListener("touchstart", onUserInteraction);
        rail.removeEventListener("pointerdown", onUserInteraction);
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return null;
}