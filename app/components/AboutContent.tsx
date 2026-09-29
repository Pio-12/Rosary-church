"use client";

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
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { AutoScrollCards } from "@/app/components/AutoScrollCards";
import { FlipCard } from "@/app/components/FlipCard";
import { LatinCross } from "@/app/components/LatinCross";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/supabase/translations";

type SiteSettings = {
  hero_image_url?: string | null;
  established_year?: number | null;
  church_name?: string | null;
  tagline?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
} | null;

const substationImages = [
  "https://ncedxbcsrcwuoailxsph.supabase.co/storage/v1/object/public/church-images/sholai%20alagupuram.jpeg",
  "https://ncedxbcsrcwuoailxsph.supabase.co/storage/v1/object/public/church-images/perungudi.jpeg",
  "https://ncedxbcsrcwuoailxsph.supabase.co/storage/v1/object/public/church-images/antony.jpeg",
  "https://ncedxbcsrcwuoailxsph.supabase.co/storage/v1/object/public/church-images/simmakal.jpeg",
];

const parishLifeIcons = [Church, Users, Heart, BookOpen];

/* Succession of 25 Parish Priests from 1627 to Present */
const parishPriestData = [
  { year: "1627", en: "Fr. Robert De Nobili S.J.", ta: "அருட்தந்தை ராபர்ட் டி நொபிலி S.J." },
  { year: "1680", en: "Fr. Joseph Beshi S.J.", ta: "அருட்தந்தை ஜோசப் பெஸ்கி (வீரமாமுனிவர்) S.J." },
  { year: "1939–1940", en: "Fr. C. Yuvenat S.J.", ta: "அருட்தந்தை C. யூவனத் S.J." },
  { year: "1941–1944", en: "Fr. M. D. Amalraj S.J.", ta: "அருட்தந்தை M. D. அமல்ராஜ் S.J." },
  { year: "1944–1947", en: "Fr. Consalves S.J.", ta: "அருட்தந்தை கோன்சால்வஸ் S.J." },
  { year: "1947–1949", en: "Fr. Planchart S.J.", ta: "அருட்தந்தை பிளான்சார்ட் S.J." },
  { year: "1950–1957", en: "Fr. J. Britto S.J.", ta: "அருட்தந்தை J. பிரிட்டோ S.J." },
  { year: "1957", en: "Fr. Claiton S.J.", ta: "அருட்தந்தை கிளேட்டன் S.J." },
  { year: "1958", en: "Fr. Benjamin Nattar S.J.", ta: "அருட்தந்தை பெஞ்சமின் நாட்டார் S.J." },
  { year: "1959–1960", en: "Fr. Maria Michael S.J.", ta: "அருட்தந்தை மரிய மைக்கேல் S.J." },
  { year: "1960–1966", en: "Fr. T. Kurian S.J.", ta: "அருட்தந்தை T. குரியன் S.J." },
  { year: "1966–1972", en: "Fr. De Cruz S.J.", ta: "அருட்தந்தை டி குரூஸ் S.J." },
  { year: "1972–1976", en: "Fr. Zacharias", ta: "அருட்தந்தை சக்கரியாஸ்" },
  { year: "1976–1981", en: "Fr. J. Joseph Xavier", ta: "அருட்தந்தை J. ஜோசப் சேவியர்" },
  { year: "1981–1982", en: "Fr. Sengole", ta: "அருட்தந்தை செங்கோல்" },
  { year: "1982–1985", en: "Fr. Arul Valan", ta: "அருட்தந்தை அருள் வளன்" },
  { year: "1985–1992", en: "Fr. Xavier Raj", ta: "அருட்தந்தை சேவியர் ராஜ்" },
  { year: "1992–1993", en: "Fr. David Kulandai S.J.", ta: "அருட்தந்தை டேவிட் குழந்தை S.J." },
  { year: "1993–1997", en: "Fr. Lawrence Xavier", ta: "அருட்தந்தை லாரன்ஸ் சேவியர்" },
  { year: "1997–2004", en: "Fr. Jeganivasagar", ta: "அருட்தந்தை ஜெகனிவாசகர்" },
  { year: "2004–2009", en: "Fr. Benedict Barnabas", ta: "அருட்தந்தை பெனடிக்ட் பர்னபாஸ்" },
  { year: "2009–2015", en: "Fr. Angel Raj", ta: "அருட்தந்தை ஏஞ்சல் ராஜ்" },
  { year: "2015–2020", en: "Fr. John Britto Packia Raj", ta: "அருட்தந்தை ஜான் பிரிட்டோ பாக்கியராஜ்" },
  { year: "2020–2023", en: "Fr. Anandam", ta: "அருட்தந்தை ஆனந்தம்" },
  { year: "2023–Present", en: "Fr. Amal Raj", ta: "அருட்தந்தை அமல் ராஜ்" },
];

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
        <span className="divider-cross">
          <LatinCross />
        </span>
        <span className="divider-line" />
      </div>
    </div>
  );
}

