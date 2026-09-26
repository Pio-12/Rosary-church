"use client";

import { useEffect } from "react";

/**
 * Mount once inside <main className="about-page">.
 * Observes all [data-reveal] elements and progressively applies
 * `.is-inview` as they enter the viewport.
 *
 * Supports animation variants:
 * - data-reveal="fade-up" (soft blur dissolve + translation)
 * - data-reveal="fade-down"
 * - data-reveal="slide-left" / "slide-right" (alternating timeline & cards)
 * - data-reveal="pop" (scale + spring entrance)
 * - data-reveal="line" (staggered timeline entries)
 * - data-reveal="priest" (priest succession lineage items)
 *
 * Also dynamically tracks the central timeline and illuminates
 * nodes as the user journeys down the page.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.querySelector(".about-page");
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      items.forEach((el) => el.classList.add("is-inview"));
      return;
    }

    // Reveal observer for entry animations
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    items.forEach((el) => revealObserver.observe(el));

    // Timeline node activation tracker for the historical journey
    const timelineItems = Array.from(
      root.querySelectorAll<HTMLElement>(".history-milestone, .priest-item")
    );

    let activeObserver: IntersectionObserver | null = null;
    if (timelineItems.length) {
      activeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-active");
            }
          });
        },
        { threshold: 0.35, rootMargin: "-10% 0px -25% 0px" }
      );

      timelineItems.forEach((el) => activeObserver?.observe(el));
    }

    return () => {
      revealObserver.disconnect();
      activeObserver?.disconnect();
    };
  }, []);

  return null;
}