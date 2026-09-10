import { PageHero } from "../components/site";
import { getSiteSettings } from "@/lib/supabase/site-settings";

export default async function About() {
  const siteSettings = await getSiteSettings();

  return (
    <main>
      {/* HERO */}
      <PageHero
        title="About Us"
        crumb="About"
      />

      {/* INTRODUCTION */}
      <section className="section">
        <div className="container two-col">
          <div>
            <div className="eyebrow">Our parish</div>

            <h2 className="section-title">
              A Living Heritage of Faith
            </h2>

            <p className="body-copy">
              {siteSettings?.church_name ?? "Holy Rosary Church"} is a historic
              Catholic parish in the heart of Madurai. The parish traces its
              roots to the beginning of the Madurai Mission in 1592, when the
              Jesuits began their mission with a small chapel dedicated to Our
              Lady.
            </p>

            <p className="body-copy">
              Across generations, the parish has continued its mission of
              worship, community and service. Today, Holy Rosary Church
              remains a place where people gather in prayer and participate
              in the life of the parish.
            </p>

            <blockquote className="quote">
              “Our Lady of Holy Rosary”
              <br />
              <span>Patron Saint</span>
            </blockquote>
          </div>

          <img
            className="photo"
            src={
              siteSettings?.hero_image_url ||
              "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=1000&q=85"
            }
            alt="Interior of Holy Rosary Church"
          />
        </div>
      </section>

      {/* PARISH DETAILS */}
      <section className="wine-band">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Our parish today</div>

              <h2 className="section-title">
                A Community of Faith & Service
              </h2>
            </div>
          </div>

          <div className="cards-grid">
            <div className="card">
              <div className="card-body">
                <h3>Our Location</h3>

                <p>
                  {siteSettings?.address ??
                    "Town Hall Road, Madurai – 625 001"}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3>Our Community</h3>

                <p>
                  The parish serves about 380 Catholic families and continues
                  to foster a vibrant community of faith.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3>Mission Chapels</h3>

                <p>
                  The parish has four substations serving communities around
                  Madurai.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUBSTATIONS */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Serving our communities</div>

              <h2 className="section-title">
                Our Substations
              </h2>
            </div>
          </div>

          <div className="cards-grid">
            {[
              [
                "Our Lady of Mercy",
                "Solaialagupuram",
              ],
              [
                "Immaculate Conception Church",
                "Perungudi",
              ],
              [
                "St. Antony’s Church",
                "St. Antony’s Street",
              ],
              [
                "St. Sebastian’s Church",
                "Simmakkal",
              ],
            ].map(([name, location]) => (
              <div className="card" key={name}>
                <div className="card-body">
                  <h3>{name}</h3>
                  <p>{location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARISH LIFE */}
      <section className="wine-band">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Parish life</div>

              <h2 className="section-title">
                Faith in Action
              </h2>
            </div>
          </div>

          <div className="cards-grid">
            {[
              [
                "Worship",
                "A parish community centered on prayer, worship and the celebration of faith.",
              ],
              [
                "Community",
                "The parish brings families together through participatory structures including Anbiyams and the Parish Council.",
              ],
              [
                "Service",
                "Parish associations and commissions provide opportunities for service, fellowship and community participation.",
              ],
            ].map(([title, text]) => (
              <div className="card" key={title}>
                <div className="card-body">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT DETAILS */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Visit us</div>

              <h2 className="section-title">
                Holy Rosary Church
              </h2>
            </div>
          </div>

          <div className="contact-grid">
            <div>
              <h3>Address</h3>

              <p className="body-copy">
                {siteSettings?.address ??
                  "Town Hall Road, Madurai – 625 001"}
              </p>
            </div>

            <div>
              <h3>Telephone</h3>

              <p className="body-copy">
                {siteSettings?.phone ?? "0452-2343490"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}