"use client";

import { useLanguage } from "../components/LanguageProvider";
import { translations } from "@/lib/supabase/translations";
import { PageHero } from "../components/site";

type ReadingWithText = {
  title: string;
  tamilTitle: string;
  reference: string;
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
      <PageHero
        title={t.pageTitle}
        crumb={t.crumb}
      />

      <section className="section">
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
                  <p className="body-copy">{data.liturgical_day}</p>
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
              {readingsWithText.map((reading) => (
                <article className="card" key={reading.title}>
                  <div className="card-body">
                    {/* TITLE */}
                    <div className="eyebrow">
                      {isTamil ? reading.tamilTitle : reading.title}
                    </div>

                    <h3>{isTamil ? reading.tamilTitle : reading.title}</h3>

                    {/* REFERENCE */}
                    <p
                      className="body-copy"
                      style={{
                        fontWeight: 600,
                        marginTop: "10px",
                      }}
                    >
                      {reading.reference}
                    </p>

                    {/* TEXT */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "24px",
                        marginTop: "25px",
                      }}
                    >
                      {/* ENGLISH */}
                      <div
                        style={{
                          border: "1px solid rgba(0,0,0,0.08)",
                          borderRadius: "14px",
                          padding: "24px",
                          background: "#fafafa",
                        }}
                      >
                        <div
                          className="eyebrow"
                          style={{
                            marginBottom: "12px",
                          }}
                        >
                          🇬🇧 English
                        </div>

                        {reading.english ? (
                          <p
                            style={{
                              lineHeight: 1.9,
                              whiteSpace: "pre-line",
                            }}
                          >
                            {reading.english}
                          </p>
                        ) : (
                          <p className="body-copy">
                            {t.englishUnavailable}
                          </p>
                        )}
                      </div>

                      {/* TAMIL */}
                      <div
                        style={{
                          border: "1px solid rgba(0,0,0,0.08)",
                          borderRadius: "14px",
                          padding: "24px",
                          background: "#fafafa",
                        }}
                      >
                        <div
                          className="eyebrow"
                          style={{
                            marginBottom: "12px",
                          }}
                        >
                          🇮🇳 தமிழ்
                        </div>

                        {reading.tamil ? (
                          <p
                            style={{
                              lineHeight: 2,
                              whiteSpace: "pre-line",
                              fontSize: "1.05rem",
                            }}
                          >
                            {reading.tamil}
                          </p>
                        ) : (
                          <p className="body-copy">
                            {t.tamilUnavailable}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
