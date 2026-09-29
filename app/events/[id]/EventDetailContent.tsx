"use client";

import { PageHero } from "../../components/site";
import { useLanguage } from "../../components/LanguageProvider";
import { translations } from "@/lib/supabase/translations";

type EventItem = {
  id: string;
  title: string;
  description?: string | null;
  event_date: string | null;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  category?: string | null;
  image_url?: string | null;
} | null;

export default function EventDetailContent({ event }: { event: EventItem }) {
  const { language } = useLanguage();
  const t = translations[language].events;
  const isTamil = language === "ta";

  if (!event) {
    return (
      <main>
        <PageHero
          title={t.eventNotFoundTitle}
          crumb={t.crumb}
        />

        <section className="section">
          <div className="container">
            <h2 className="section-title">
              {t.eventNotFound}
            </h2>

            <p className="body-copy">
              {t.eventNotFoundDesc}
            </p>
          </div>
        </section>
      </main>
    );
  }

  const eventDate = event.event_date ? new Date(event.event_date) : null;

  const formattedDate = eventDate
    ? eventDate.toLocaleDateString(isTamil ? "ta-IN" : "en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : t.dateToBeAnnounced;

  const categoryLabel = event.category
    ? isTamil
      ? event.category.toLowerCase() === "feast events"
        ? "திருவிழா நிகழ்வுகள்"
        : event.category.toLowerCase() === "christmas"
        ? "கிறிஸ்துமஸ்"
        : event.category
      : event.category
    : null;

  return (
    <main>
      <PageHero
        title={event.title}
        crumb={t.crumb}
      />

      <section className="section">
        <div className="container two-col">
          {event.image_url && (
            <img
              className="photo"
              src={event.image_url}
              alt={event.title}
            />
          )}

          <div>
            {categoryLabel && (
              <div className="eyebrow">
                {categoryLabel}
              </div>
            )}

            <h2 className="section-title">
              {event.title}
            </h2>

            <div className="body-copy">
              <p>
                <strong>{t.dateLabel}</strong> {formattedDate}
              </p>

              {event.start_time && (
                <p>
                  <strong>{t.startTimeLabel}</strong>{" "}
                  {event.start_time.slice(0, 5)}
                </p>
              )}

              {event.end_time && (
                <p>
                  <strong>{t.endTimeLabel}</strong>{" "}
                  {event.end_time.slice(0, 5)}
                </p>
              )}

              {event.location && (
                <p>
                  <strong>{t.locationLabel}</strong>{" "}
                  {event.location}
                </p>
              )}
            </div>

            {event.description && (
              <p className="body-copy">
                {event.description}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
