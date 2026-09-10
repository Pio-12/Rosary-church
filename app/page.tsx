import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getSiteSettings } from "@/lib/supabase/site-settings";
import { getMassTimings } from "@/lib/supabase/mass-timings";

const milestones = [
  [
    "1592",
    "The Jesuits began the Madurai Mission with a small chapel dedicated to Our Lady.",
  ],
  [
    "1763",
    "A historical letter records a beautiful church near the West Gate of Madurai.",
  ],
  [
    "1770",
    "Jesuit missionaries continued serving the people around Rosary Church.",
  ],
  [
    "1939",
    "Fr. Yuvenat started the parish school.",
  ],
  [
    "1966",
    "Fr. De Cruz built a new church according to the liturgical renewal associated with the Second Vatican Council.",
  ],
];

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default async function Home() {
  const siteSettings = await getSiteSettings();
  const massTimings = await getMassTimings();

  return (
    <main>
      {/* HERO */}
      <section
        className="hero"
        style={
          siteSettings?.hero_image_url
            ? {
                backgroundImage: `url(${siteSettings.hero_image_url})`,
              }
            : undefined
        }
      >
        <div className="container">
          <div className="hero-inner">
            <div className="eyebrow">
              Established {siteSettings?.established_year ?? 1592}
            </div>

            <h1 className="serif">
              {siteSettings?.church_name ?? "Our Lady of"}
              <br />
              {!siteSettings?.church_name && "Holy Rosary Church"}
            </h1>

            <p>
              {siteSettings?.tagline ??
                "A living heritage of faith in the heart of Madurai."}
            </p>

            <div className="hero-actions">
              <Link className="button" href="/about">
                Explore Our Church <ArrowRight size={14} />
              </Link>

              <Link className="button outline" href="/mass-timings">
                Mass Timings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="section">
        <div className="container intro-grid">
          <img
            className="photo"
            src={
              siteSettings?.hero_image_url ||
              "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85"
            }
            alt="Historic church exterior"
          />

          <div className="intro-copy">
            <div className="eyebrow">Welcome</div>

            <h2 className="section-title">
              {siteSettings?.tagline ?? "A Place of Faith, Hope & Love"}
            </h2>

            <p>
              Nestled in the heart of Madurai,{" "}
              {siteSettings?.church_name ?? "Our Lady of Holy Rosary Church"}{" "}
              is a historic Catholic parish whose story reaches back to{" "}
              {siteSettings?.established_year ?? 1592}. Across generations,
              this sacred place has welcomed parishioners, pilgrims and
              visitors to a community centered on prayer, worship and service.
            </p>

            <Link className="button" href="/about">
              Discover Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container">
        <div className="stats">
          <div className="stat">
            <strong>{siteSettings?.established_year ?? 1592}</strong>
            <span>Founded</span>
          </div>

          <div className="stat">
            <strong>400+</strong>
            <span>Years of heritage</span>
          </div>

          <div className="stat">
            <strong>380</strong>
            <span>Parish families</span>
          </div>

          <div className="stat">
            <strong>4</strong>
            <span>Mission chapels</span>
          </div>
        </div>
      </section>

      {/* HISTORY */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Our story</div>

              <h2 className="section-title">
                Four Centuries of Faith
              </h2>
            </div>

            <Link className="button" href="/history">
              View history
            </Link>
          </div>

          <div className="timeline">
           {milestones.map(([year, text]) => (
  <div className="timeline-item" key={year}>
    <strong>{year}</strong>
    <p>{text}</p>
  </div>
))}
          </div>
        </div>
      </section>

      {/* LEGACY */}
      <section className="wine-band">
        <div className="container">
          <div className="eyebrow">A legacy of devotion</div>

          <h2 className="section-title">
            The Legacy of the Madurai Mission
          </h2>

          <div className="people-grid">
            {[
              [
                "Fr. Gonçalo Fernandes",
                "Pioneer missionary",
                "photo-1507692049790-de58290a4334",
              ],
              [
                "Robert de Nobili",
                "Jesuit missionary",
                "photo-1548625361-1e6f7a0e06a3",
              ],
              [
                "Veeramamunivar",
                "Scholar and poet",
                "photo-1548013146-72479768bada",
              ],
            ].map(([name, role, photo]) => (
              <div className="person" key={name}>
                <img
                  src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=600&q=80`}
                  alt={name}
                />

                <h3>{name}</h3>

                <p>{role} who shaped our shared story.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MASS */}
      <section className="section">
        <div className="container mass-strip">
          <img
            src="https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=900&q=85"
            alt="Chalice and candles prepared for Holy Mass"
          />

          <div>
            <div className="eyebrow">Join us in prayer</div>

            <h2 className="section-title">
              Holy Mass
            </h2>

            <p className="body-copy">
              Come together as a parish family. All are welcome at our regular
              celebrations.
            </p>

            <div className="mass-list">
              {massTimings.map((item) => (
                <div className="mass-card" key={item.id}>
                  <strong>
                    {dayNames[item.day_of_week] ?? "Special Celebration"}
                  </strong>

                  <span>
                    <Clock size={12} /> {item.time}
                  </span>
                </div>
              ))}
            </div>

            <Link
              className="button"
              href="/mass-timings"
              style={{ marginTop: 22 }}
            >
              View all mass times
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}