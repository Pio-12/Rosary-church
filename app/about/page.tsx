import Link from "next/link";
import {
  MapPin,
  Phone,
  Cross,
  Users,
  BookOpen,
  Heart,
  Sparkles,
  ArrowDown,
  Church,
  ChevronRight,
  GraduationCap,
  Building2,
  Calendar,
  Shield,
  Layers,
} from "lucide-react";
import { getSiteSettings } from "@/lib/supabase/site-settings";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { AutoScrollCards } from "@/app/components/AutoScrollCards";
import { FlipCard } from "@/app/components/FlipCard";

/* =========================================================
   HISTORICAL TIMELINE (13 Milestones from 1592 to 2020)
   Preserving all historical records, dates, and narratives.
========================================================= */

const historyEntries = [
  {
    year: "1592",
    title: "Origins of the Madurai Mission",
    text: "The Madurai Mission began with a small chapel dedicated to Our Lady. Jesuit missionaries served the people of the region, laying the foundation for the Catholic mission in Madurai.",
  },
  {
    year: "1627",
    title: "Ministry of Fr. Robert de Nobili",
    text: "Fr. Robert de Nobili was appointed as the Parish Priest of the Madurai mission. He learned the language and culture of the local people and served the mission through his distinctive approach to evangelisation.",
  },
  {
    year: "1680",
    title: "Era of Veeramamunivar",
    text: "Fr. Joseph Beschi S.J., known as Veeramamunivar, continued the mission. His contribution to Tamil literature and culture became an important part of the history of the mission.",
  },
  {
    year: "1763",
    title: "Historical Sanctuary Built",
    text: "A church was built to serve the Catholic community. The directory records the connection of the church with the period of Yusuff Khan and the Catholic soldiers who served in his army.",
  },
  {
    year: "1773",
    title: "Padroado Stewardship",
    text: "Following the suppression of the Society of Jesus, the church came under the care of Padroado priests.",
  },
  {
    year: "1939",
    title: "Educational Ministry Begins",
    text: "Fr. Yuvenat started a school to educate the people. The parish continued to develop its educational mission alongside its spiritual ministry.",
  },
  {
    year: "1969–1970",
    title: "Post-Vatican II Rebuilding & Blessing",
    text: "Fr. De Cruz renovated and rebuilt the church. The new church was built according to the recommendations of the Second Vatican Council and was blessed in 1970 by Nuncio Knox.",
  },
  {
    year: "1982–1985",
    title: "Rosary Book Centre & Presbytery",
    text: "Fr. Arul Valan opened the Rosary Book Centre and built the presbytery in Palanganatham. These developments helped prepare the way for Palanganatham to become a separate parish.",
  },
  {
    year: "1985",
    title: "Birth of Palanganatham Parish",
    text: "Palanganatham became a new parish. The parish continued to serve surrounding communities through its growing pastoral mission.",
  },
  {
    year: "1988",
    title: "Solaialagupuram Substation Established",
    text: "A new church was built at Solaialagupuram through the efforts of Fr. Xavier Raj. The area subsequently developed as one of the important substations of the parish.",
  },
  {
    year: "1986",
    title: "Renowned Novena of Perpetual Help",
    text: "The Novena to Our Lady of Perpetual Help was renovated and celebrated as an important devotional tradition of the church. The church is known in the city particularly for this Novena.",
  },
  {
    year: "2020",
    title: "Golden Jubilee & Sacred Renovation",
    text: "The Golden Jubilee of the new church built in 1970 was celebrated. Fr. John Britto Packia Raj carried out extensive renovation and restructuring, including the second tower, electrified Rosary, stone images of the first parish priests, a new Eucharistic altar, Stations of the Cross, Gospel images and other improvements.",
  },
  {
    year: "8 March 2020",
    title: "Solemn Blessing by the Archbishop",
    text: "The renovated Golden Jubilee Church was solemnly blessed by Archbishop Antony Pappusamy during the Golden Jubilee celebration.",
  },
];

/* =========================================================
   SUBSTATIONS (Mission Chapels)
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
   PARISH LIFE PILLARS
========================================================= */