export default function AboutContent({
  siteSettings,
}: {
  siteSettings: SiteSettings;
}) {
  const { language } = useLanguage();
  const t = translations[language].about;
  const common = translations[language].common;

  const churchName =
    language === "ta"
      ? common.churchName
      : siteSettings?.church_name ?? common.churchName;

  const phone = siteSettings?.phone ?? "0452-2343490";
  const address =
    language === "ta"
      ? "டவுன் ஹால் சாலை, மதுரை, தமிழ்நாடு - 625001"
      : siteSettings?.address ?? "Town Hall Road, Madurai, Tamil Nadu - 625001";

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

        <div className="about-hero-overlay" aria-hidden="true" />
        <div className="about-hero-glow" aria-hidden="true" />

        <div className="about-hero-particles" aria-hidden="true">
          <span className="particle p1" />
          <span className="particle p2" />
          <span className="particle p3" />
          <span className="particle p4" />
          <span className="particle p5" />
          <span className="particle p6" />
        </div>

        <div className="about-hero-watermark" aria-hidden="true">
          <LatinCross />
        </div>

        <div className="container about-hero-container">
          <nav className="about-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/" className="crumb-link">
              {common.home}
            </Link>
            <ChevronRight size={13} className="crumb-sep" />
            <span className="crumb-active">{t.crumb}</span>
          </nav>

          <div className="about-hero-eyebrow">
            <Sparkles size={14} className="eyebrow-icon" />
            <span>{t.heroEyebrow}</span>
            <Sparkles size={14} className="eyebrow-icon" />
          </div>

          <h1 className="about-hero-title serif">{t.heroTitle}</h1>

          <p className="about-hero-subtitle">{churchName}</p>

          <div className="about-hero-divider" aria-hidden="true">
            <span className="divider-half" />
            <span className="divider-cross">
              <LatinCross />
            </span>
            <span className="divider-half" />
          </div>

          <p className="about-hero-lead">{t.heroLead}</p>

          <div className="about-hero-nav">
            <a href="#history" className="hero-pill-btn">
              <span>{t.quickNavHistory}</span>
              <ArrowDown size={14} />
            </a>
            <a href="#priests" className="hero-pill-btn">
              <span>{t.quickNavPriests}</span>
              <ArrowDown size={14} />
            </a>
            <a href="#substations" className="hero-pill-btn">
              <span>{t.quickNavSubstations}</span>
              <ArrowDown size={14} />
            </a>
            <a href="#community" className="hero-pill-btn">
              <span>{t.quickNavParishLife}</span>
              <ArrowDown size={14} />
            </a>
          </div>
        </div>

        <a
          href="#intro"
          className="about-scroll-indicator"
          aria-label={t.scrollDiscover}
        >
          <span>{t.scrollDiscover}</span>
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
            <div className="eyebrow">{t.introEyebrow}</div>

            <h2 className="section-title">{t.introTitle}</h2>

            <p className="body-copy">
              {churchName} {t.introP1}
            </p>

            <p className="body-copy">{t.introP2}</p>

            <p className="body-copy">{t.introP3}</p>

            <blockquote className="quote cinematic-quote">
              <span className="quote-mark">“</span>
              {t.quoteText}
              <br />
              <span className="quote-caption">{t.quoteCaption}</span>
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
                alt={t.photoBadge}
              />
              <div className="photo-frame-border" aria-hidden="true" />
              <div className="photo-caption-badge">
                <Church size={14} />
                <span>{t.photoBadge}</span>
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
              <div className="eyebrow">{t.identityEyebrow}</div>

              <h2 className="section-title">{t.identityTitle}</h2>

              <p className="body-copy text-subdued max-w-prose mx-auto">
                {t.identityDescription}
              </p>
            </div>
          </div>

          <div className="cards-grid pop-grid identity-cards-grid auto-scroll-rail">
            <div
              className="card pop-card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-header-row">
                  <div className="card-icon-halo">
                    <MapPin size={22} />
                  </div>
                  <span className="card-step-badge">01</span>
                </div>
                <h3>{t.locationTitle}</h3>
                <p>{address}</p>
              </div>
            </div>

            <div
              className="card pop-card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-header-row">
                  <div className="card-icon-halo">
                    <Users size={22} />
                  </div>
                  <span className="card-step-badge">02</span>
                </div>
                <h3>{t.communityTitle}</h3>
                <p>{t.communityDesc}</p>
              </div>
            </div>

            <div
              className="card pop-card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-header-row">
                  <div className="card-icon-halo">
                    <Church size={22} />
                  </div>
                  <span className="card-step-badge">03</span>
                </div>
                <h3>{t.chapelsTitle}</h3>
                <p>{t.chapelsDesc}</p>
              </div>
            </div>

            <div
              className="card pop-card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-header-row">
                  <div className="card-icon-halo">
                    <Sparkles size={22} />
                  </div>
                  <span className="card-step-badge">04</span>
                </div>
                <h3>{t.patronessTitle}</h3>
                <p>{t.patronessName}</p>
              </div>
            </div>

            <div
              className="card pop-card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 4 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-header-row">
                  <div className="card-icon-halo">
                    <Phone size={22} />
                  </div>
                  <span className="card-step-badge">05</span>
                </div>
                <h3>{t.telephoneTitle}</h3>
                <p>{phone}</p>
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
              <div className="eyebrow">{t.substationsEyebrow}</div>

              <h2 className="section-title">{t.substationsTitle}</h2>

              <p className="body-copy">{t.substationsDescription}</p>
            </div>
          </div>

          <div className="cards-grid substations-grid auto-scroll-rail">
            {t.substations.map((station, index) => (
              <FlipCard
                key={station.name}
                name={station.name}
                location={station.location}
                image={substationImages[index]}
                address={station.address}
                index={index}
              />
            ))}
          </div>

          <div className="mobile-scroll-hint" aria-hidden="true">
            <span>{t.substationsHint}</span>
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
              <div className="eyebrow">{t.parishLifeEyebrow}</div>

              <h2 className="section-title">{t.parishLifeTitle}</h2>

              <p className="body-copy text-subdued max-w-prose mx-auto">
                {t.parishLifeDescription}
              </p>
            </div>
          </div>

          <div className="cards-grid parish-life-grid auto-scroll-rail">
            {t.parishLifeItems.map((item, index) => {
              const IconComp = parishLifeIcons[index] ?? Church;
              return (
                <div
                  className="card cinematic-card"
                  key={item.title}
                  data-reveal="fade-up"
                  style={{ "--i": index } as React.CSSProperties}
                >
                  <div className="card-body">
                    <div className="card-header-row">
                      <div className="card-icon-halo">
                        <IconComp size={22} />
                      </div>
                      <span className="card-step-badge">
                        {String(index + 1).padStart(2, "0")}
                      </span>
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
              <p className="body-copy">{t.parishLifeExtra}</p>
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
              <div className="eyebrow">{t.associationsEyebrow}</div>

              <h2 className="section-title">{t.associationsTitle}</h2>

              <p className="body-copy">{t.associationsDescription}</p>
            </div>
          </div>

          <div className="cards-grid lr-grid associations-grid auto-scroll-rail">
            {t.associations.map((association, index) => (
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
                  <p>{t.associationsDefaultDesc}</p>
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
              <div className="eyebrow">{t.structuresEyebrow}</div>

              <h2 className="section-title">{t.structuresTitle}</h2>

              <p className="body-copy">{t.structuresDescription}</p>
            </div>
          </div>

          <div className="cards-grid structures-grid mobile-snap-rail">
            {t.structures.map((item, index) => (
              <div
                className="card cinematic-card structure-card"
                key={item}
                data-reveal="fade-up"
                style={{ "--i": index } as React.CSSProperties}
              >
                <div className="card-body">
                  <div className="card-header-row">
                    <div className="card-icon-halo">
                      <Shield size={20} />
                    </div>
                    <span className="card-step-badge">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3>{item}</h3>
                  <p>{t.structuresDefaultDesc}</p>
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
              <div className="eyebrow">{t.historyEyebrow}</div>

              <h2 className="section-title">{t.historyTitle}</h2>

              <p className="body-copy text-subdued max-w-prose mx-auto">
                {t.historyDescription}
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
              <p className="body-copy">{t.historyP1}</p>
              <p className="body-copy">{t.historyP2}</p>
              <p className="body-copy">{t.historyP3}</p>
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
                  alt={churchName}
                />
                <div className="photo-caption-badge">
                  <Calendar size={14} />
                  <span>{t.historyBadge}</span>
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
              <div className="eyebrow">{t.timelineEyebrow}</div>
              <h2 className="section-title">{t.timelineTitle}</h2>
            </div>
          </div>

          <div className="history-timeline-container">
            <div className="timeline-spine" aria-hidden="true">
              <span className="timeline-spine-glow" />
            </div>

            <div className="history-milestones-list">
              {t.historyEntries.map((entry, index) => {
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
                    <div className="timeline-node" aria-hidden="true">
                      <span className="node-halo" />
                      <span className="node-core" />
                    </div>

                    <div className="milestone-card">
                      <div className="milestone-header">
                        <div className="milestone-meta-row">
                          <span className="card-step-badge">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="milestone-year">{entry.year}</span>
                        </div>
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
              <div className="eyebrow">{t.priestsEyebrow}</div>

              <h2 className="section-title">{t.priestsTitle}</h2>

              <p className="body-copy text-subdued max-w-prose mx-auto">
                {t.priestsDescription}
              </p>
            </div>
          </div>

          <div className="priest-timeline-grid mobile-snap-rail">
            {parishPriestData.map((priest, index) => (
              <div
                className="priest-item cinematic-card"
                key={`${priest.year}-${priest.en}`}
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
                  <p className="priest-name">
                    {language === "ta" ? priest.ta : priest.en}
                  </p>
                  <span className="priest-period">{priest.year}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mobile-scroll-hint" aria-hidden="true">
            <span>{t.swipePastorsHint}</span>
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
              <div className="eyebrow">{t.religiousEyebrow}</div>

              <h2 className="section-title">{t.religiousTitle}</h2>

              <p className="body-copy">{t.religiousDescription}</p>
            </div>
          </div>

          <div className="cards-grid communities-grid mobile-snap-rail">
            {t.religiousCommunities.map((community, index) => (
              <div
                className="card cinematic-card"
                key={community.name}
                data-reveal="fade-up"
                style={{ "--i": index } as React.CSSProperties}
              >
                <div className="card-body">
                  <div className="card-header-row">
                    <div className="card-icon-halo">
                      <Heart size={20} />
                    </div>
                    <span className="card-step-badge">
                      {String(index + 1).padStart(2, "0")}
                    </span>
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
            <div className="eyebrow">{t.secularInstituteEyebrow}</div>
            <h3>{t.secularInstituteTitle}</h3>
            <p className="body-copy">{t.secularInstituteNil}</p>
          </div>

          {/* Educational Institutions Under Parish Priest */}
          <div
            className="section-heading"
            data-reveal="fade-up"
            style={{ marginTop: 70, "--i": 0 } as React.CSSProperties}
          >
            <div>
              <div className="eyebrow">{t.educationalPriestEyebrow}</div>

              <h2 className="section-title">{t.educationalPriestTitle}</h2>

              <p className="body-copy">{t.educationalPriestDesc}</p>
            </div>
          </div>

          <div className="cards-grid institutions-grid mobile-snap-rail">
            {t.parishInstitutions.map((institution, index) => (
              <div
                className="card cinematic-card"
                key={institution.name}
                data-reveal="fade-up"
                style={{ "--i": index } as React.CSSProperties}
              >
                <div className="card-body">
                  <div className="card-header-row">
                    <div className="card-icon-halo">
                      <GraduationCap size={20} />
                    </div>
                    <span className="card-step-badge">
                      {String(index + 1).padStart(2, "0")}
                    </span>
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
              <div className="eyebrow">{t.educationalReligiousEyebrow}</div>

              <h2 className="section-title">{t.educationalReligiousTitle}</h2>
            </div>
          </div>

          <div className="cards-grid institutions-grid mobile-snap-rail">
            {t.religiousInstitutions.map((institution, index) => (
              <div
                className="card cinematic-card"
                key={institution.name}
                data-reveal="fade-up"
                style={{ "--i": index } as React.CSSProperties}
              >
                <div className="card-body">
                  <div className="card-header-row">
                    <div className="card-icon-halo">
                      <Building2 size={20} />
                    </div>
                    <span className="card-step-badge">
                      {String(index + 1).padStart(2, "0")}
                    </span>
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
              <div className="eyebrow">{t.grottosEyebrow}</div>

              <h2 className="section-title">{t.grottosTitle}</h2>
            </div>
          </div>

          <div className="cards-grid grottos-grid mobile-snap-rail">
            {t.kurusadis.map((item, index) => (
              <div
                className="card cinematic-card"
                key={item.name}
                data-reveal="fade-up"
                style={{ "--i": index } as React.CSSProperties}
              >
                <div className="card-body">
                  <div className="card-header-row">
                    <div className="card-icon-halo">
                      <Cross size={20} />
                    </div>
                    <span className="card-step-badge">
                      {String(index + 1).padStart(2, "0")}
                    </span>
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
              <div className="eyebrow">{t.legacySectionEyebrow}</div>

              <h2 className="section-title">{t.legacySectionTitle}</h2>

              <p className="body-copy text-subdued max-w-prose mx-auto">
                {t.legacySectionDescription}
              </p>
            </div>
          </div>

          <div className="cards-grid legacy-pillars-grid mobile-snap-rail">
            <div
              className="card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-header-row">
                  <div className="card-icon-halo">
                    <Cross size={22} />
                  </div>
                  <span className="card-step-badge">01</span>
                </div>
                <h3>{t.legacyFaithTitle}</h3>
                <p>{t.legacyFaithDesc}</p>
              </div>
            </div>

            <div
              className="card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-header-row">
                  <div className="card-icon-halo">
                    <BookOpen size={22} />
                  </div>
                  <span className="card-step-badge">02</span>
                </div>
                <h3>{t.legacyEducationTitle}</h3>
                <p>{t.legacyEducationDesc}</p>
              </div>
            </div>

            <div
              className="card cinematic-card"
              data-reveal="pop"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              <div className="card-body">
                <div className="card-header-row">
                  <div className="card-icon-halo">
                    <Users size={22} />
                  </div>
                  <span className="card-step-badge">03</span>
                </div>
                <h3>{t.legacyCommunityTitle}</h3>
                <p>{t.legacyCommunityDesc}</p>
              </div>
            </div>
          </div>

          <div
            className="closing-reflection-banner"
            data-reveal="fade-up"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            <div className="reflection-watermark" aria-hidden="true">
              <LatinCross />
            </div>
            <div className="reflection-content">
              <span className="reflection-eyebrow">
                {t.reflectionEyebrow}
              </span>
              <h3 className="reflection-heading serif">
                {t.reflectionHeading}
              </h3>
              <p className="reflection-lead">{t.reflectionLead}</p>
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
              <div className="eyebrow">{t.visitEyebrow}</div>

              <h2 className="section-title">{t.visitTitle}</h2>

              <p className="body-copy">{t.visitDescription}</p>
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
                <h3>{t.addressCardTitle}</h3>
                <p className="body-copy">{address}</p>
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
                <h3>{t.telephoneCardTitle}</h3>
                <p className="body-copy">{phone}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}