"use client";

import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/supabase/translations";
import { PageHero } from "./site";
import type { MassTiming } from "@/lib/supabase/mass-timings";

const dayNamesEn: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const dayNamesTa: Record<number, string> = {
  0: "ஞாயிற்றுக்கிழமை",
  1: "திங்கட்கிழமை",
  2: "செவ்வாய்க்கிழமை",
  3: "புதன்கிழமை",
  4: "வியாழக்கிழமை",
  5: "வெள்ளிக்கிழமை",
  6: "சனிக்கிழமை",
};

const tamilTitles: Record<string, string> = {
  "Tamil Mass": "தமிழ் திருப்பலி",
  "First Novena": "முதல் நவநாள்",
  "Second Novena": "இரண்டாம் நவநாள்",
};

function formatTime(time: string | null | undefined) {
  if (!time) {
    return "";
  }

  const [hoursString, minutesString] = time.split(":");
  const hours = Number(hoursString);
  const minutes = Number(minutesString);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return time;
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function formatNovenaTime(
  item: MassTiming,
  isTamil: boolean
) {
  if (!item.description) {
    return formatTime(item.time);
  }

  if (!isTamil) {
    return item.description;
  }

  /*
   * Expected English database descriptions:
   * 5:30 PM to 6:20 PM
   * 6:30 PM to 7:20 PM
   */
  return item.description
    .replace(" PM to ", " முதல் ")
    .replace(" AM to ", " முதல் ")
    .replace(" PM", "")
    .replace(" AM", "") + " வரை";
}

function getTitle(
  title: string,
  isTamil: boolean
) {
  if (isTamil) {
    return tamilTitles[title] ?? title;
  }

  return title;
}

function groupTimingsByDay(timings: MassTiming[]) {
  const grouped = new Map<number, MassTiming[]>();

  for (const item of timings) {
    const current = grouped.get(item.day_of_week) ?? [];
    current.push(item);
    grouped.set(item.day_of_week, current);
  }

  return Array.from(grouped.entries()).sort(
    ([dayA], [dayB]) => dayA - dayB
  );
}

type MassTimingsContentProps = {
  massTimings: MassTiming[];
};

export default function MassTimingsContent({
  massTimings,
}: MassTimingsContentProps) {
  const { language } = useLanguage();
  const t = translations[language].massTimings;
  const nav = translations[language].nav;
  const common = translations[language].common;

  const isTamil = language === "ta";
  const groupedTimings = groupTimingsByDay(massTimings);

  return (
    <main>
      <PageHero
        title={t.pageTitle}
        crumb={nav.massTimings}
      />

      <section className="section mass-timings-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">{t.eyebrow}</div>

              <h2 className="section-title">{t.title}</h2>
            </div>
          </div>

          {massTimings.length === 0 ? (
            <div className="schedule-card empty-schedule">
              <h3>{t.noTimings}</h3>

              <p>{t.noTimingsDesc}</p>
            </div>
          ) : (
            <div className="schedule">
              {groupedTimings.map(([dayOfWeek, timings]) => {
                const dayName = isTamil
                  ? dayNamesTa[dayOfWeek] ?? common.specialCelebration
                  : dayNamesEn[dayOfWeek] ?? common.specialCelebration;

                return (
                  <div
                    className="schedule-card"
                    key={dayOfWeek}
                  >
                    <div className="schedule-card-heading">
                      <h3>{dayName}</h3>

                      <span className="schedule-note">
                        {t.timingsNote}
                      </span>
                    </div>

                    <div className="schedule-items">
                      {timings.map((item) => {
                        const isNovena =
                          item.title === "First Novena" ||
                          item.title === "Second Novena";

                        const title = getTitle(
                          item.title,
                          isTamil
                        );

                        const displayTime = isNovena
                          ? formatNovenaTime(item, isTamil)
                          : formatTime(item.time);

                        return (
                          <div
                            className={`schedule-row ${
                              isNovena
                                ? "schedule-row-novena"
                                : ""
                            }`}
                            key={item.id}
                          >
                            <div className="schedule-row-title">
                              <span className="schedule-item-title">
                                {title}
                              </span>

                              {isNovena && (
                                <span className="schedule-item-label">
                                  {t.specialDevotion}
                                </span>
                              )}
                            </div>

                            <span className="schedule-item-time">
                              {displayTime}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}