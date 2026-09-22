"use client";

import { useEffect } from "react";

/**
 * Mount this once anywhere inside <main className="about-page">.
 * It renders nothing — it just finds every [data-reveal] element on
 * the page and adds `.is-inview` the first time it scrolls into
 * view, then stops watching it. All the actual visual effect (pop,
 * slide left/right, line reveal, priest timeline, etc.) lives in
 * CSS, keyed off the element's own class + `.is-inview`.
 *
 * Because each element is observed independently, items naturally
 * reveal "one after another" as the user scrolls down past them —
 * no manual sequencing needed. A small nth-child transition-delay
 * in CSS adds extra cascade polish when several items enter the
 * viewport at once (fast scroll, or already visible on load).
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.querySelector(".about-page");
    if (!root) return;

    const items = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!items.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      items.forEach((el) => el.classList.add("is-inview"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}