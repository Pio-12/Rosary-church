import Link from "next/link";
import { PageHero } from "../components/site";
import { getEvents } from "@/lib/supabase/events";

export default async function Events() {
  const events = await getEvents();

  return (
    <main>
      <PageHero title="Events" crumb="Events" />

      <section className="section">
        <div className="container">
          <div className="filter-row">
            <button className="filter active">
              Upcoming Events
            </button>

            <button className="filter">
              Featured Events
            </button>

            <button className="filter">
              Past Events
            </button>
          </div>

          {events.length === 0 ? (
            <div className="card">
              <div className="card-body">
                <h3>No events available</h3>
                <p>
                  Please check back later for upcoming parish events.
                </p>
              </div>
            </div>
          ) : (
            <div className="cards-grid">
              {events.map((event) => {
                const eventDate = event.event_date
                  ? new Date(event.event_date)
                  : null;

                const date = eventDate
                  ? eventDate.toLocaleDateString("en-IN", {
                      day: "2-digit",
                    })
                  : "";

                const month = eventDate
                  ? eventDate.toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })
                  : "";

                return (
                  <article className="card" key={event.id}>
                    {event.image_url && (
                      <img
                        src={event.image_url}
                        alt={event.title}
                      />
                    )}

                    <div className="card-body">
                      <div className="eyebrow">
                        {date} {month}
                      </div>

                      <h3>{event.title}</h3>

                      <p>{event.description}</p>

                      {event.location && (
                        <p>{event.location}</p>
                      )}

                      <Link
                        className="button"
                        href={`/events/${event.id}`}
                      >
                        View Details
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}