const parishLife = [
  {
    title: "Worship",
    text: "The parish community is centered on prayer, worship and the celebration of the Holy Eucharist.",
    icon: Church,
  },
  {
    title: "Community",
    text: "The parish brings families together through Anbiyams, the Parish Council and the Parish Finance Council.",
    icon: Users,
  },
  {
    title: "Service",
    text: "Parish associations, commissions and community groups provide opportunities for service, fellowship and participation.",
    icon: Heart,
  },
  {
    title: "Education",
    text: "The parish has a long-standing connection with education through institutions serving children and young people.",
    icon: BookOpen,
  },
];

/* =========================================================
   PARISH ASSOCIATIONS (8 Groups)
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
   SUCCESSION OF PARISH PRIESTS (24 Priests from 1627 to Present)
   Source: Directory 2021, page 270
========================================================= */

const parishPriests = [
  { year: "1627", name: "Fr. Robert De Nobili S.J." },
  { year: "1680", name: "Fr. Joseph Beshi S.J." },
  { year: "1939–1940", name: "Fr. C. Yuvenat S.J." },
  { year: "1941–1944", name: "Fr. M. D. Amalraj S.J." },
  { year: "1944–1947", name: "Fr. Consalves S.J." },
  { year: "1947–1949", name: "Fr. Planchart S.J." },
  { year: "1950–1957", name: "Fr. J. Britto S.J." },
  { year: "1957", name: "Fr. Claiton S.J." },
  { year: "1958", name: "Fr. Benjamin Nattar S.J." },
  { year: "1959–1960", name: "Fr. Maria Michael S.J." },
  { year: "1960–1966", name: "Fr. T. Kurian S.J." },
  { year: "1966–1972", name: "Fr. De Cruz S.J." },
  { year: "1972–1976", name: "Fr. Zacharias" },
  { year: "1976–1981", name: "Fr. J. Joseph Xavier" },
  { year: "1981–1982", name: "Fr. Sengole" },
  { year: "1982–1985", name: "Fr. Arul Valan" },
  { year: "1985–1992", name: "Fr. Xavier Raj" },
  { year: "1992–1993", name: "Fr. David Kulandai S.J." },
  { year: "1993–1997", name: "Fr. Lawrence Xavier" },
  { year: "1997–2004", name: "Fr. Jeganivasagar" },
  { year: "2004–2009", name: "Fr. Benedict Barnabas" },
  { year: "2009–2015", name: "Fr. Angel Raj" },
  { year: "2015–2020", name: "Fr. John Britto Packia Raj" },
  { year: "2020–", name: "Fr. Anandam" },
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
   SECTION TRANSITION DIVIDER HELPER
========================================================= */

function SectionDivider({
  toDark = false,
  inverted = false,
}: {
  toDark?: boolean;
  inverted?: boolean;
}) {
  return (
    <div
      className={`about-transition-divider ${
        toDark ? "divider-to-dark" : "divider-to-light"
      } ${inverted ? "divider-inverted" : ""}`}
      aria-hidden="true"
    >
      <div className="divider-ambient-glow" />
      <div className="divider-content">
        <span className="divider-line" />
        <span className="divider-cross">✝</span>
        <span className="divider-line" />
      </div>
    </div>
  );
}

/* =========================================================
   MAIN ABOUT PAGE COMPONENT
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
            filter: none !important;
          }
        `}</style>
      </noscript>

      {/* =====================================================
          1. CINEMATIC HERO SECTION
      ===================================================== */}
      <section className="about-hero" id="overview">
        {/* Layer 0: Slow zooming background image with Ken Burns motion */}
        <div
          className="about-hero-bg"
          style={{
            backgroundImage: `url(${
              siteSettings?.hero_image_url ||
              "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=85"
            })`,
          }}
          aria-hidden="true"
        />

        {/* Layer 1: Ethereal atmospheric gradients and ambient gold light */}
        <div className="about-hero-overlay" aria-hidden="true" />
        <div className="about-hero-glow" aria-hidden="true" />

        {/* Layer 2: Floating sacred light motes */}
        <div className="about-hero-particles" aria-hidden="true">
          <span className="particle p1" />
          <span className="particle p2" />
          <span className="particle p3" />
          <span className="particle p4" />
          <span className="particle p5" />
          <span className="particle p6" />
        </div>

        {/* Layer 3: Sacred Latin Cross watermark */}
        <div className="about-hero-watermark" aria-hidden="true">
          ✝
        </div>

        {/* Hero Content */}
        <div className="container about-hero-container">
          {/* Breadcrumbs */}
          <nav className="about-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/" className="crumb-link">
              Home
            </Link>
            <ChevronRight size={13} className="crumb-sep" />
            <span className="crumb-active">About Us</span>
          </nav>

          <div className="about-hero-eyebrow">
            <Sparkles size={14} className="eyebrow-icon" />
            <span>Our Parish & Spiritual Heritage</span>
            <Sparkles size={14} className="eyebrow-icon" />
          </div>

          <h1 className="about-hero-title serif">
            About Our Parish
          </h1>

          <p className="about-hero-subtitle">
            {siteSettings?.church_name ?? "Our Lady of Holy Rosary Church"}
          </p>

          <div className="about-hero-divider" aria-hidden="true">
            <span className="divider-half" />
            <span className="divider-cross">✝</span>
            <span className="divider-half" />
          </div>

          <p className="about-hero-lead">
            A sanctuary of devotion, faith, and service in the heart of Madurai
            since 1592, journeying together in the love of Christ and under the
            maternal mantle of Our Lady of the Holy Rosary.
          </p>

          {/* Quick cinematic navigation anchors */}
          <div className="about-hero-nav">
            <a href="#history" className="hero-pill-btn">
              <span>Historical Journey</span>
              <ArrowDown size={14} />
            </a>
            <a href="#priests" className="hero-pill-btn">
              <span>Priests Lineage</span>
              <ArrowDown size={14} />
            </a>
            <a href="#substations" className="hero-pill-btn">
              <span>Substations</span>
              <ArrowDown size={14} />
            </a>
            <a href="#community" className="hero-pill-btn">
              <span>Parish Life</span>
              <ArrowDown size={14} />
            </a>
          </div>
        </div>

        {/* Scroll down indicator */}
        <a
          href="#intro"
          className="about-scroll-indicator"
          aria-label="Scroll to content"
        >
          <span>Scroll to Discover</span>
          <ArrowDown size={14} />
        </a>
      </section>

      {/* =====================================================
          2. CINEMATIC INTRODUCTION
      ===================================================== */}
      <section className="section about-intro-section" id="intro">
        <div className="container two-col intro-grid">
          <div
            className="intro-copy-column"
            data-reveal="slide-left"
            style={{ "--i": 0 } as React.CSSProperties}
          >
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

            <blockquote className="quote cinematic-quote">
              <span className="quote-mark">“</span>
              Our Lady of Holy Rosary
              <br />
              <span className="quote-caption">Patroness of the Parish</span>
            </blockquote>
          </div>

          <div
            className="intro-image-column"
            data-reveal="slide-right"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            <div className="cinematic-photo-wrap">
              <div className="photo-glow" aria-hidden="true" />
              <img
                className="photo cinematic-photo"
                src={
                  siteSettings?.hero_image_url ||
                  "https://ncedxbcsrcwuoailxsph.supabase.co/storage/v1/object/public/church-images/home/gallery-2.jpg"
                }
                alt="Interior of Our Lady of Holy Rosary Church"
              />
              <div className="photo-frame-border" aria-hidden="true" />
              <div className="photo-caption-badge">
                <Church size={14} />
                <span>Our Lady of Holy Rosary Church, Madurai</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSITION TO MARIAN BLUE */}
      <SectionDivider toDark />

      {/* =====================================================
          3. PARISH IDENTITY & TODAY
      ===================================================== */}
      <section className="wine-band about-identity-section" id="identity">
        <div className="container">
          <div
            className="section-heading text-center"
            data-reveal="fade-up"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <div>
              <div className="eyebrow">Our Parish Today</div>

              <h2 className="section-title">
                A Community of Faith & Service
              </h2>

              <p className="body-copy text-subdued max-w-prose mx-auto">
                Guided by the Holy Spirit and bound in Christian charity, the
                parish continues its vibrant daily mission across Madurai.
              </p>
            </div>
          </div>

          <div className="cards-grid pop-grid identity-cards-grid">
            <div
              className="card pop-card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-icon-halo">
                  <MapPin size={22} />
                </div>
                <h3>Our Location</h3>
                <p>
                  {siteSettings?.address ??
                    "Madurai, Tamil Nadu, India"}
                </p>
              </div>
            </div>

            <div
              className="card pop-card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-icon-halo">
                  <Users size={22} />
                </div>
                <h3>Our Community</h3>
                <p>
                  A parish community brought together through prayer,
                  worship, service, Anbiyams and parish participation.
                </p>
              </div>
            </div>

            <div
              className="card pop-card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-icon-halo">
                  <Church size={22} />
                </div>
                <h3>Mission Chapels</h3>
                <p>
                  Four substations serve Catholic communities connected with
                  the parish.
                </p>
              </div>
            </div>

            <div
              className="card pop-card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-icon-halo">
                  <Sparkles size={22} />
                </div>
                <h3>Patroness</h3>
                <p>Our Lady of Holy Rosary</p>
              </div>
            </div>

            <div
              className="card pop-card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 4 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-icon-halo">
                  <Phone size={22} />
                </div>
                <h3>Telephone</h3>
                <p>{siteSettings?.phone ?? "0452-2343490"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSITION TO LIGHT */}
      <SectionDivider />

      {/* =====================================================
          4. SUBSTATIONS (Mission Chapels)
      ===================================================== */}
      <section className="section about-substations-section" id="substations">
        <div className="container">
          <div
            className="section-heading"
            data-reveal="fade-up"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <div>
              <div className="eyebrow">Serving Our Communities</div>

              <h2 className="section-title">
                Our Substations
              </h2>

              <p className="body-copy">
                Extending the spiritual reach of the parish across surrounding
                neighborhoods through consecrated chapels and vibrant local
                flocks.
              </p>
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

          <div className="mobile-scroll-hint" aria-hidden="true">
            <span>Tap card to view location details</span>
          </div>
        </div>
      </section>

      {/* TRANSITION TO MARIAN BLUE */}
      <SectionDivider toDark />

      {/* =====================================================
          5. PARISH LIFE & FELLOWSHIP
      ===================================================== */}
      <section className="wine-band about-parish-life-section" id="community">
        <div className="container">
          <div
            className="section-heading text-center"
            data-reveal="fade-up"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <div>
              <div className="eyebrow">Parish Life</div>

              <h2 className="section-title">
                Faith in Action
              </h2>

              <p className="body-copy text-subdued max-w-prose mx-auto">
                Rooted in the Gospel and the sacraments, every generation finds
                nurture and purpose within our parish ministries.
              </p>
            </div>
          </div>

          <div className="cards-grid parish-life-grid">
            {parishLife.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  className="card cinematic-card"
                  key={item.title}
                  data-reveal="fade-up"
                  style={{ "--i": index } as React.CSSProperties}
                >
                  <div className="card-body">
                    <div className="card-icon-halo">
                      <IconComp size={22} />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="about-extra-content"
            data-reveal="fade-up"
            style={{ "--i": 4 } as React.CSSProperties}
          >
            <div className="extra-content-box">
              <Layers className="extra-icon" size={24} />
              <p className="body-copy">
                The parish has <strong>19 Anbiyams</strong>, a Parish Council
                and a Parish Finance Council which encourage participation,
                fellowship and shared responsibility among parishioners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSITION TO LIGHT */}
      <SectionDivider />

      {/* =====================================================
          6. PARISH ASSOCIATIONS & PARTICIPATORY STRUCTURES
      ===================================================== */}
      <section className="section about-associations-section">
        <div className="container">
          <div
            className="section-heading"
            data-reveal="fade-up"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <div>
              <div className="eyebrow">Community Participation</div>

              <h2 className="section-title">
                Parish Associations
              </h2>

              <p className="body-copy">
                Organizations, devotional movements, and service ministries that
                give life to the spiritual mission of our parish.
              </p>
            </div>
          </div>

          <div className="cards-grid lr-grid associations-grid">
            {associations.map((association, index) => (
              <div
                className={`card lr-card cinematic-card ${
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
                  <div className="association-badge">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3>{association}</h3>
                  <p>
                    An important part of parish fellowship, service and
                    community participation.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Participatory Structures Subsection */}
          <div
            className="section-heading"
            data-reveal="fade-up"
            style={{ marginTop: 75, "--i": 0 } as React.CSSProperties}
          >
            <div>
              <div className="eyebrow">Parish Organisation</div>

              <h2 className="section-title">
                Participatory Structures
              </h2>

              <p className="body-copy">
                Collaborative councils that embody synodal governance, pastoral
                care, and shared accountability.
              </p>
            </div>
          </div>

          <div className="cards-grid structures-grid">
            {participatoryStructures.map((item, index) => (
              <div
                className="card cinematic-card structure-card"
                key={item}
                data-reveal="fade-up"
                style={{ "--i": index } as React.CSSProperties}
              >
                <div className="card-body">
                  <div className="card-icon-halo">
                    <Shield size={20} />
                  </div>
                  <h3>{item}</h3>
                  <p>
                    A part of the parish&apos;s structure for participation,
                    fellowship and shared responsibility.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSITION TO MARIAN BLUE */}
      <SectionDivider toDark />

      {/* =====================================================
          7. HISTORICAL JOURNEY (1592 to 2020)
      ===================================================== */}
      <section className="wine-band about-history-section" id="history">
        <div className="container">
          <div
            className="section-heading text-center"
            data-reveal="fade-up"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <div>
              <div className="eyebrow">A Heritage of Faith</div>

              <h2 className="section-title">
                Our History
              </h2>

              <p className="body-copy text-subdued max-w-prose mx-auto">
                A sacred chronicle spanning four centuries of Jesuit missionaries,
                revered poets, dedicated pastors, and generations of the faithful.
              </p>
            </div>
          </div>

          {/* Historic narrative two-col */}
          <div className="two-col history-narrative-grid">
            <div
              className="history-narrative-copy"
              data-reveal="slide-left"
              style={{ "--i": 0 } as React.CSSProperties}
            >
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

            <div
              className="history-narrative-media"
              data-reveal="slide-right"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <div className="cinematic-photo-wrap">
                <img
                  className="photo cinematic-photo"
                  src="https://ncedxbcsrcwuoailxsph.supabase.co/storage/v1/object/public/church-images/home/gallery-2.jpg"
                  alt="Our Lady of Holy Rosary Church"
                />
                <div className="photo-caption-badge">
                  <Calendar size={14} />
                  <span>The Living Sanctuary — Holy Rosary Church</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grand Illuminated Timeline */}
          <div
            className="section-heading text-center"
            data-reveal="fade-up"
            style={{ marginTop: 80, marginBottom: 40, "--i": 0 } as React.CSSProperties}
          >
            <div>
              <div className="eyebrow">Through the Years (1592 – 2020)</div>

              <h2 className="section-title">
                A Journey Through History
              </h2>
            </div>
          </div>

          <div className="history-timeline-container">
            {/* The continuous illuminated golden spine */}
            <div className="timeline-spine" aria-hidden="true">
              <span className="timeline-spine-glow" />
            </div>

            <div className="history-milestones-list">
              {historyEntries.map((entry, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    className={`history-milestone ${
                      isEven ? "milestone-left" : "milestone-right"
                    }`}
                    key={`${entry.year}-${index}`}
                    data-reveal={isEven ? "slide-left" : "slide-right"}
                    style={
                      {
                        "--i": index % 4,
                      } as React.CSSProperties
                    }
                  >
                    {/* Center glowing node */}
                    <div className="timeline-node" aria-hidden="true">
                      <span className="node-halo" />
                      <span className="node-core" />
                    </div>

                    {/* Milestone Card */}
                    <div className="milestone-card">
                      <div className="milestone-header">
                        <span className="milestone-year">{entry.year}</span>
                        <h3 className="milestone-title">{entry.title}</h3>
                      </div>
                      <p className="milestone-text">{entry.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* TRANSITION TO MARIAN BLUE ACCENT */}
      <SectionDivider toDark inverted />

      {/* =====================================================
          8. SUCCESSION OF PARISH PRIESTS (1627 to Present)
      ===================================================== */}
      <section className="wine-band about-priests-section" id="priests">
        <div className="container">
          <div
            className="section-heading text-center"
            data-reveal="fade-up"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <div>
              <div className="eyebrow">Leadership Through the Years</div>

              <h2 className="section-title">
                Succession of Parish Priests
              </h2>

              <p className="body-copy text-subdued max-w-prose mx-auto">
                Honoring the lineage of dedicated priests who have shepherded the
                faithful of Our Lady of Holy Rosary Church since Fr. Robert De
                Nobili in 1627.
              </p>
            </div>
          </div>

          {/* Sequential Priest Grid */}
          <div className="priest-timeline-grid mobile-snap-rail">
            {parishPriests.map((priest, index) => (
              <div
                className="priest-item cinematic-card"
                key={`${priest.year}-${priest.name}`}
                data-reveal="priest"
                style={
                  {
                    "--i": index % 6,
                  } as React.CSSProperties
                }
              >
                <div className="priest-node-connector" aria-hidden="true">
                  <span className="priest-connector-dot" />
                </div>

                <div className="priest-badge">
                  <span className="priest-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="priest-content">
                  <p className="priest-name">{priest.name}</p>
                  <span className="priest-period">{priest.year}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mobile-scroll-hint" aria-hidden="true">
            <span>Swipe to explore the succession of pastors →</span>
          </div>
        </div>
      </section>

      {/* TRANSITION TO LIGHT */}
      <SectionDivider />

      {/* =====================================================
          9. RELIGIOUS COMMUNITIES & INSTITUTIONS
      ===================================================== */}
      <section className="section about-institutions-section" id="institutions">
        <div className="container">
          {/* Religious Presence */}
          <div
            className="section-heading"
            data-reveal="fade-up"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <div>
              <div className="eyebrow">Religious Presence</div>

              <h2 className="section-title">
                Religious Communities in the Parish
              </h2>

              <p className="body-copy">
                Consecrated women religious actively serving our parish through
                prayer, education, and social charity.
              </p>
            </div>
          </div>

          <div className="cards-grid communities-grid">
            {religiousCommunities.map((community, index) => (
              <div
                className="card cinematic-card"
                key={community.name}
                data-reveal="fade-up"
                style={{ "--i": index } as React.CSSProperties}
              >
                <div className="card-body">
                  <div className="card-icon-halo">
                    <Heart size={20} />
                  </div>
                  <h3>{community.name}</h3>
                  <p className="detail-pill">{community.number}</p>
                  <p className="phone-line">
                    <Phone size={13} />
                    <span>{community.phone}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Secular Institute Note */}
          <div
            className="secular-institute-block"
            data-reveal="fade-up"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            <div className="eyebrow">Parish Information</div>
            <h3>Secular Institute</h3>
            <p className="body-copy">Nil</p>
          </div>

          {/* Educational Institutions Under Parish Priest */}
          <div
            className="section-heading"
            data-reveal="fade-up"
            style={{ marginTop: 70, "--i": 0 } as React.CSSProperties}
          >
            <div>
              <div className="eyebrow">Educational Institutions</div>

              <h2 className="section-title">
                Institutions Under the Parish Priest
              </h2>

              <p className="body-copy">
                Nurturing the minds and moral character of youth through Catholic
                primary and middle education.
              </p>
            </div>
          </div>

          <div className="cards-grid institutions-grid">
            {parishInstitutions.map((institution, index) => (
              <div
                className="card cinematic-card"
                key={institution.name}
                data-reveal="fade-up"
                style={{ "--i": index } as React.CSSProperties}
              >
                <div className="card-body">
                  <div className="card-icon-halo">
                    <GraduationCap size={20} />
                  </div>
                  <h3>{institution.name}</h3>
                  <p className="phone-line">
                    <Phone size={13} />
                    <span>{institution.phone}</span>
                  </p>
                  <p className="detail-pill">{institution.details}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Institutions Under Religious */}
          <div
            className="section-heading"
            data-reveal="fade-up"
            style={{ marginTop: 70, "--i": 0 } as React.CSSProperties}
          >
            <div>
              <div className="eyebrow">Religious Institutions</div>

              <h2 className="section-title">
                Institutions Under the Religious
              </h2>
            </div>
          </div>

          <div className="cards-grid institutions-grid">
            {religiousInstitutions.map((institution, index) => (
              <div
                className="card cinematic-card"
                key={institution.name}
                data-reveal="fade-up"
                style={{ "--i": index } as React.CSSProperties}
              >
                <div className="card-body">
                  <div className="card-icon-halo">
                    <Building2 size={20} />
                  </div>
                  <h3>{institution.name}</h3>
                  <p className="phone-line">
                    <Phone size={13} />
                    <span>{institution.phone}</span>
                  </p>
                  <p className="detail-pill">{institution.details}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Kurusadis & Grottos */}
          <div
            className="section-heading"
            data-reveal="fade-up"
            style={{ marginTop: 70, "--i": 0 } as React.CSSProperties}
          >
            <div>
              <div className="eyebrow">Places of Devotion</div>

              <h2 className="section-title">
                Kurusadis & Grottos in the Parish
              </h2>
            </div>
          </div>

          <div className="cards-grid grottos-grid">
            {kurusadis.map((item, index) => (
              <div
                className="card cinematic-card"
                key={item.name}
                data-reveal="fade-up"
                style={{ "--i": index } as React.CSSProperties}
              >
                <div className="card-body">
                  <div className="card-icon-halo">
                    <Cross size={20} />
                  </div>
                  <h3>{item.name}</h3>
                  <p className="location-line">
                    <MapPin size={13} />
                    <span>{item.location}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSITION TO MARIAN BLUE */}
      <SectionDivider toDark />

      {/* =====================================================
          10. PARISH LEGACY & CINEMATIC CLOSING
      ===================================================== */}
      <section className="wine-band about-legacy-section" id="legacy">
        <div className="container">
          <div
            className="section-heading text-center"
            data-reveal="fade-up"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <div>
              <div className="eyebrow">Continuing the Mission</div>

              <h2 className="section-title">
                A Living Heritage
              </h2>

              <p className="body-copy text-subdued max-w-prose mx-auto">
                Preserving our past while fostering faith, knowledge, and
                fraternity for generations to come.
              </p>
            </div>
          </div>

          <div className="cards-grid legacy-pillars-grid">
            <div
              className="card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-icon-halo">
                  <Cross size={22} />
                </div>
                <h3>Faith</h3>
                <p>
                  A parish rooted in prayer, worship and devotion to Our Lady of
                  Holy Rosary.
                </p>
              </div>
            </div>

            <div
              className="card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-icon-halo">
                  <BookOpen size={22} />
                </div>
                <h3>Education</h3>
                <p>
                  The parish has a long-standing educational mission, beginning
                  with the parish school started in 1939.
                </p>
              </div>
            </div>

            <div
              className="card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-icon-halo">
                  <Users size={22} />
                </div>
                <h3>Community</h3>
                <p>
                  The parish continues to serve its community through worship,
                  associations, schools and substations.
                </p>
              </div>
            </div>
          </div>

          {/* Spiritual Reflection Banner */}
          <div
            className="closing-reflection-banner"
            data-reveal="fade-up"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            <div className="reflection-watermark" aria-hidden="true">
              ✝
            </div>
            <div className="reflection-content">
              <span className="reflection-eyebrow">
                Sanctuary of Grace & Peace
              </span>
              <h3 className="reflection-heading serif">
                “Under the maternal mantle of Our Lady of Holy Rosary”
              </h3>
              <p className="reflection-lead">
                Whether you are a lifelong parishioner, a pilgrim visiting
                Madurai, or seeking a quiet place of prayer and community, our
                doors and hearts are open to welcome you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSITION TO LIGHT */}
      <SectionDivider />

      {/* =====================================================
          11. VISIT & CONTACT SECTION
      ===================================================== */}
      <section className="section about-contact-section" id="contact">
        <div className="container">
          <div
            className="section-heading"
            data-reveal="fade-up"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <div>
              <div className="eyebrow">Visit Us</div>

              <h2 className="section-title">
                Holy Rosary Church
              </h2>

              <p className="body-copy">
                Come, worship with us, and encounter the heritage and living
                presence of Christ in our parish.
              </p>
            </div>
          </div>

          <div className="contact-grid about-contact-grid">
            <div
              className="contact-card-box"
              data-reveal="slide-left"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <div className="contact-icon-halo">
                <MapPin size={22} />
              </div>
              <div className="contact-info-block">
                <h3>Address</h3>
                <p className="body-copy">
                  {siteSettings?.address ??
                    "Madurai, Tamil Nadu, India"}
                </p>
              </div>
            </div>

            <div
              className="contact-card-box"
              data-reveal="slide-right"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <div className="contact-icon-halo">
                <Phone size={22} />
              </div>
              <div className="contact-info-block">
                <h3>Telephone</h3>
                <p className="body-copy">
                  {siteSettings?.phone ?? "0452-2343490"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}