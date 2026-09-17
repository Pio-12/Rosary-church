"use client";

import { useEffect, useRef, useState } from "react";

type Language = "en" | "ta";

/**
 * Reveals any [data-reveal] element inside `rootRef` the first time it
 * scrolls into view, then leaves it alone. Works on every mobile browser
 * (Safari included) since it doesn't depend on CSS scroll-timelines.
 * Respects prefers-reduced-motion by revealing everything immediately.
 */
function useScrollReveal(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!items.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [rootRef]);
}

/** Inline style helper for staggering a group of revealed siblings. */
function stagger(index: number): React.CSSProperties {
  return { "--i": index } as React.CSSProperties;
}

const translations = {
  en: {
    heroEyebrow: "Our Parish",
    heroTitle: "About Holy Rosary Church",
    heroDescription:
      "A community of faith, prayer, service, and devotion, journeying together in the love of Christ.",

    historyEyebrow: "Our History",
    historyTitle: "A Journey of Faith",
    historyDescription:
      "Holy Rosary Church continues to grow as a spiritual home for families, children, youth, and the entire parish community.",

    priestsEyebrow: "Parish Priests",
    priestsTitle: "Our Parish Priests",

    grottosEyebrow: "Places of Devotion",
    grottosTitle: "Kurusadis & Grottos in the Parish",

    parishInformationEyebrow: "Parish Information",
    secularInstituteTitle: "Secular Institute",
    educationalEyebrow: "Educational Institutions",
    parishLifeEyebrow: "Parish Life",
    visitEyebrow: "Visit Us",
    visitTitle: "Holy Rosary Church",

    addressLabel: "Address",
    contactLabel: "Contact",
    phoneLabel: "Phone",
    emailLabel: "Email",
    nil: "Nil",

    languageEnglish: "English",
    languageTamil: "தமிழ்",

    grottoLocation: "Holy Rosary Church",

    parishLife: [
      {
        title: "Holy Mass",
        description:
          "Participate in the Holy Eucharist and grow in communion with Christ.",
      },
      {
        title: "Prayer Groups",
        description:
          "Join our parish prayer groups and deepen your personal relationship with God.",
      },
      {
        title: "Youth Ministry",
        description:
          "Encouraging young people to live their faith with joy, courage, and service.",
      },
      {
        title: "Children's Formation",
        description:
          "Helping children discover the love of Jesus through faith formation and activities.",
      },
    ],

    grottos: [
      {
        title: "Sahayamatha Grotto",
        location: "Holy Rosary Church",
      },
    ],

    history: [
      {
        year: "01",
        name: "Rev. Fr. A. Maria Soosai (1980–1984)",
      },
      {
        year: "02",
        name: "Rev. Fr. S. Arul (1984–1988)",
      },
      {
        year: "03",
        name: "Rev. Fr. A. Joseph (1988–1992)",
      },
      {
        year: "04",
        name: "Rev. Fr. David Kulandai S.J. (1992–1993)",
      },
      {
        year: "05",
        name: "Rev. Fr. Lawrence Xavier (1993–1997)",
      },
      {
        year: "06",
        name: "Rev. Fr. Jeganivasagar (1997–2004)",
      },
      {
        year: "07",
        name: "Rev. Fr. Benedict Barnabas (2004–2009)",
      },
      {
        year: "08",
        name: "Rev. Fr. Angel (2009–Present)",
      },
    ],
  },

  ta: {
    heroEyebrow: "எங்கள் பங்கு",
    heroTitle: "ஜெபமாலை அன்னை ஆலயத்தைப் பற்றி",
    heroDescription:
      "கிறிஸ்துவின் அன்பில் ஒன்றிணைந்து, நம்பிக்கை, ஜெபம், சேவை மற்றும் பக்தியில் வளர்ந்து வரும் இறைமக்களின் சமூகம்.",

    historyEyebrow: "எங்கள் வரலாறு",
    historyTitle: "நம்பிக்கையின் பயணம்",
    historyDescription:
      "ஜெபமாலை அன்னை ஆலயம் குடும்பங்கள், குழந்தைகள், இளைஞர்கள் மற்றும் முழு பங்கு மக்களுக்கும் ஆன்மீக இல்லமாக தொடர்ந்து வளர்ந்து வருகிறது.",

    priestsEyebrow: "பங்குத் தந்தையர்கள்",
    priestsTitle: "எங்கள் பங்குத் தந்தையர்கள்",

    grottosEyebrow: "வழிபாட்டுத் தலங்கள்",
    grottosTitle: "பங்கில் உள்ள குருசடிகள் மற்றும் கெபிகள்",

    parishInformationEyebrow: "பங்குத் தகவல்கள்",
    secularInstituteTitle: "துறவற நிறுவனம்",
    educationalEyebrow: "கல்வி நிறுவனங்கள்",
    parishLifeEyebrow: "பங்கு வாழ்க்கை",
    visitEyebrow: "எங்களைச் சந்திக்க",
    visitTitle: "ஜெபமாலை அன்னை ஆலயம்",

    addressLabel: "முகவரி",
    contactLabel: "தொடர்பு",
    phoneLabel: "தொலைபேசி",
    emailLabel: "மின்னஞ்சல்",
    nil: "இல்லை",

    languageEnglish: "English",
    languageTamil: "தமிழ்",

    grottoLocation: "ஜெபமாலை அன்னை ஆலயம்",

    parishLife: [
      {
        title: "திருப்பலி",
        description:
          "திருப்பலியில் பங்கேற்று, கிறிஸ்துவுடன் உள்ள உறவில் வளருங்கள்.",
      },
      {
        title: "ஜெபக் குழுக்கள்",
        description:
          "எங்கள் பங்கு ஜெபக் குழுக்களில் இணைந்து, இறைவனுடனான உங்கள் தனிப்பட்ட உறவை ஆழப்படுத்துங்கள்.",
      },
      {
        title: "இளைஞர் பணித்துறை",
        description:
          "இளைஞர்கள் மகிழ்ச்சியுடனும், துணிவுடனும், சேவை மனப்பான்மையுடனும் தங்கள் நம்பிக்கையை வாழ ஊக்குவித்தல்.",
      },
      {
        title: "குழந்தைகள் மறைக்கல்வி",
        description:
          "மறைக்கல்வி மற்றும் பல்வேறு செயல்பாடுகள் மூலம் குழந்தைகள் இயேசுவின் அன்பை அறிந்துகொள்ள உதவுதல்.",
      },
    ],

    grottos: [
      {
        title: "சகாயமாதா கெபி",
        location: "ஜெபமாலை அன்னை ஆலயம்",
      },
    ],

    history: [
      {
        year: "01",
        name: "அருட்தந்தை A. மரிய சூசை (1980–1984)",
      },
      {
        year: "02",
        name: "அருட்தந்தை S. அருள் (1984–1988)",
      },
      {
        year: "03",
        name: "அருட்தந்தை A. ஜோசப் (1988–1992)",
      },
      {
        year: "04",
        name: "அருட்தந்தை டேவிட் குலந்தை S.J. (1992–1993)",
      },
      {
        year: "05",
        name: "அருட்தந்தை லாரன்ஸ் சேவியர் (1993–1997)",
      },
      {
        year: "06",
        name: "அருட்தந்தை ஜெகனிவாசகர் (1997–2004)",
      },
      {
        year: "07",
        name: "அருட்தந்தை பெனடிக்ட் பர்னபாஸ் (2004–2009)",
      },
      {
        year: "08",
        name: "அருட்தந்தை ஏஞ்சல் (2009–தற்போது வரை)",
      },
    ],
  },
};

