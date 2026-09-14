"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

type LegacyPerson = {
  name: string;
  role: string;
  photo: string;
  shortDescription: string;
  description: string;
};

type LegacyPersonCardProps = {
  person: LegacyPerson;
  index: number;
};

export default function LegacyPersonCard({
  person,
  index,
}: LegacyPersonCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={`legacy-v2-card ${
        expanded ? "legacy-v2-card-open" : ""
      }`}
      style={{
        animationDelay: `${index * 150}ms`,
      }}
      onClick={() => setExpanded((value) => !value)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setExpanded((value) => !value);
        }
      }}
      tabIndex={0}
      role="button"
      aria-expanded={expanded}
    >
      <div className="legacy-v2-image">
        <img
          src={person.photo}
          alt={person.name}
        />

        <span className="legacy-v2-arrow">
          <ArrowRight
            size={17}
            className={expanded ? "legacy-v2-arrow-rotated" : ""}
          />
        </span>
      </div>

      <div className="legacy-v2-content">
        <h3>{person.name}</h3>

        <p className="legacy-v2-role">
          {person.role}
        </p>

        <p className="legacy-v2-short">
          {person.shortDescription}
        </p>

        {expanded && (
          <div className="legacy-v2-details">
            <p>{person.description}</p>

            <span className="legacy-v2-read-label">
              Tap to read less
            </span>
          </div>
        )}

        {!expanded && (
          <span className="legacy-v2-read-label">
            Tap to read more
          </span>
        )}
      </div>
    </article>
  );
}