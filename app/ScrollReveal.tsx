"use client";

import { useEffect } from "react";

/**
 * Mount this ONCE, site-wide — ideally in app/layout.tsx, not per-page.
 * (Right now only the homepage imports it, so every other page's
 * .reveal-up / .card / .gallery-item / .mass-card animations never fire.)
 *
 * What it does:
 * 1. Adds "js-anim" to <html> so the CSS's hidden/animate-in rules engage
 *    (see globals.css: "Once ScrollReveal.tsx has mounted...").
 * 2. Uses IntersectionObserver to add "in-view" to each section as it
 *    scrolls into place — real scroll-reveal, not a one-shot page-load animation.
 * 3. Toggles a "scrolled" class on .header so the navbar can react to scroll
 *    (compact height + shadow — see the matching CSS additions below).
 * 4. Gently counts up any number inside .animated-stats .stat strong the
 *    first time that stat scrolls into view (e.g. "1592", "400+", "380").
 * 5. Fully respects prefers-reduced-motion: everything is just shown,
 *    instantly, no observer, no counting animation.
 */

const REVEAL_SELECTOR = [
  ".reveal-up",
  ".reveal-image",
  ".animated-stats .stat",
  ".timeline-item",
  ".person-card",
  ".mass-card",
  ".gallery-item",
].join(",");

export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-anim");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
    );

    let observer: IntersectionObserver | undefined;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      // No motion, no observer — just reveal everything as-is.
      targets.forEach((el) => el.classList.add("in-view"));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const el = entry.target as HTMLElement;
            el.classList.add("in-view");

            if (el.matches(".animated-stats .stat")) {
              animateStatCount(el);
            }

            observer?.unobserve(el);
          });
        },
        {
          threshold: 0.18,
          rootMargin: "0px 0px -8% 0px",
        }
      );

      targets.forEach((el) => observer!.observe(el));
    }

    // --- Header scroll transition ---------------------------------------
    const header = document.querySelector<HTMLElement>(".header");

    function handleScroll() {
      if (!header) return;
      if (window.scrollY > 12) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    if (header) {
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      observer?.disconnect();
      if (header) window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}

/** Counts a stat's number up from 0 the first time it scrolls into view.
 *  Reads whatever is already in the DOM (e.g. "1592", "400+", "380"),
 *  so no markup changes are needed on any page using .animated-stats. */
function animateStatCount(statEl: HTMLElement) {
  const numEl = statEl.querySelector("strong");
  if (!numEl) return;

  const raw = numEl.textContent?.trim() ?? "";
  const match = raw.match(/^([\d,]+)(.*)$/);
  if (!match) return; // not a number (leave text as-is)

  const target = parseInt(match[1].replace(/,/g, ""), 10);
  const suffix = match[2] ?? "";
  const duration = 1100;
  const start = performance.now();

  function frame(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const current = Math.round(target * eased);
    numEl!.textContent = `${current.toLocaleString()}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      numEl!.textContent = raw; // land exactly on the original text
    }
  }

  requestAnimationFrame(frame);
}