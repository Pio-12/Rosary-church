import { PageHero } from "../components/site";
import { getMassTimings } from "@/lib/supabase/mass-timings";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default async function MassTimings() {
  const massTimings = await getMassTimings();

  return (
    <main>
      <PageHero
        title="Mass Timings"
        crumb="Mass Timings"
      />

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Join us in prayer</div>

              <h2 className="section-title">
                Mass Schedule
              </h2>
            </div>
          </div>

          <div className="schedule">
            {massTimings.length === 0 ? (
              <div className="schedule-card">
                <h3>No Mass timings available</h3>

                <p>
                  Please check back later for the updated Mass schedule.
                </p>
              </div>
            ) : (
              massTimings.map((item) => (
                <div
                  className="schedule-card"
                  key={item.id}
                >
                  <h3>
                    {dayNames[item.day_of_week] ??
                      "Special Celebration"}
                  </h3>

                  <div className="schedule-row">
                    <span>
                      {item.title}
                    </span>

                    <span>
                      {item.time}
                    </span>
                  </div>

                  {item.language && (
                    <div className="schedule-row">
                      <span>
                        Language
                      </span>

                      <span>
                        {item.language}
                      </span>
                    </div>
                  )}

                  {item.description && (
                    <p className="body-copy">
                      {item.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}