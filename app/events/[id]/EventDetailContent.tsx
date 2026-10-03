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
        : event.category.toLowerCase() === "regular celebrations"
        ? "வழக்கமான திருப்பலி கொண்டாட்டங்கள்"
        : event.category
      : event.category
    : null;

  const isCompleted = event.event_date
    ? (() => {
        const todayStr = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date());
        if (event.event_date < todayStr) return true;
        if (event.event_date > todayStr) return false;
        const checkTime = event.end_time || event.start_time;
        if (!checkTime) return false;
        const [hours, minutes] = checkTime.split(":").map(Number);
        if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;
        const nowParts = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()).split(":");
        const currentH = Number(nowParts[0]);
        const currentM = Number(nowParts[1]);
        return currentH > hours || (currentH === hours && currentM >= minutes);
      })()
    : false;

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
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              {categoryLabel && (
                <div className="eyebrow" style={{ margin: 0 }}>
                  {categoryLabel}
                </div>
              )}
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: isCompleted ? "#f1f5f9" : "rgba(181, 138, 54, 0.15)",
                  color: isCompleted ? "#64748b" : "#b58a36",
                  border: isCompleted ? "1px solid #cbd5e1" : "1px solid rgba(181, 138, 54, 0.3)",
                }}
              >
                {isCompleted ? t.completedBadge : t.upcomingBadge}
              </span>
            </div>

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
