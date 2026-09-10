import { PageHero } from "../../components/site";
import { getEventById } from "@/lib/supabase/events";

export default async function EventDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await getEventById(id);

  if (!event) {
    return (
      <main>
        <PageHero
          title="Event Not Found"
          crumb="Events"
        />

        <section className="section">
          <div className="container">
            <h2 className="section-title">
              Event not found
            </h2>

            <p className="body-copy">
              This event may have been removed or is no longer published.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const eventDate = event.event_date
    ? new Date(event.event_date)
    : null;

  const formattedDate = eventDate
    ? eventDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Date to be announced";

  return (
    <main>
      <PageHero
        title={event.title}
        crumb="Events"
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
            {event.category && (
              <div className="eyebrow">
                {event.category}
              </div>
            )}

            <h2 className="section-title">
              {event.title}
            </h2>

            <div className="body-copy">
              <p>
                <strong>Date:</strong> {formattedDate}
              </p>

              {event.start_time && (
                <p>
                  <strong>Start Time:</strong>{" "}
                  {event.start_time.slice(0, 5)}
                </p>
              )}

              {event.end_time && (
                <p>
                  <strong>End Time:</strong>{" "}
                  {event.end_time.slice(0, 5)}
                </p>
              )}

              {event.location && (
                <p>
                  <strong>Location:</strong>{" "}
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