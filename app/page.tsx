import Link from "next/link";
import { ArrowRight, Clock, ChevronDown } from "lucide-react";
import { getSiteSettings } from "@/lib/supabase/site-settings";
import { getMassTimings } from "@/lib/supabase/mass-timings";
// Adjust this import path to wherever you place ScrollReveal.tsx in your project
// (e.g. "@/components/ScrollReveal" if you have a components folder).
import ScrollReveal from "./ScrollReveal";
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
      {/* Renders nothing visible — turns the .reveal-up / .reveal-image /
          .stat / .timeline-item / .person-card / .mass-card fade-ins into
          real on-scroll animations. See ScrollReveal.tsx for details. */}
      <ScrollReveal />

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
        <div className="hero-glow" />
        <span className="hero-sparkle" aria-hidden="true" />
        <span className="hero-sparkle" aria-hidden="true" />
        <span className="hero-sparkle" aria-hidden="true" />

        <div className="container">
          <div className="hero-inner">
            <div className="eyebrow hero-eyebrow">
              Established {siteSettings?.established_year ?? 1592}
            </div>

            <h1 className="serif hero-title">
              {siteSettings?.church_name ?? "Our Lady of Holy Rosary Church"}
            </h1>

            <div className="hero-divider" />

            <p className="hero-description">
              {siteSettings?.tagline ??
                "A living heritage of faith in the heart of Madurai."}
            </p>

            <div className="hero-actions">
              <Link className="button hero-button" href="/about">
                Explore Our Church <ArrowRight size={14} />
              </Link>

              <Link className="button outline hero-button" href="/mass-timings">
                Mass Timings
              </Link>
            </div>
          </div>
        </div>

        <a href="#welcome" className="scroll-indicator">
          <span>Scroll to explore</span>
          <ChevronDown size={18} />
        </a>
      </section>

      {/* INTRO */}
      <section className="section home-intro" id="welcome">
        <div className="container intro-grid">
          <div className="intro-image-wrap reveal-image">
            <img
              className="photo intro-photo"
              src={
                siteSettings?.hero_image_url ||
                "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85"
              }
              alt="Historic church exterior"
            />

            <div className="image-frame" />
          </div>

          <div className="intro-copy reveal-up">
            <div className="eyebrow">Welcome to Holy Rosary</div>

            <h2 className="section-title">
              A Place of Faith,
              <br />
              Hope & Love
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
              Discover Our Story <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container">
        <div className="stats animated-stats">
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
          <div className="section-heading reveal-up">
            <div>
              <div className="eyebrow">Our story</div>

              <h2 className="section-title">
                Four Centuries of Faith
              </h2>
            </div>

            <Link className="button" href="/about">
              Explore Our History <ArrowRight size={14} />
            </Link>
          </div>

          <div className="timeline home-timeline">
            {milestones.map(([year, text], index) => (
              <div
                className="timeline-item reveal-up"
                key={year}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <strong>{year}</strong>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEGACY */}
      <section className="wine-band legacy-section">
        <div className="container">
          <div className="legacy-heading reveal-up">
            <div className="eyebrow">A legacy of devotion</div>

            <h2 className="section-title">
              The Legacy of the Madurai Mission
            </h2>

            <p>
              A story shaped by generations of missionaries, scholars and
              communities who served the people of Madurai.
            </p>
          </div>

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
            ].map(([name, role, photo], index) => (
              <div
                className="person person-card"
                key={name}
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <div className="person-image">
                  <img
                    src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=600&q=80`}
                    alt={name}
                  />

                  <div className="person-overlay">
                    <ArrowRight size={18} />
                  </div>
                </div>

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
          <div className="mass-image-wrap reveal-image">
            <img
              src="https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=900&q=85"
              alt="Chalice and candles prepared for Holy Mass"
            />

            <div className="mass-image-label">
              <span>Come and pray</span>
            </div>
          </div>

          <div className="reveal-up">
            <div className="eyebrow">Join us in prayer</div>

            <h2 className="section-title">
              Holy Mass
            </h2>

            <p className="body-copy">
              Come together as a parish family. All are welcome at our regular
              celebrations.
            </p>

            <div className="mass-list">
              {massTimings.slice(0, 6).map((item) => (
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
              View all mass times <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="home-cta">
        <div className="container">
          <div className="home-cta-inner">
            <div className="eyebrow">A place for everyone</div>

            <h2 className="serif">
              Come as you are.
              <br />
              Leave with hope.
            </h2>

            <p>
              Discover a community rooted in faith, prayer and service.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/contact">
                Visit Us <ArrowRight size={14} />
              </Link>

              <Link className="button outline" href="/readings">
                Today's Readings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}