"use client";

import { useEffect, useRef, useState } from "react";

type FlipCardProps = {
  name: string;
  location: string;
  /** Sample/placeholder — swap in each substation's real photo. */
  image: string;
  /** Sample/placeholder — swap in each substation's real address. */
  address: string;
  /** Stagger index used by the scroll-reveal CSS and the auto-flip timing. */
  index?: number;
};

export function FlipCard({ name, location, image, address, index = 0 }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const userInteracted = useRef(false);
  const resumeAutoTimeout = useRef<number | undefined>(undefined);

  // Auto-cycle the flip on mobile, so people who never tap still see
  // the address/photo on the back. Pauses for a while after a manual
  // tap so it doesn't fight the person using it.
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 600px)").matches;
    if (!isMobile) return;

    const openFor = 2800;
    const closedFor = 3400;
    let cycleTimeout: number;

    const cycle = (flipTo: boolean) => {
      if (!userInteracted.current) {
        setIsFlipped(flipTo);
      }
      cycleTimeout = window.setTimeout(() => cycle(!flipTo), flipTo ? openFor : closedFor);
    };

    const startDelay = 1200 + index * 650;
    const startTimeout = window.setTimeout(() => cycle(true), startDelay);

    return () => {
      window.clearTimeout(startTimeout);
      window.clearTimeout(cycleTimeout);
    };
  }, [index]);

  const handleToggle = () => {
    userInteracted.current = true;
    setIsFlipped((v) => !v);

    // Let auto-cycling take back over a while after a manual tap.
    window.clearTimeout(resumeAutoTimeout.current);
    resumeAutoTimeout.current = window.setTimeout(() => {
      userInteracted.current = false;
    }, 6000);
  };

  return (
    <div
      className="card flip-card"
      data-reveal="pop"
      style={{ "--i": index } as React.CSSProperties}
    >
      <div
        className={`flip-card-inner${isFlipped ? " is-flipped" : ""}`}
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={`${name}. Press to ${isFlipped ? "hide" : "show"} location details`}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        {/* FRONT */}
        <div className="flip-card-face flip-card-front">
          <div className="card-body">
            <h3>{name}</h3>
            <p>{location}</p>
            <span className="flip-card-hint">Tap to view location ↻</span>
          </div>
        </div>

        {/* BACK */}
        <div className="flip-card-face flip-card-back">
          <img className="flip-card-image" src={image} alt={`${name} church`} />
          <div className="flip-card-back-body">
            <h3>{name}</h3>
            <p>{address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}