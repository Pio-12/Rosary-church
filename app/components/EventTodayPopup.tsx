"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, CalendarDays, MapPin, Clock, ArrowRight } from "lucide-react";

type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  category: string | null;
  image_url: string | null;
};

type Props = {
  events: Event[];
};

function getIndiaDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function formatTime(time: string | null) {
  if (!time) return null;

  const [hours, minutes] = time.split(":").map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return time;
  }

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function EventTodayPopup({
  events,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const today = getIndiaDate();

    const todaysEvents = events.filter(
      (event) => event.event_date === today
    );

    if (!todaysEvents.length) {
      return;
    }

    const storageKey = `today-event-popup-${today}`;

    const alreadyShown =
      window.localStorage.getItem(storageKey);

    if (!alreadyShown) {
      setOpen(true);
    }
  }, [events]);

  const closePopup = () => {
    const today = getIndiaDate();

    window.localStorage.setItem(
      `today-event-popup-${today}`,
      "true"
    );

    setOpen(false);
  };

  if (!mounted || !open) {
    return null;
  }

  const today = getIndiaDate();

  const todaysEvents = events.filter(
    (event) => event.event_date === today
  );

  if (!todaysEvents.length) {
    return null;
  }

  const event = todaysEvents[0];

  return (
    <div
      className="today-event-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="today-event-title"
    >
      <div
        className="today-event-backdrop"
        onClick={closePopup}
      />

      <div className="today-event-modal">
        <button
          type="button"
          className="today-event-close"
          onClick={closePopup}
          aria-label="Close today's event"
        >
          <X size={20} />
        </button>

        <div className="today-event-badge">
          <span />
          TODAY'S PARISH EVENT
        </div>

        {event.image_url ? (
          <div className="today-event-image">
            <img
              src={event.image_url}
              alt={event.title}
            />
          </div>
        ) : (
          <div className="today-event-image today-event-image-fallback">
            <CalendarDays size={48} />
          </div>
        )}

        <div className="today-event-content">
          {event.category && (
            <div className="today-event-category">
              {event.category}
            </div>
          )}

          <h2 id="today-event-title">
            {event.title}
          </h2>

          {event.description && (
            <p className="today-event-description">
              {event.description}
            </p>
          )}

          <div className="today-event-meta">
            {event.start_time && (
              <div>
                <Clock size={17} />
                <span>
                  {formatTime(event.start_time)}

                  {event.end_time
                    ? ` – ${formatTime(event.end_time)}`
                    : ""}
                </span>
              </div>
            )}

            {event.location && (
              <div>
                <MapPin size={17} />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          <Link
            href={`/events/${event.id}`}
            className="today-event-button"
            onClick={closePopup}
          >
            View Event
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}