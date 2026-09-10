import { PageHero } from "../components/site";

const entries = [
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

export default function History() {
  return (
    <main>
      <PageHero
        title="Our History"
        crumb="History"
      />

      {/* INTRODUCTION */}
      <section className="section">
        <div className="container two-col">
          <div>
            <div className="eyebrow">A heritage of faith</div>

            <h2 className="section-title">
              Rooted in Madurai
            </h2>

            <p className="body-copy">
              The history of Holy Rosary Church is closely connected with the
              history of the Catholic mission in Madurai. Beginning with the
              Madurai Mission in 1592, generations of missionaries and
              parishioners have contributed to the life and growth of the
              community.
            </p>

            <p className="body-copy">
              Through changing times, the parish has continued its mission of
              worship, education, devotion and service to the people of
              Madurai.
            </p>
          </div>

          <img
            className="photo"
            src="https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=900&q=85"
            alt="Church architecture and light"
          />
        </div>
      </section>

      {/* TIMELINE */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Through the years</div>

              <h2 className="section-title">
                A Journey Through History
              </h2>
            </div>
          </div>

          <div className="history-list">
            {entries.map(([year, text]) => (
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
    </main>
  );
}