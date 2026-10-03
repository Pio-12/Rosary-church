"use client";

import Link from "next/link";
import { useState } from "react";
import { LatinCross } from "@/app/components/LatinCross";
import { useLanguage } from "@/app/components/LanguageProvider";
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
  is_featured?: boolean;
};

type EventWithDate = EventItem & {
  event_date: string;
};

interface FeaturedEventFilterProps {
  events: EventItem[];
}

function getIndiaToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function isEventCompleted(
  eventDateStr: string,
  startTime?: string | null,
  endTime?: string | null
): boolean {
  const todayStr = getIndiaToday();
  if (eventDateStr < todayStr) return true;
  if (eventDateStr > todayStr) return false;

  const checkTime = endTime || startTime;
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
}

const monthNamesEn = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const monthNamesTa = [
  "ஜன",
  "பிப்",
  "மார்ச்",
  "ஏப்",
  "மே",
  "ஜூன்",
  "ஜூலை",
  "ஆக",
  "செப்",
  "அக்",
  "நவ",
  "டிச",
];

function formatDate(dateString: string, isTamil: boolean) {
  const [, month, day] = dateString.split("-").map(Number);
  const monthIndex = month - 1;

  return {
    day: String(day).padStart(2, "0"),
    month: isTamil
      ? monthNamesTa[monthIndex] ?? monthNamesEn[monthIndex]
      : monthNamesEn[monthIndex] ?? String(month),
  };
}

