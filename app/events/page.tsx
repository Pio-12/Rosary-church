import { getEvents } from "@/lib/supabase/events";
import EventTodayPopup from "@/app/components/EventTodayPopup";
import FeaturedEventFilter from "./EventCategoryFilter";

export const revalidate = 60;

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="events-page">

      {/* Today's event popup */}
      <EventTodayPopup events={events} />

      {/* ================= HERO ================= */}

      <section className="events-hero">

        <div className="hero-overlay" />

        <div className="container hero-content">

          <span className="eyebrow">
            OUR PARISH
          </span>

          <h1>
            Events & Celebrations
          </h1>

          <p>
            Join us in prayer, celebration and fellowship
            as our parish community comes together.
          </p>

          <a
            href="#featured-events"
            className="hero-button"
          >
            View Events
          </a>

        </div>

      </section>


      {/* ================= FEATURED / UPCOMING ================= */}

      <section
        id="featured-events"
        className="featured-section"
      >

        <div className="container">

          <div className="section-heading">

            <span className="eyebrow">
              PARISH CALENDAR
            </span>

            <h2>
              Featured Events
            </h2>

            <p>
              Discover our upcoming parish celebrations,
              feasts and special events.
            </p>

          </div>

          <FeaturedEventFilter events={events} />

        </div>

      </section>


      <style>{`

        /* =========================
           BASE
        ========================= */

        .events-page {
          background: #ffffff;
          color: #123f52;
        }

        .container {
          width: min(
            1180px,
            calc(100% - 40px)
          );

          margin: 0 auto;
        }


        /* =========================
           HERO
        ========================= */

        .events-hero {
          position: relative;

          min-height: 560px;

          display: flex;
          align-items: center;

          overflow: hidden;

          background:
            linear-gradient(
              100deg,
              rgba(4, 65, 88, 0.97),
              rgba(5, 89, 116, 0.86),
              rgba(5, 89, 116, 0.72)
            );

          color: white;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;

          background:
            radial-gradient(
              circle at 80% 30%,
              rgba(218, 171, 72, 0.20),
              transparent 35%
            );
        }

        .hero-content {
          position: relative;
          z-index: 2;

          padding: 100px 0;
        }

        .eyebrow {
          display: inline-block;

          margin-bottom: 14px;

          color: #b58a36;

          font-size: 11px;
          font-weight: 700;

          letter-spacing: 0.18em;

          text-transform: uppercase;
        }

        .events-hero .eyebrow {
          color: #e4bf6b;
        }

        .events-hero h1 {
          max-width: 850px;

          margin: 0;

          font-family: Georgia, serif;

          font-size:
            clamp(
              48px,
              7vw,
              82px
            );

          line-height: 1;

          font-weight: 400;

          letter-spacing: -0.04em;
        }

        .events-hero p {
          max-width: 620px;

          margin: 28px 0 32px;

          color:
            rgba(
              255,
              255,
              255,
              0.86
            );

          font-size: 18px;

          line-height: 1.7;
        }

        .hero-button {
          display: inline-block;

          padding: 14px 24px;

          background: #b58a36;

          color: white;

          text-decoration: none;

          font-size: 13px;
          font-weight: 700;

          transition:
            background 0.25s ease,
            transform 0.25s ease;
        }

        .hero-button:hover {
          background: #c49a4a;

          transform:
            translateY(-2px);
        }


        /* =========================
           FEATURED SECTION
        ========================= */

        .featured-section {
          padding: 90px 0;

          background: #f7fafb;
        }

        .section-heading {
          max-width: 700px;

          margin-bottom: 40px;
        }

        .section-heading h2 {
          margin: 0;

          color: #0b4f69;

          font-family: Georgia, serif;

          font-size:
            clamp(
              38px,
              5vw,
              56px
            );

          line-height: 1.1;

          font-weight: 400;

          letter-spacing: -0.035em;

          white-space: nowrap;
        }

        .section-heading p {
          margin: 16px 0 0;

          color: #687780;

          font-size: 15px;

          line-height: 1.7;
        }


        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 700px) {

          .container {
            width:
              calc(100% - 28px);
          }

          .events-hero {
            min-height: 500px;
          }

          .hero-content {
            padding: 80px 0;
          }

          .events-hero h1 {
            font-size: 48px;
          }

          .events-hero p {
            font-size: 15px;
          }

          .featured-section {
            padding: 65px 0;
          }

          .section-heading h2 {
            white-space: normal;
          }

        }

      `}</style>

    </main>
  );
}