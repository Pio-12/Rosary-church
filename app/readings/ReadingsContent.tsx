"use client";

import { useLanguage } from "../components/LanguageProvider";
import { translations } from "@/lib/supabase/translations";
import { PageHero } from "../components/site";

type ReadingWithText = {
  title: string;
  tamilTitle: string;
  reference: string;
  tamilReference?: string;
  english: string | null;
  tamil: string | null;
};

type ReadingsData = {
  date?: string;
  monthDay?: string;
  season?: string;
  liturgical_day?: string;
  readings?: {
    firstReading?: string;
    psalm?: string;
    secondReading?: string;
    gospel?: string;
  };
} | null;

type ReadingsContentProps = {
  data: ReadingsData;
  readingsWithText: ReadingWithText[];
};

export default function ReadingsContent({
  data,
  readingsWithText,
}: ReadingsContentProps) {
  const { language } = useLanguage();
  const t = translations[language].readings;
  const isTamil = language === "ta";

  const today = new Intl.DateTimeFormat(isTamil ? "ta-IN" : "en-IN", {
    dateStyle: "full",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  const getSeasonName = (season?: string) => {
    if (!season || season === "Ordinary Time") {
      return isTamil ? "பொதுக்காலம்" : "Ordinary Time";
    }
    if (isTamil) {
      if (season === "Lent") return "தவக்காலம்";
      if (season === "Easter") return "பாஸ்கா காலம்";
      if (season === "Advent") return "திருவருகைக் காலம்";
      if (season === "Christmas") return "கிறிஸ்துமஸ் காலம்";
    }
    return season;
  };

  return (
    <main>
      <PageHero title={t.pageTitle} crumb={t.crumb} />

      <section className="section" style={{ paddingBottom: "90px" }}>
        <div className="container">
          {/* HEADER */}
          <div className="section-heading">
            <div>
              <div className="eyebrow">{t.eyebrow}</div>
              <h2 className="section-title">{t.title}</h2>
              <p className="body-copy">{today}</p>
            </div>
          </div>

          {/* SEASON */}
          {data && (
            <div
              className="card"
              style={{
                marginBottom: "30px",
              }}
            >
              <div className="card-body">
                <div className="eyebrow">{t.seasonEyebrow}</div>
                <h3>{getSeasonName(data.season)}</h3>
                {data.liturgical_day && (
                  <p className="body-copy" style={{ marginTop: "6px" }}>
                    {data.liturgical_day}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* NO DATA */}
          {!data ? (
            <div className="card">
              <div className="card-body">
                <h3>{t.temporarilyUnavailable}</h3>
                <p className="body-copy">{t.tryAgain}</p>
              </div>
            </div>
          ) : readingsWithText.length === 0 ? (
            <div className="card">
              <div className="card-body">
                <h3>{t.noReadings}</h3>
                <p className="body-copy">{t.noReadingsDesc}</p>
              </div>
            </div>
          ) : (
            /* READING CARDS */
            <div
              style={{
                display: "grid",
                gap: "30px",
              }}
            >
              {readingsWithText.map((reading) => {
                const displayTitle = isTamil
                  ? reading.tamilTitle
                  : reading.title;
                const displayRef = isTamil
                  ? reading.tamilReference || reading.reference
                  : reading.reference;

                return (
                  <article className="card" key={reading.title}>
                    <div className="card-body">
                      {/* TITLE */}
                      <div className="eyebrow">{displayTitle}</div>
                      <h3 style={{ margin: "6px 0 8px" }}>{displayTitle}</h3>

                      {/* SCRIPTURE REFERENCE */}
                      <p
                        className="body-copy"
                        style={{
                          fontWeight: 700,
                          color: "var(--blue-deep)",
                          fontSize: "1.05rem",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {displayRef}
                      </p>

                      {/* TEXT CONTAINER */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                          gap: "24px",
                          marginTop: "24px",
                          alignItems: "stretch",
                        }}
                      >
                        {/* ENGLISH SCRIPTURE CARD */}
                        <div
                          style={{
                            border: "1px solid var(--line)",
                            borderRadius: "14px",
                            padding: "24px",
                            background: "var(--paper, #fdfbf7)",
                            display: "flex",
                            flexDirection: "column",
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          <div
                            className="eyebrow"
                            style={{
                              marginBottom: "14px",
                              color: "var(--blue-deep)",
                              fontSize: "11px",
                              letterSpacing: "0.08em",
                            }}
                          >
                            🇬🇧 English (Douay-Rheims)
                          </div>

                          {reading.english ? (
                            <div
                              style={{
                                lineHeight: 1.85,
                                whiteSpace: "pre-line",
                                fontSize: "15px",
                                color: "var(--ink)",
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                              }}
                            >
                              {reading.english}
                            </div>
                          ) : (
                            <p className="body-copy">
                              {t.englishUnavailable}
                            </p>
                          )}
                        </div>

                        {/* TAMIL SCRIPTURE CARD (RC TAMIL BIBLE) */}
                        <div
                          style={{
                            border: "1px solid var(--line)",
                            borderRadius: "14px",
                            padding: "24px",
                            background: "var(--paper, #fdfbf7)",
                            display: "flex",
                            flexDirection: "column",
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          <div
                            className="eyebrow"
                            style={{
                              marginBottom: "14px",
                              color: "var(--blue-deep)",
                              fontSize: "11px",
                              letterSpacing: "0.08em",
                            }}
                          >
                            🇮🇳 தமிழ் (கத்தோலிக்க திருவிவிலியம்)
                          </div>

                          {reading.tamil ? (
                            <div
                              style={{
                                lineHeight: 1.95,
                                whiteSpace: "pre-line",
                                fontSize: "15px",
                                color: "var(--ink)",
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                              }}
                            >
                              {reading.tamil}
                            </div>
                          ) : (
                            <p className="body-copy">
                              {t.tamilUnavailable}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
