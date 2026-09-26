"use client";

import { useEffect, useRef, useState } from "react";

type FlipCardProps = {
  name: string;
  location: string;
  image: string;
  address: string;
  index?: number;
};

export function FlipCard({
  name,
  location,
  image,
  address,
  index = 0,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const userInteracted = useRef(false);
  const resumeAutoTimeout = useRef<number | undefined>(undefined);

  // Auto-flip ONLY when this card comes into view, NOT when page opens!
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 850px)").matches;
    if (!isMobile) return;

    const el = cardRef.current;
    if (!el) return;

    let cycleTimeout: number | undefined;
    let startTimeout: number | undefined;
    let isVisible = false;

    const openFor = 3000;
    const closedFor = 3800;

    const cycle = (flipTo: boolean) => {
      if (!userInteracted.current && isVisible) {
        setIsFlipped(flipTo);
        cycleTimeout = window.setTimeout(
          () => cycle(!flipTo),
          flipTo ? openFor : closedFor
        );
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
            // Dwell on the front side (Card face 1) for 3.2s after scrolling into view
            startTimeout = window.setTimeout(() => {
              if (isVisible && !userInteracted.current) {
                cycle(true);
              }
            }, 3200 + index * 600);
          } else {
            isVisible = false;
            window.clearTimeout(startTimeout);
            window.clearTimeout(cycleTimeout);
            // Ensure card is on the front side when not visible so it always starts from one
            if (!userInteracted.current) {
              setIsFlipped(false);
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearTimeout(startTimeout);
      window.clearTimeout(cycleTimeout);
    };
  }, [index]);

  const handleToggle = () => {
    userInteracted.current = true;
    setIsFlipped((v) => !v);

    window.clearTimeout(resumeAutoTimeout.current);
    resumeAutoTimeout.current = window.setTimeout(() => {
      userInteracted.current = false;
    }, 6000);
  };

  return (
    <div
      ref={cardRef}
      className="card flip-card"
      data-reveal="pop"
      style={{ "--i": index } as React.CSSProperties}
    >
      <div
        className={`flip-card-inner${isFlipped ? " is-flipped" : ""}`}
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={`${name}. Press to ${
          isFlipped ? "hide" : "show"
        } location details`}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        {/* FRONT (Face 1) */}
        <div className="flip-card-face flip-card-front">
          <div className="card-body">
            <div className="card-step-badge">
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3>{name}</h3>
            <p>{location}</p>
            <span className="flip-card-hint">Tap to view location ↻</span>
          </div>
        </div>

        {/* BACK (Face 2) */}
        <div className="flip-card-face flip-card-back">
          <img
            className="flip-card-image"
            src={image}
            alt={`${name} church`}
          />
          <div className="flip-card-back-body">
            <div className="card-step-badge badge-gold">
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3>{name}</h3>
            <p>{address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}