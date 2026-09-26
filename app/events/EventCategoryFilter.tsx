"use client";

import Link from "next/link";
import { useState } from "react";

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

function formatDate(dateString: string) {
  const [year, month, day] =
    dateString.split("-").map(Number);

  const date = new Date(
    year,
    month - 1,
    day
  );

  return {
    day: String(day).padStart(2, "0"),

    month: new Intl.DateTimeFormat("en-IN", {
      month: "short",
    }).format(date),
  };
}

function formatTime(time?: string | null) {
  if (!time) return "";

  const [hours, minutes] =
    time.split(":").map(Number);

  const date = new Date();

  date.setHours(
    hours,
    minutes,
    0,
    0
  );

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default function FeaturedEventFilter({
  events,
}: FeaturedEventFilterProps) {

  const today = getIndiaToday();

  /*
   * Featured Events
   * ----------------
   * Only upcoming events.
   */
  const eventsWithDate: EventWithDate[] = events.filter(
    (event): event is EventWithDate =>
      event.event_date !== null
  );

  const upcomingEvents: EventWithDate[] = eventsWithDate
    .filter(
      (event) =>
        event.event_date >= today
    )
    .sort((a, b) =>
      a.event_date.localeCompare(
        b.event_date
      )
    );


  /*
   * All events
   * ----------
   * Includes both past and upcoming events.
   */
  const allEvents: EventWithDate[] = [...eventsWithDate].sort(
    (a, b) =>
      b.event_date.localeCompare(
        a.event_date
      )
  );


  /*
   * Categories that we want to show.
   *
   * These are intentionally predefined.
   * Even if there are currently no events
   * under a category, the button remains.
   */
  const categories = [
    {
      id: "feast",
      label: "Feast Events",
      value: "Feast Events",
    },
    {
      id: "christmas",
      label: "Christmas",
      value: "Christmas",
    },
  ];


  /*
   * featured = upcoming events
   * all      = every event
   * feast    = Feast Events
   * christmas = Christmas
   */
  const [selectedCategory, setSelectedCategory] =
    useState("featured");


  /*
   * Decide what should be displayed.
   */
  let displayedEvents: EventWithDate[] = [];

  if (selectedCategory === "featured") {

    displayedEvents = upcomingEvents;

  } else if (selectedCategory === "all") {

    displayedEvents = allEvents;

  } else {

    displayedEvents = allEvents.filter(
      (event) =>
        event.category?.toLowerCase() ===
        selectedCategory.toLowerCase()
    );

  }


  return (
    <div className="events-filter">

      {/* =========================================
          FILTER HEADER
      ========================================= */}

      <div className="events-filter-header">

        <div className="upcoming-title">

          <span>
            {selectedCategory === "featured"
              ? "UPCOMING EVENTS"
              : selectedCategory === "all"
              ? "ALL EVENTS"
              : selectedCategory === "feast"
              ? "FEAST EVENTS"
              : "CHRISTMAS"}
          </span>

        </div>


        {/* CATEGORY BUTTONS */}

        <div className="category-buttons">

          {/* FEATURED */}

          <button
            type="button"
            className={
              selectedCategory === "featured"
                ? "category-button active"
                : "category-button"
            }
            onClick={() =>
              setSelectedCategory("featured")
            }
          >
            Featured
          </button>


          {/* ALL */}

          <button
            type="button"
            className={
              selectedCategory === "all"
                ? "category-button active"
                : "category-button"
            }
            onClick={() =>
              setSelectedCategory("all")
            }
          >
            All Events
          </button>


          {/* PREDEFINED CATEGORIES */}

          {categories.map((category) => (

            <button
              key={category.id}
              type="button"
              className={
                selectedCategory === category.id
                  ? "category-button active"
                  : "category-button"
              }
              onClick={() =>
                setSelectedCategory(
                  category.id
                )
              }
            >
              {category.label}
            </button>

          ))}

        </div>

      </div>


      {/* =========================================
          EVENTS
      ========================================= */}

      {displayedEvents.length === 0 ? (

        <div className="no-events">

          <div className="empty-cross">
            ✝
          </div>

          <h3>
            No Events Found
          </h3>

          <p>
            There are currently no events
            in this category.
          </p>

        </div>

      ) : (

        <div className="events-grid">

          {displayedEvents.map((event) => {

            const date =
              formatDate(
                event.event_date
              );

            return (

              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="event-card"
              >

                {/* IMAGE */}

                <div className="event-card-image">

                  {event.image_url ? (

                    <img
                      src={event.image_url}
                      alt={event.title}
                    />

                  ) : (

                    <div className="event-placeholder">

                      <span className="cross">
                        ✝
                      </span>

                      <span>
                        HOLY ROSARY CHURCH
                      </span>

                    </div>

                  )}


                  {/* DATE */}

                  <div className="event-date">

                    <strong>
                      {date.day}
                    </strong>

                    <span>
                      {date.month}
                    </span>

                  </div>

                </div>


                {/* CONTENT */}

                <div className="event-card-content">

                  {event.category && (

                    <span className="event-category">
                      {event.category}
                    </span>

                  )}


                  <h3>
                    {event.title}
                  </h3>


                  {event.description && (

                    <p>
                      {event.description}
                    </p>

                  )}


                  {/* DETAILS */}

                  <div className="event-meta">

                    {event.start_time && (

                      <span>
                        ◷{" "}
                        {formatTime(
                          event.start_time
                        )}
                      </span>

                    )}

                    {event.location && (

                      <span>
                        ⌖{" "}
                        {event.location}
                      </span>

                    )}

                  </div>


                  {/* VIEW DETAILS */}

                  <div className="view-details">

                    <span>
                      View Details
                    </span>

                    <span className="arrow">
                      →
                    </span>

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

          gap: 25px;

          margin-bottom: 32px;

          padding-bottom: 20px;

          border-bottom:
            1px solid #dce7eb;
        }


        .upcoming-title {
          flex-shrink: 0;
        }


        .upcoming-title span {
          color: #0b4f69;

          font-size: 11px;

          font-weight: 700;

          letter-spacing: 0.18em;

          text-transform: uppercase;
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

          border:
            1px solid #cbdde3;

          border-radius: 30px;

          background: #ffffff;

          color: #0b4f69;

          cursor: pointer;

          font-family: inherit;

          font-size: 12px;

          font-weight: 600;

          white-space: nowrap;

          transition:
            all 0.25s ease;
        }


        .category-button:hover {
          border-color: #0b617f;

          background: #f2f8fa;
        }


        .category-button.active {
          border-color: #0b617f;

          background: #0b617f;

          color: #ffffff;
        }


        /* =====================================
           EVENT GRID
        ===================================== */

        .events-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 26px;
        }


        /* =====================================
           EVENT CARD
        ===================================== */

        .event-card {
          display: block;

          overflow: hidden;

          background: #ffffff;

          border:
            1px solid #dce7eb;

          color: inherit;

          text-decoration: none;

          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }


        .event-card:hover {
          transform:
            translateY(-5px);

          border-color:
            #c4a04d;

          box-shadow:
            0 18px 40px
            rgba(
              0,
              70,
              95,
              0.10
            );
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

          transition:
            transform 0.5s ease;
        }


        .event-card:hover
        .event-card-image img {
          transform:
            scale(1.04);
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

          background:
            linear-gradient(
              135deg,
              #e7f0f3,
              #f7fafb
            );

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

          box-shadow:
            0 4px 14px
            rgba(
              0,
              0,
              0,
              0.12
            );
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


        /* =====================================
           CONTENT
        ===================================== */

        .event-card-content {
          padding: 20px 22px 22px;
        }


        .event-category {
          display: block;

          margin-bottom: 7px;

          color: #b58a36;

          font-size: 9px;

          font-weight: 700;

          letter-spacing: 0.08em;

          line-height: 1.4;

          text-transform: uppercase;
        }


        .event-card-content h3 {
          margin: 0 0 9px;

          color: #0b4f69;

          font-family: Georgia, serif;

          font-size: 22px;

          font-weight: 400;

          line-height: 1.25;
        }


        .event-card-content p {
          display: -webkit-box;

          overflow: hidden;

          margin: 0;

          color: #718087;

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

          border-top:
            1px solid #e5ecef;

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

          margin-top: 16px;

          color: #0b617f;

          font-size: 11px;

          font-weight: 700;
        }


        .arrow {
          font-size: 17px;

          transition:
            transform 0.2s ease;
        }


        .event-card:hover
        .arrow {
          transform:
            translateX(4px);
        }


        /* =====================================
           EMPTY STATE
        ===================================== */

        .no-events {
          padding: 60px 20px;

          text-align: center;

          background: #ffffff;

          border:
            1px solid #dce7eb;
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
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
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
  position: relative;
  width: 100%;
  height: 230px;
  overflow: hidden;
  background: #f1f5f6;

  display: flex;
  align-items: center;
  justify-content: center;
}

.event-card-image img {
  width: 100%;
  height: 100%;
  display: block;

  object-fit: contain;
  object-position: center;
}

        }

      `}</style>

    </div>
  );
}