export default function AboutPageContent() {
  /*
   * This local language state can later be connected to your existing
   * global LanguageProvider.
   */
  const [language, setLanguage] = useState<Language>("en");
  const mainRef = useRef<HTMLElement>(null);

  useScrollReveal(mainRef);

  const content = translations[language];

  return (
    <main
      ref={mainRef}
      className={`about-page ${language === "ta" ? "is-tamil" : "is-english"}`}
    >
      {/* Language selector */}
      <div className="about-language-switcher" aria-label="Language selector">
        <span
          className="about-language-indicator"
          data-position={language === "en" ? "en" : "ta"}
          aria-hidden="true"
        />
        <button
          type="button"
          className={language === "en" ? "active" : ""}
          onClick={() => setLanguage("en")}
        >
          {content.languageEnglish}
        </button>

        <button
          type="button"
          className={language === "ta" ? "active" : ""}
          onClick={() => setLanguage("ta")}
        >
          {content.languageTamil}
        </button>
      </div>

      {/* Hero section */}
      <section className="about-hero">
        <span className="about-hero-glow" aria-hidden="true" />
        <span className="about-hero-particles" aria-hidden="true">
          <i></i><i></i><i></i><i></i><i></i><i></i>
        </span>

        <div className="about-container">
          <p className="about-eyebrow" data-reveal style={stagger(0)}>
            {content.heroEyebrow}
          </p>

          <h1 data-reveal style={stagger(1)}>
            {content.heroTitle}
          </h1>

          <p className="about-hero-description" data-reveal style={stagger(2)}>
            {content.heroDescription}
          </p>
        </div>
      </section>

      {/* History introduction */}
      <section className="about-section about-section-light">
        <div className="about-container about-intro-grid">
          <div data-reveal style={stagger(0)}>
            <p className="about-eyebrow">{content.historyEyebrow}</p>
            <h2>{content.historyTitle}</h2>
          </div>

          <p className="about-section-description" data-reveal style={stagger(1)}>
            {content.historyDescription}
          </p>
        </div>
      </section>

      {/* Parish priest history */}
      <section className="about-section about-section-blue">
        <div className="about-container">
          <p className="about-eyebrow" data-reveal>
            {content.priestsEyebrow}
          </p>
          <h2 data-reveal>{content.priestsTitle}</h2>

          <div className="about-history-list">
            {content.history.map((entry, index) => (
              <div
                className="about-history-item"
                key={entry.year}
                data-reveal
                style={stagger(index)}
              >
                <div className="about-history-number">{entry.year}</div>

                <div className="about-history-name">{entry.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grottos */}
      <section className="about-section about-section-light">
        <div className="about-container">
          <p className="about-eyebrow" data-reveal>
            {content.grottosEyebrow}
          </p>
          <h2 data-reveal>{content.grottosTitle}</h2>

          <div className="about-card-grid about-grotto-grid">
            {content.grottos.map((grotto, index) => (
              <article
                className="about-info-card"
                key={grotto.title}
                data-reveal
                style={stagger(index)}
              >
                <h3>{grotto.title}</h3>
                <p>{grotto.location}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Parish information */}
      <section className="about-section about-section-blue about-parish-information">
        <div className="about-container">
          <p className="about-eyebrow" data-reveal>
            {content.parishInformationEyebrow}
          </p>
          <h2 data-reveal>{content.secularInstituteTitle}</h2>

          <p className="about-empty-value" data-reveal>
            {content.nil}
          </p>
        </div>
      </section>

      {/* Educational institutions */}
      <section className="about-section about-section-light">
        <div className="about-container">
          <p className="about-eyebrow" data-reveal>
            {content.educationalEyebrow}
          </p>

          <div className="about-empty-card" data-reveal>
            <p>{content.nil}</p>
          </div>
        </div>
      </section>

      {/* Parish life */}
      <section className="about-section about-section-light">
        <div className="about-container">
          <p className="about-eyebrow" data-reveal>
            {content.parishLifeEyebrow}
          </p>

          <div className="about-card-grid about-parish-life-grid">
            {content.parishLife.map((item, index) => (
              <article
                className="about-info-card"
                key={item.title}
                data-reveal
                style={stagger(index)}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Visit us */}
      <section className="about-section about-section-visit">
        <div className="about-container about-visit-grid">
          <div data-reveal>
            <p className="about-eyebrow">{content.visitEyebrow}</p>
            <h2>{content.visitTitle}</h2>
          </div>

          <div className="about-contact-details">
            <div className="about-contact-item" data-reveal style={stagger(0)}>
              <span>{content.addressLabel}</span>
              <p>{content.nil}</p>
            </div>

            <div className="about-contact-item" data-reveal style={stagger(1)}>
              <span>{content.contactLabel}</span>
              <p>{content.nil}</p>
            </div>

            <div className="about-contact-item" data-reveal style={stagger(2)}>
              <span>{content.phoneLabel}</span>
              <p>{content.nil}</p>
            </div>

            <div className="about-contact-item" data-reveal style={stagger(3)}>
              <span>{content.emailLabel}</span>
              <p>{content.nil}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}