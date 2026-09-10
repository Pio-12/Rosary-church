import { PageHero } from "../components/site";
import { getSiteSettings } from "@/lib/supabase/site-settings";

const historyEntries = [
  [
    "1592",
    "The Jesuits began the Madurai Mission with a small chapel dedicated to Our Lady. The chapel was ministered by Fr. Fernandez, and missionaries including Robert de Nobili and Joseph Beschi later served in the mission.",
  ],
  [
    "1763",
    "A letter from 1763 records that Yousuf Khan, who opposed the English, had around 400 French soldiers, who were Catholics, and refers to a beautiful church built near the West Gate of Madurai.",
  ],
  [
    "1770",
    "From around 1770 onwards, Jesuit missionaries continued serving the people living around Rosary Church.",
  ],
  [
    "1773",
    "Following the suppression of the Society of Jesus, the church came under the care of Padroado priests.",
  ],
  [
    "1939",
    "Fr. Yuvenat started the parish school, adding education to the parish's service to the local community.",
  ],
  [
    "1966",
    "Fr. De Cruz took charge of the parish and built a new church according to the liturgical renewal associated with the Second Vatican Council.",
  ],
  [
    "1967",
    "The Novena to Our Lady of Perpetual Help was started and became part of the devotional life of the parish.",
  ],
  [
    "Later Years",
    "A new presbytery was built by Fr. Joseph Xavier. The parish also developed four substations serving communities in Solaialagupuram, Perungudi, St. Antony's Street and Simmakkal.",
  ],
];

const substations = [
  ["Our Lady of Mercy", "Solaialagupuram"],
  ["Immaculate Conception Church", "Perungudi"],
  ["St. Antony's Church", "St. Antony's Street"],
  ["St. Sebastian's Church", "Simmakkal"],
];

const parishLife = [
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
];

export default async function About() {
  const siteSettings = await getSiteSettings();

  return (
    <main>
      <PageHero title="About Us" crumb="About" />

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
              worship, community and service. Today, Holy Rosary Church remains
              a place where people gather in prayer and participate in the
              life of the parish.
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
            {substations.map(([name, location]) => (
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
            {parishLife.map(([title, text]) => (
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

      {/* HISTORY */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">A heritage of faith</div>

              <h2 className="section-title">
                Our History
              </h2>
            </div>
          </div>

          <div className="two-col">
            <div>
              <p className="body-copy">
                The history of Holy Rosary Church is closely connected with the
                history of the Catholic mission in Madurai. Beginning with the
                Madurai Mission in 1592, generations of missionaries and
                parishioners have contributed to the life and growth of the
                community.
              </p>

              <p className="body-copy">
                Through changing times, the parish has continued its mission
                of worship, education, devotion and service to the people of
                Madurai.
              </p>
            </div>

            <img
              className="photo"
              src="https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=900&q=85"
              alt="Church architecture and light"
            />
          </div>

          <div
            className="section-heading"
            style={{ marginTop: 60 }}
          >
            <div>
              <div className="eyebrow">Through the years</div>

              <h2 className="section-title">
                A Journey Through History
              </h2>
            </div>
          </div>

          <div className="history-list">
            {historyEntries.map(([year, text]) => (
              <div className="history-item" key={year}>
                <strong>{year}</strong>

                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARISH LEGACY */}
      <section className="wine-band">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Continuing the mission</div>

              <h2 className="section-title">
                A Living Heritage
              </h2>
            </div>
          </div>

          <div className="cards-grid">
            <div className="card">
              <div className="card-body">
                <h3>Faith</h3>

                <p>
                  A parish rooted in prayer, worship and devotion to Our Lady
                  of Holy Rosary.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3>Education</h3>

                <p>
                  The parish has a long connection with education, beginning
                  with the parish school started in 1939.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3>Community</h3>

                <p>
                  The parish continues to serve its community through its
                  worship, associations and four substations.
                </p>
              </div>
            </div>
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