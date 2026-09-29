"use client";

import { PageHero } from "../components/site";
import { useLanguage } from "../components/LanguageProvider";
import { translations } from "@/lib/supabase/translations";

export default function History() {
  const { language } = useLanguage();
  const t = translations[language].history;

  return (
    <main>
      <PageHero
        title={t.pageTitle}
        crumb={t.crumb}
      />

      {/* INTRODUCTION */}
      <section className="section">
        <div className="container two-col">
          <div>
            <div className="eyebrow">{t.introEyebrow}</div>

            <h2 className="section-title">
              {t.introTitle}
            </h2>

            <p className="body-copy">
              {t.introP1}
            </p>

            <p className="body-copy">
              {t.introP2}
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
              <div className="eyebrow">{t.timelineEyebrow}</div>

              <h2 className="section-title">
                {t.timelineTitle}
              </h2>
            </div>
          </div>

          <div className="history-list">
            {t.entries.map((entry) => (
              <div className="history-item" key={entry.year}>
                <strong>{entry.year}</strong>

                <p>{entry.text}</p>
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
              <div className="eyebrow">{t.legacyEyebrow}</div>

              <h2 className="section-title">
                {t.legacyTitle}
              </h2>
            </div>
          </div>

          <div className="cards-grid">
            <div className="card">
              <div className="card-body">
                <h3>{t.faithTitle}</h3>

                <p>{t.faithDesc}</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3>{t.educationTitle}</h3>

                <p>{t.educationDesc}</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3>{t.communityTitle}</h3>

                <p>{t.communityDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}