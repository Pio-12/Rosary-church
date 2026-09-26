import { PageHero } from "../components/site";
import { getSiteSettings } from "@/lib/supabase/site-settings";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { AutoScrollCards } from "@/app/components/AutoScrollCards";
import { FlipCard } from "@/app/components/FlipCard";

/* =========================================================
   HISTORICAL TIMELINE
   Based on the parish directory information supplied.
========================================================= */

const historyEntries = [
  [
    "1592",
    "The Madurai Mission began with a small chapel dedicated to Our Lady. Jesuit missionaries served the people of the region, laying the foundation for the Catholic mission in Madurai.",
  ],
  [
    "1627",
    "Fr. Robert de Nobili was appointed as the Parish Priest of the Madurai mission. He learned the language and culture of the local people and served the mission through his distinctive approach to evangelisation.",
  ],
  [
    "1680",
    "Fr. Joseph Beschi S.J., known as Veeramamunivar, continued the mission. His contribution to Tamil literature and culture became an important part of the history of the mission.",
  ],
  [
    "1763",
    "A church was built to serve the Catholic community. The directory records the connection of the church with the period of Yusuff Khan and the Catholic soldiers who served in his army.",
  ],
  [
    "1773",
    "Following the suppression of the Society of Jesus, the church came under the care of Padroado priests.",
  ],
  [
    "1939",
    "Fr. Yuvenat started a school to educate the people. The parish continued to develop its educational mission alongside its spiritual ministry.",
  ],
  [
    "1969–1970",
    "Fr. De Cruz renovated and rebuilt the church. The new church was built according to the recommendations of the Second Vatican Council and was blessed in 1970 by Nuncio Knox.",
  ],
  [
    "1982–1985",
    "Fr. Arul Valan opened the Rosary Book Centre and built the presbytery in Palanganatham. These developments helped prepare the way for Palanganatham to become a separate parish.",
  ],
  [
    "1985",
    "Palanganatham became a new parish. The parish continued to serve surrounding communities through its growing pastoral mission.",
  ],
  [
    "1988",
    "A new church was built at Solaialagupuram through the efforts of Fr. Xavier Raj. The area subsequently developed as one of the important substations of the parish.",
  ],
  [
    "1986",
    "The Novena to Our Lady of Perpetual Help was renovated and celebrated as an important devotional tradition of the church. The church is known in the city particularly for this Novena.",
  ],
  [
    "2020",
    "The Golden Jubilee of the new church built in 1970 was celebrated. Fr. John Britto Packia Raj carried out extensive renovation and restructuring, including the second tower, electrified Rosary, stone images of the first parish priests, a new Eucharistic altar, Stations of the Cross, Gospel images and other improvements.",
  ],
  [
    "8 March 2020",
    "The renovated Golden Jubilee Church was solemnly blessed by Archbishop Antony Pappusamy during the Golden Jubilee celebration.",
  ],
];

/* =========================================================
   SUBSTATIONS
========================================================= */

const substations = [
  {
    name: "Our Lady of Mercy",
    location: "Solaialagupuram",
    image:
      "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=600&q=80",
    address: "Our Lady of Mercy Church, Solaialagupuram, Madurai",
  },
  {
    name: "Immaculate Conception Church",
    location: "Perungudi",
    image:
      "https://images.unsplash.com/photo-1543968996-ee822b8176ba?auto=format&fit=crop&w=600&q=80",
    address: "Immaculate Conception Church, Perungudi, Madurai",
  },
  {
    name: "St. Antony's Church",
    location: "St. Antony's Street",
    image:
      "https://images.unsplash.com/photo-1520645521318-f03a712f0e67?auto=format&fit=crop&w=600&q=80",
    address: "St. Antony's Church, St. Antony's Street, Madurai",
  },
  {
    name: "St. Sebastian's Church",
    location: "Simmakkal",
    image:
      "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=600&q=80",
    address: "St. Sebastian's Church, Simmakkal, Madurai",
  },
];

/* =========================================================
   PARISH LIFE
========================================================= */

const parishLife = [
  [
    "Worship",
    "The parish community is centered on prayer, worship and the celebration of the Holy Eucharist.",
  ],
  [
    "Community",
    "The parish brings families together through Anbiyams, the Parish Council and the Parish Finance Council.",
  ],
  [
    "Service",
    "Parish associations, commissions and community groups provide opportunities for service, fellowship and participation.",
  ],
  [
    "Education",
    "The parish has a long-standing connection with education through institutions serving children and young people.",
  ],
];