function formatTime(time?: string | null) {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default function FeaturedEventFilter({
  events,
}: FeaturedEventFilterProps) {
  const { language } = useLanguage();
  const t = translations[language].events;
  const common = translations[language].common;
  const isTamil = language === "ta";

  const today = getIndiaToday();
  const currentMonthPrefix = today.slice(0, 7); // e.g. "2026-10"

  const eventsWithDate: EventWithDate[] = events.filter(
    (event): event is EventWithDate => event.event_date !== null
  );

  /*
   * 1. This Month Events:
   * Displays all events occurring in the current month (both completed & upcoming).
   * Sorted chronologically.
   */
  const thisMonthEvents: EventWithDate[] = eventsWithDate
    .filter((event) => event.event_date.startsWith(currentMonthPrefix))
    .sort((a, b) => a.event_date.localeCompare(b.event_date));

  /*
   * 2. Upcoming Events:
   * Only events happening today or in the future.
   */
  const upcomingEvents: EventWithDate[] = eventsWithDate
    .filter((event) => event.event_date >= today)
    .sort((a, b) => a.event_date.localeCompare(b.event_date));

  /*
   * 3. All Events:
   * Both past and upcoming, ordered chronologically.
   */
  const allEvents: EventWithDate[] = [...eventsWithDate].sort((a, b) =>
    a.event_date.localeCompare(b.event_date)
  );

  /*
   * Categories tabs
   */
  const categories = [
    {
      id: "feast",
      label: t.feastEventsTab,
      value: "Feast Events",
    },
    {
      id: "christmas",
      label: t.christmasTab,
      value: "Christmas",
    },
  ];

  /*
   * Default filter is "this-month" so users immediately see all events for this month.
   */
  const [selectedCategory, setSelectedCategory] = useState("this-month");

  let displayedEvents: EventWithDate[] = [];

  if (selectedCategory === "this-month") {
    displayedEvents = thisMonthEvents;
  } else if (selectedCategory === "upcoming") {
    displayedEvents = upcomingEvents;
  } else if (selectedCategory === "all") {
    displayedEvents = allEvents;
  } else {
    displayedEvents = allEvents.filter(
      (event) =>
        event.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  const getCategoryLabel = (category?: string | null) => {
    if (!category) return null;
    if (isTamil) {
      if (category.toLowerCase() === "feast events") return "திருவிழா நிகழ்வுகள்";
      if (category.toLowerCase() === "christmas") return "கிறிஸ்துமஸ்";
      if (category.toLowerCase() === "regular celebrations") return "வழக்கமான திருப்பலி கொண்டாட்டங்கள்";
    }
    return category;
  };

  const getHeaderTitle = () => {
    if (selectedCategory === "this-month") return t.thisMonthHeader || "THIS MONTH'S EVENTS";
    if (selectedCategory === "upcoming") return t.upcomingEventsHeader;
    if (selectedCategory === "all") return t.allEventsHeader;
    if (selectedCategory === "feast") return t.feastEventsHeader;
    if (selectedCategory === "christmas") return t.christmasHeader;
    return t.allEventsHeader;
  };

  return (
    <div className="events-filter">
      {/* =========================================
          FILTER HEADER
      ========================================= */}
      <div className="events-filter-header">
        <div className="upcoming-title">
          <span>{getHeaderTitle()}</span>
          {selectedCategory === "this-month" && thisMonthEvents.length > 0 && (
            <span className="month-badge">({thisMonthEvents.length})</span>
          )}
        </div>

        {/* CATEGORY BUTTONS */}
        <div className="category-buttons" role="tablist" aria-label="Event category filters">
          {/* THIS MONTH (DEFAULT) */}
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "this-month"}
            className={
              selectedCategory === "this-month"
                ? "category-button active"
                : "category-button"
            }
            onClick={() => setSelectedCategory("this-month")}
          >
            {t.thisMonthTab || "This Month"}
          </button>

          {/* UPCOMING */}
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "upcoming"}
            className={
              selectedCategory === "upcoming"
                ? "category-button active"
                : "category-button"
            }
            onClick={() => setSelectedCategory("upcoming")}
          >
            {t.upcomingTab || "Upcoming"}
          </button>

          {/* ALL EVENTS */}
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "all"}
            className={
              selectedCategory === "all"
                ? "category-button active"
                : "category-button"
            }
            onClick={() => setSelectedCategory("all")}
          >
            {t.allEventsTab}
          </button>

          {/* PREDEFINED CATEGORIES */}
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category.id}
              className={
                selectedCategory === category.id
                  ? "category-button active"
                  : "category-button"
              }
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================
          EVENTS GRID
      ========================================= */}
      {displayedEvents.length === 0 ? (
        <div className="no-events">
          <div className="empty-cross" aria-hidden="true">
            <LatinCross />
          </div>
          <h3>{t.noEventsFound}</h3>
          <p>{t.noEventsDesc}</p>
        </div>
      ) : (
        <div className="events-grid">
          {displayedEvents.map((event) => {
            const date = formatDate(event.event_date, isTamil);
            const categoryLabel = getCategoryLabel(event.category);
            const isCompleted = isEventCompleted(
              event.event_date,
              event.start_time,
              event.end_time
            );

            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className={`event-card ${isCompleted ? "is-completed" : "is-upcoming"}`}
              >
                {/* IMAGE */}
                <div className="event-card-image">
                  {event.image_url ? (
                    <img src={event.image_url} alt={event.title} loading="lazy" />
                  ) : (
                    <div className="event-placeholder">
                      <span className="cross" aria-hidden="true">
                        <LatinCross />
                      </span>
                      <span>{common.churchName}</span>
                    </div>
                  )}

                  {/* STATUS BADGE */}
                  <span
                    className={`event-status-pill ${
                      isCompleted ? "status-completed" : "status-upcoming"
                    }`}
                  >
                    {isCompleted ? t.completedBadge : t.upcomingBadge}
                  </span>

                  {/* DATE BADGE */}
                  <div className={`event-date ${isCompleted ? "date-completed" : ""}`}>
                    <strong>{date.day}</strong>
                    <span>{date.month}</span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="event-card-content">
                  <div className="card-top-meta">
                    {categoryLabel && (
                      <span className="event-category">{categoryLabel}</span>
                    )}
                    {isCompleted && (
                      <span className="completed-tag">✓ {t.completedBadge}</span>
                    )}
                  </div>

                  <h3>{event.title}</h3>

                  {event.description && <p>{event.description}</p>}

                  {/* DETAILS */}
                  <div className="event-meta">
                    {event.start_time && (
                      <span>◷ {formatTime(event.start_time)}</span>
                    )}
                    {event.location && <span>⌖ {event.location}</span>}
                  </div>

                  {/* VIEW DETAILS */}
                  <div className="view-details">
                    <span>{t.viewDetails}</span>
                    <span className="arrow">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* =========================================
          CSS
      ========================================= */}
      <style jsx>{`
        .events-filter {
          width: 100%;
        }

        /* =====================================
           FILTER HEADER
        ===================================== */
        .events-filter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid #dce7eb;
        }

        .upcoming-title {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .upcoming-title span {
          color: #0b4f69;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .month-badge {
          background: #e2eef2;
          color: #0b4f69 !important;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 10px !important;
          letter-spacing: 0.05em !important;
        }

        /* =====================================
           CATEGORY BUTTONS
        ===================================== */
        .category-buttons {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 8px;
        }

        .category-button {
          padding: 8px 16px;
          border: 1px solid #cbdde3;
          border-radius: 30px;
          background: #ffffff;
          color: #0b4f69;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.25s ease;
        }

        .category-button:hover {
          border-color: #0b617f;
          background: #f2f8fa;
        }

        .category-button.active {
          border-color: #0b617f;
          background: #0b617f;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(11, 97, 127, 0.22);
        }

        /* =====================================
           EVENT GRID
        ===================================== */
        .events-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 26px;
        }

        /* =====================================
           EVENT CARD
        ===================================== */
        .event-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #dce7eb;
          color: inherit;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(0, 30, 45, 0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .event-card:hover {
          transform: translateY(-5px);
          border-color: #c4a04d;
          box-shadow: 0 18px 40px rgba(0, 70, 95, 0.12);
        }

        /* COMPLETED EVENT SOFT TREATMENT */
        .event-card.is-completed {
          background: #fbfcfe;
          border-color: #e5ecef;
          opacity: 0.92;
        }

        .event-card.is-completed:hover {
          transform: translateY(-3px);
          border-color: #94a3b8;
          box-shadow: 0 12px 28px rgba(0, 50, 70, 0.08);
          opacity: 1;
        }

        .event-card.is-completed .event-card-image img {
          filter: saturate(0.86) contrast(0.96);
        }

        /* =====================================
           IMAGE
        ===================================== */
        .event-card-image {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #e8f0f3;
        }

        .event-card-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.5s ease;
        }

        .event-card:hover .event-card-image img {
          transform: scale(1.04);
        }

        /* =====================================
           STATUS BADGE
        ===================================== */
        .event-status-pill {
          position: absolute;
          top: 14px;
          right: 14px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          z-index: 3;
          backdrop-filter: blur(8px);
        }

        .event-status-pill.status-completed {
          background: rgba(30, 41, 59, 0.78);
          color: #f1f5f9;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .event-status-pill.status-upcoming {
          background: rgba(181, 138, 54, 0.94);
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(181, 138, 54, 0.4);
        }

        /* =====================================
           IMAGE PLACEHOLDER
        ===================================== */
        .event-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #e7f0f3, #f7fafb);
          color: #0b617f;
        }

        .event-placeholder .cross {
          color: #b58a36;
          font-size: 36px;
        }

        .event-placeholder span:last-child {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.15em;
        }

        /* =====================================
           DATE
        ===================================== */
        .event-date {
          position: absolute;
          top: 14px;
          left: 14px;
          width: 52px;
          height: 58px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          z-index: 3;
        }

        .event-date strong {
          color: #0b4f69;
          font-family: Georgia, serif;
          font-size: 22px;
          line-height: 1;
        }

        .event-date span {
          margin-top: 4px;
          color: #b58a36;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .event-date.date-completed {
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .event-date.date-completed strong {
          color: #475569;
        }

        .event-date.date-completed span {
          color: #64748b;
        }

        /* =====================================
           CONTENT
        ===================================== */
        .event-card-content {
          padding: 20px 22px 22px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-top-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 7px;
        }

        .event-category {
          display: inline-block;
          color: #b58a36;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          line-height: 1.4;
          text-transform: uppercase;
        }

        .completed-tag {
          color: #64748b;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .event-card-content h3 {
          margin: 0 0 9px;
          color: #0b4f69;
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 400;
          line-height: 1.25;
        }

        .event-card.is-completed .event-card-content h3 {
          color: #1e3a47;
        }

        .event-card-content p {
          display: -webkit-box;
          overflow: hidden;
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.6;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        /* =====================================
           META
        ===================================== */
        .event-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 15px;
          padding-top: 13px;
          border-top: 1px solid #e5ecef;
          color: #718087;
          font-size: 10px;
        }

        .event-meta span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* =====================================
           VIEW DETAILS
        ===================================== */
        .view-details {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 16px;
          color: #0b617f;
          font-size: 11px;
          font-weight: 700;
        }

        .arrow {
          font-size: 17px;
          transition: transform 0.2s ease;
        }

        .event-card:hover .arrow {
          transform: translateX(4px);
        }

        /* =====================================
           EMPTY STATE
        ===================================== */
        .no-events {
          padding: 60px 20px;
          text-align: center;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #dce7eb;
        }

        .empty-cross {
          margin-bottom: 10px;
          color: #b58a36;
          font-size: 34px;
        }

        .no-events h3 {
          margin: 0 0 8px;
          color: #0b4f69;
          font-family: Georgia, serif;
          font-size: 24px;
          font-weight: 400;
        }

        .no-events p {
          margin: 0;
          color: #718087;
          font-size: 13px;
        }

        /* =====================================
           TABLET
        ===================================== */
        @media (max-width: 1000px) {
          .events-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }
        }

        /* =====================================
           MOBILE
        ===================================== */
        @media (max-width: 700px) {
          .events-filter-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 15px;
          }

          .category-buttons {
            width: 100%;
            justify-content: flex-start;
          }

          .events-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .category-button {
            padding: 8px 13px;
            font-size: 11px;
          }

          .event-card-image {
            aspect-ratio: 16 / 9;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
}