/* =========================================================
   ASSOCIATIONS
========================================================= */

const associations = [
  "Vincent De Paul Society",
  "Legion of Mary",
  "Dialogue Commission",
  "Christian Life Commission",
  "Choir",
  "Youth",
  "Altar Boys Society",
  "Sunday Catechism",
];

/* =========================================================
   SUCCESSION OF PARISH PRIESTS
   Source: Directory 2021, page 270
========================================================= */

const parishPriests = [
  ["1627", "Fr. Robert De Nobili S.J."],
  ["1680", "Fr. Joseph Beshi S.J."],
  ["1939–1940", "Fr. C. Yuvenat S.J."],
  ["1941–1944", "Fr. M. D. Amalraj S.J."],
  ["1944–1947", "Fr. Consalves S.J."],
  ["1947–1949", "Fr. Planchart S.J."],
  ["1950–1957", "Fr. J. Britto S.J."],
  ["1957", "Fr. Claiton S.J."],
  ["1958", "Fr. Benjamin Nattar S.J."],
  ["1959–1960", "Fr. Maria Michael S.J."],
  ["1960–1966", "Fr. T. Kurian S.J."],
  ["1966–1972", "Fr. De Cruz S.J."],
  ["1972–1976", "Fr. Zacharias"],
  ["1976–1981", "Fr. J. Joseph Xavier"],
  ["1981–1982", "Fr. Sengole"],
  ["1982–1985", "Fr. Arul Valan"],
  ["1985–1992", "Fr. Xavier Raj"],
  ["1992–1993", "Fr. David Kulandai S.J."],
  ["1993–1997", "Fr. Lawrence Xavier"],
  ["1997–2004", "Fr. Jeganivasagar"],
  ["2004–2009", "Fr. Benedict Barnabas"],
  ["2009–2015", "Fr. Angel Raj"],
  ["2015–2020", "Fr. John Britto Packia Raj"],
  ["2020–", "Fr. Anandam"],
];

/* =========================================================
   RELIGIOUS COMMUNITIES
========================================================= */

const religiousCommunities = [
  {
    name: "Congregation of Immaculate Conception",
    number: "Nos. 5",
    phone: "0452-2341362",
  },
  {
    name: "Congregation of St. Anne of Chennai",
    number: "Nos. 6",
    phone: "0452-2690745",
  },
];

/* =========================================================
   INSTITUTIONS UNDER PARISH PRIEST
========================================================= */

const parishInstitutions = [
  {
    name: "R. C. Primary School",
    phone: "0452-2343490",
    details: "Students: 112 | Staff: 6",
  },
  {
    name: "R. C. Middle School",
    phone: "0452-2343490",
    details: "Students: 250 | Staff: 12",
  },
];

/* =========================================================
   INSTITUTIONS UNDER RELIGIOUS
========================================================= */

const religiousInstitutions = [
  {
    name: "St. Anne's Hr. Sec. School",
    phone: "0452-2690101, 7402404500",
    details: "Students: 900 (35) | Staff: 26 (3)",
  },
];

/* =========================================================
   KURUSADIS / GROTTOS
========================================================= */

const kurusadis = [
  {
    name: "Sahayamatha Grotto",
    location: "Holy Rosary Church",
  },
  {
    name: "Bell Statues Tower",
    location: "Perungudi",
  },
];

/* =========================================================
   PARTICIPATORY STRUCTURES
========================================================= */

const participatoryStructures = [
  "19 Anbiyams",
  "Parish Council",
  "Parish Finance Council",
];

/* =========================================================
   MAIN PAGE
========================================================= */

export default async function About() {
  const siteSettings = await getSiteSettings();

  return (
    <main className="about-page">
      <ScrollReveal />
      <AutoScrollCards />

      <noscript>
        <style>{`
          .about-page [data-reveal] {
            opacity: 1 !important;
            transform: none !important;
          }
        `}</style>
      </noscript>

      {/* =====================================================
          HERO
      ===================================================== */}

      <PageHero title="About Us" crumb="About" />

      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="section">
        <div className="container two-col">
          <div>
            <div className="eyebrow">Our Parish</div>

            <h2 className="section-title">
              A Living Heritage of Faith
            </h2>

            <p className="body-copy">
              {siteSettings?.church_name ?? "Our Lady of Holy Rosary Church"}{" "}
              is a historic Catholic parish in the heart of Madurai. Its story
              is closely connected with the history of the Catholic mission in
              Madurai, which began in 1592 with a small chapel dedicated to Our
              Lady.
            </p>

            <p className="body-copy">
              Through generations of missionaries, parish priests, religious
              communities and parishioners, the church has grown as a centre of
              prayer, education, devotion and service.
            </p>

            <p className="body-copy">
              Today, Holy Rosary Church continues to serve the faithful through
              its worship, schools, associations, prayer traditions and
              communities.
            </p>

            <blockquote className="quote">
              “Our Lady of Holy Rosary”
              <br />
              <span>Patroness of the Parish</span>
            </blockquote>
          </div>

          <img
            className="photo"
            src={
              siteSettings?.hero_image_url ||
              "https://ncedxbcsrcwuoailxsph.supabase.co/storage/v1/object/public/church-images/home/gallery-2.jpg"
            }
            alt="Interior of Our Lady of Holy Rosary Church"
          />
        </div>
      </section>

      {/* =====================================================
          PARISH TODAY
      ===================================================== */}

      <section className="wine-band">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Our Parish Today</div>

              <h2 className="section-title">
                A Community of Faith & Service
              </h2>
            </div>
          </div>

          <div className="cards-grid pop-grid">
            <div
              className="card pop-card"
              data-reveal="pop"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <div className="card-body">
                <h3>Our Location</h3>

                <p>
                  {siteSettings?.address ??
                    "Madurai, Tamil Nadu, India"}
                </p>
              </div>
            </div>

            <div
              className="card pop-card"
              data-reveal="pop"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <div className="card-body">
                <h3>Our Community</h3>

                <p>
                  A parish community brought together through prayer,
                  worship, service, Anbiyams and parish participation.
                </p>
              </div>
            </div>

            <div
              className="card pop-card"
              data-reveal="pop"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              <div className="card-body">
                <h3>Mission Chapels</h3>

                <p>
                  Four substations serve Catholic communities connected with
                  the parish.
                </p>
              </div>
            </div>

            <div
              className="card pop-card"
              data-reveal="pop"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <div className="card-body">
                <h3>Patroness</h3>

                <p>Our Lady of Holy Rosary</p>
              </div>
            </div>

            <div
              className="card pop-card"
              data-reveal="pop"
              style={{ "--i": 4 } as React.CSSProperties}
            >
              <div className="card-body">
                <h3>Telephone</h3>

                <p>{siteSettings?.phone ?? "0452-2343490"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SUBSTATIONS
      ===================================================== */}

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Serving Our Communities</div>

              <h2 className="section-title">
                Our Substations
              </h2>
            </div>
          </div>

          <div className="cards-grid substations-grid">
            {substations.map((station, index) => (
              <FlipCard
                key={station.name}
                name={station.name}
                location={station.location}
                image={station.image}
                address={station.address}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          PARISH LIFE
      ===================================================== */}

      <section className="wine-band">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Parish Life</div>

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

          <div className="about-extra-content">
            <p className="body-copy">
              The parish has 19 Anbiyams, a Parish Council and a Parish Finance
              Council which encourage participation, fellowship and shared
              responsibility among parishioners.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          ASSOCIATIONS
      ===================================================== */}

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                Community Participation
              </div>

              <h2 className="section-title">
                Parish Associations
              </h2>
            </div>
          </div>

          <div className="cards-grid lr-grid">
            {associations.map((association, index) => (
              <div
                className={`card lr-card ${
                  index % 2 === 0 ? "lr-left" : "lr-right"
                }`}
                key={association}
                data-reveal="lr"
                style={
                  {
                    "--i": Math.floor(index / 2),
                  } as React.CSSProperties
                }
              >
                <div className="card-body">
                  <h3>{association}</h3>

                  <p>
                    An important part of parish fellowship, service and
                    community participation.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          PARTICIPATORY STRUCTURES
      ===================================================== */}

      <section className="wine-band">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                Parish Organisation
              </div>

              <h2 className="section-title">
                Participatory Structures
              </h2>
            </div>
          </div>

          <div className="cards-grid">
            {participatoryStructures.map((item) => (
              <div className="card" key={item}>
                <div className="card-body">
                  <h3>{item}</h3>

                  <p>
                    A part of the parish's structure for participation,
                    fellowship and shared responsibility.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          HISTORY
      ===================================================== */}

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">A Heritage of Faith</div>

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
                Madurai Mission, generations of missionaries and parishioners
                contributed to the spiritual and social development of the
                community.
              </p>

              <p className="body-copy">
                The church became an important centre of mission, devotion,
                education and community life. The Novena to Our Lady of
                Perpetual Help is particularly associated with the church and
                remains an important devotional tradition.
              </p>

              <p className="body-copy">
                Over the years, the parish expanded through the establishment
                of schools, substations, chapels and other pastoral structures.
              </p>
            </div>

            <img
              className="photo"
              src="https://ncedxbcsrcwuoailxsph.supabase.co/storage/v1/object/public/church-images/home/gallery-2.jpg"
              alt="Our Lady of Holy Rosary Church"
            />
          </div>

          <div
            className="section-heading"
            style={{ marginTop: 60 }}
          >
            <div>
              <div className="eyebrow">Through the Years</div>

              <h2 className="section-title">
                A Journey Through History
              </h2>
            </div>
          </div>

          <div className="journey-list">
            {historyEntries.map(([year, text], index) => (
              <div
                className="journey-item"
                key={`${year}-${index}`}
                data-reveal="line"
                style={
                  {
                    "--i": index % 5,
                  } as React.CSSProperties
                }
              >
                <strong>{year}</strong>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          SUCCESSION OF PARISH PRIESTS
      ===================================================== */}

      <section className="wine-band">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                Leadership Through the Years
              </div>

              <h2 className="section-title">
                Succession of Parish Priests
              </h2>
            </div>
          </div>

          <div className="priest-timeline">
            {parishPriests.map(([year, priest], index) => (
              <div
                className={`priest-item ${
                  index % 2 === 0
                    ? "priest-left"
                    : "priest-right"
                }`}
                key={`${year}-${priest}`}
                data-reveal="priest"
                style={
                  {
                    "--i": index % 4,
                  } as React.CSSProperties
                }
              >
                <span className="priest-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <p className="priest-name">{priest}</p>

                  <span className="priest-period">
                    {year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          PARISH LEGACY
      ===================================================== */}

      <section className="wine-band">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                Continuing the Mission
              </div>

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
                  The parish has a long-standing educational mission,
                  beginning with the parish school started in 1939.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3>Community</h3>

                <p>
                  The parish continues to serve its community through worship,
                  associations, schools and substations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          RELIGIOUS COMMUNITIES
      ===================================================== */}

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                Religious Presence
              </div>

              <h2 className="section-title">
                Religious Communities in the Parish
              </h2>
            </div>
          </div>

          <div className="cards-grid">
            {religiousCommunities.map((community) => (
              <div className="card" key={community.name}>
                <div className="card-body">
                  <h3>{community.name}</h3>

                  <p>{community.number}</p>

                  <p>{community.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          SECULAR INSTITUTE
      ===================================================== */}

      <section className="wine-band">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                Parish Information
              </div>

              <h2 className="section-title">
                Secular Institute
              </h2>
            </div>
          </div>

          <p className="body-copy">
            Nil
          </p>
        </div>
      </section>

      {/* =====================================================
          INSTITUTIONS UNDER PARISH PRIEST
      ===================================================== */}

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                Educational Institutions
              </div>

              <h2 className="section-title">
                Institutions Under the Parish Priest
              </h2>
            </div>
          </div>

          <div className="cards-grid">
            {parishInstitutions.map((institution) => (
              <div className="card" key={institution.name}>
                <div className="card-body">
                  <h3>{institution.name}</h3>

                  <p>{institution.phone}</p>

                  <p>{institution.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          INSTITUTIONS UNDER RELIGIOUS
      ===================================================== */}

      <section className="wine-band">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                Religious Institutions
              </div>

              <h2 className="section-title">
                Institutions Under the Religious
              </h2>
            </div>
          </div>

          <div className="cards-grid">
            {religiousInstitutions.map((institution) => (
              <div className="card" key={institution.name}>
                <div className="card-body">
                  <h3>{institution.name}</h3>

                  <p>{institution.phone}</p>

                  <p>{institution.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          KURUSADIS & GROTTOS
      ===================================================== */}

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                Places of Devotion
              </div>

              <h2 className="section-title">
                Kurusadis & Grottos in the Parish
              </h2>
            </div>
          </div>

          <div className="cards-grid">
            {kurusadis.map((item) => (
              <div className="card" key={item.name}>
                <div className="card-body">
                  <h3>{item.name}</h3>

                  <p>{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                Visit Us
              </div>

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
                  "Madurai, Tamil Nadu, India"}
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