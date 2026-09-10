import { PageHero } from "../components/site";

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
};

type BibleVerse = {
  verse: number | string;
  text: string;
};

type BibleChapter = {
  verses: BibleVerse[];
};

type TamilBook = {
  chapters: BibleChapter[];
};

type EnglishChapter = {
  verses: BibleVerse[];
};

type ReadingItem = {
  title: string;
  tamilTitle: string;
  reference: string;
};

/* =====================================================
   GET TODAY'S CATHOLIC READINGS
===================================================== */

async function getTodaysReadings(): Promise<ReadingsData | null> {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  const url =
    `https://cpbjr.github.io/catholic-readings-api/readings/` +
    `${year}/${month}-${day}.json`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Readings API returned ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Catholic readings API error:",
      error
    );

    return null;
  }
}

/* =====================================================
   BOOK NAME MAPPING
===================================================== */

const englishBookSlugs: Record<string, string> = {
  Genesis: "genesis",
  Exodus: "exodus",
  Leviticus: "leviticus",
  Numbers: "numbers",
  Deuteronomy: "deuteronomy",
  Joshua: "josue",
  Judges: "judges",
  Ruth: "ruth",

  "1 Samuel": "1-kings",
  "2 Samuel": "2-kings",

  "1 Kings": "3-kings",
  "2 Kings": "4-kings",

  "1 Chronicles": "1-paralipomenon",
  "2 Chronicles": "2-paralipomenon",

  Ezra: "1-esdras",
  Nehemiah: "2-esdras",

  Tobit: "tobias",
  Judith: "judith",
  Esther: "esther",
  Job: "job",

  Psalms: "psalms",
  Psalm: "psalms",

  Proverbs: "proverbs",
  Ecclesiastes: "ecclesiastes",
  "Song of Songs": "canticle-of-canticles",

  Wisdom: "wisdom",
  Sirach: "ecclesiasticus",

  Isaiah: "isaie",
  Jeremiah: "jeremie",
  Lamentations: "lamentations",
  Baruch: "baruch",
  Ezekiel: "ezechiel",
  Daniel: "daniel",

  Hosea: "osee",
  Joel: "joel",
  Amos: "amos",
  Obadiah: "abdias",
  Jonah: "jonas",
  Micah: "micheas",
  Nahum: "nahum",
  Habakkuk: "habacuc",
  Zephaniah: "sophonias",
  Haggai: "aggeus",
  Zechariah: "zacharias",
  Malachi: "malachie",

  "1 Maccabees": "1-machabees",
  "2 Maccabees": "2-machabees",

  Matthew: "matthew",
  Mark: "mark",
  Luke: "luke",
  John: "john",
  Acts: "acts",

  Romans: "romans",

  "1 Corinthians": "1-corinthians",
  "2 Corinthians": "2-corinthians",

  Galatians: "galatians",
  Ephesians: "ephesians",
  Philippians: "philippians",
  Colossians: "colossians",

  "1 Thessalonians": "1-thessalonians",
  "2 Thessalonians": "2-thessalonians",

  "1 Timothy": "1-timothy",
  "2 Timothy": "2-timothy",

  Titus: "titus",
  Philemon: "philemon",
  Hebrews: "hebrews",
  James: "james",

  "1 Peter": "1-peter",
  "2 Peter": "2-peter",

  "1 John": "1-john",
  "2 John": "2-john",
  "3 John": "3-john",

  Jude: "jude",
  Revelation: "apocalypse",
};

/* =====================================================
   TAMIL JSON BOOK NAMES
===================================================== */

const tamilBookFiles: Record<string, string> = {
  Genesis: "Genesis.json",
  Exodus: "Exodus.json",
  Leviticus: "Leviticus.json",
  Numbers: "Numbers.json",
  Deuteronomy: "Deuteronomy.json",
  Joshua: "Joshua.json",
  Judges: "Judges.json",
  Ruth: "Ruth.json",

  "1 Samuel": "1 Samuel.json",
  "2 Samuel": "2 Samuel.json",

  "1 Kings": "1 Kings.json",
  "2 Kings": "2 Kings.json",

  "1 Chronicles": "1 Chronicles.json",
  "2 Chronicles": "2 Chronicles.json",

  Ezra: "Ezra.json",
  Nehemiah: "Nehemiah.json",

  Job: "Job.json",

  Psalms: "Psalms.json",
  Psalm: "Psalms.json",

  Proverbs: "Proverbs.json",
  Ecclesiastes: "Ecclesiastes.json",
  "Song of Songs": "Song of Songs.json",

  Isaiah: "Isaiah.json",
  Jeremiah: "Jeremiah.json",
  Lamentations: "Lamentations.json",
  Ezekiel: "Ezekiel.json",
  Daniel: "Daniel.json",

  Hosea: "Hosea.json",
  Joel: "Joel.json",
  Amos: "Amos.json",
  Obadiah: "Obadiah.json",
  Jonah: "Jonah.json",
  Micah: "Micah.json",
  Nahum: "Nahum.json",
  Habakkuk: "Habakkuk.json",
  Zephaniah: "Zephaniah.json",
  Zechariah: "Zechariah.json",
  Malachi: "Malachi.json",

  Matthew: "Matthew.json",
  Mark: "Mark.json",
  Luke: "Luke.json",
  John: "John.json",
  Acts: "Acts.json",

  Romans: "Romans.json",

  "1 Corinthians": "1 Corinthians.json",
  "2 Corinthians": "2 Corinthians.json",

  Galatians: "Galatians.json",
  Ephesians: "Ephesians.json",
  Philippians: "Philippians.json",
  Colossians: "Colossians.json",

  "1 Thessalonians": "1 Thessalonians.json",
  "2 Thessalonians": "2 Thessalonians.json",

  "1 Timothy": "1 Timothy.json",
  "2 Timothy": "2 Timothy.json",

  Titus: "Titus.json",
  Philemon: "Philemon.json",
  James: "James.json",

  "1 Peter": "1 Peter.json",
  "2 Peter": "2 Peter.json",

  "1 John": "1 John.json",
  "2 John": "2 John.json",
  "3 John": "3 John.json",

  Jude: "Jude.json",
  Revelation: "Revelation.json",
};

/* =====================================================
   PARSE BOOK NAME
===================================================== */

function getBookName(reference: string): string | null {
  const books = Object.keys(englishBookSlugs);

  const sortedBooks = books.sort(
    (a, b) => b.length - a.length
  );

  for (const book of sortedBooks) {
    if (
      reference === book ||
      reference.startsWith(`${book} `)
    ) {
      return book;
    }
  }

  return null;
}

/* =====================================================
   PARSE CHAPTER
===================================================== */

function getChapter(reference: string): number | null {
  const match = reference.match(
    /(\d+):/
  );

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

/* =====================================================
   PARSE VERSE RANGE
===================================================== */

function getVersePart(
  reference: string
): string | null {
  const colonIndex =
    reference.indexOf(":");

  if (colonIndex === -1) {
    return null;
  }

  return reference
    .substring(colonIndex + 1)
    .trim();
}

/* =====================================================
   CONVERT VERSE PART TO NUMBERS
===================================================== */

function getVerseNumbers(
  versePart: string,
  maxVerse: number
): number[] {
  const result: number[] = [];

  const cleaned = versePart
    .replace(/[a-zA-Z]/g, "")
    .replace(/\s/g, "");

  const parts = cleaned.split(",");

  for (const part of parts) {
    if (part.includes("-")) {
      const [startString, endString] =
        part.split("-");

      const start = Number(startString);
      const end = Number(endString);

      if (
        Number.isFinite(start) &&
        Number.isFinite(end)
      ) {
        for (
          let i = start;
          i <= Math.min(end, maxVerse);
          i++
        ) {
          result.push(i);
        }
      }
    } else {
      const verse = Number(part);

      if (
        Number.isFinite(verse) &&
        verse > 0 &&
        verse <= maxVerse
      ) {
        result.push(verse);
      }
    }
  }

  return [...new Set(result)];
}

/* =====================================================
   GET ENGLISH SCRIPTURE
===================================================== */

async function getEnglishScripture(
  reference: string
): Promise<string | null> {
  const book = getBookName(reference);
  const chapter = getChapter(reference);

  if (!book || !chapter) {
    return null;
  }

  const slug =
    englishBookSlugs[book];

  if (!slug) {
    return null;
  }

  const url =
    `https://thedouayrheims.com/api/chapter/` +
    `${slug}/${chapter}`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 86400,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Douay-Rheims returned ${response.status}`
      );
    }

    const data: EnglishChapter =
      await response.json();

    if (
      !data?.verses ||
      !Array.isArray(data.verses)
    ) {
      return null;
    }

    const versePart =
      getVersePart(reference);

    if (!versePart) {
      return data.verses
        .map(
          (verse) =>
            `${verse.verse}. ${verse.text}`
        )
        .join(" ");
    }

    const verseNumbers =
      getVerseNumbers(
        versePart,
        data.verses.length
      );

    const selected =
      data.verses.filter(
        (verse) =>
          verseNumbers.includes(
            Number(verse.verse)
          )
      );

    if (selected.length === 0) {
      return null;
    }

    return selected
      .map(
        (verse) =>
          `${verse.verse}. ${verse.text}`
      )
      .join(" ");
  } catch (error) {
    console.error(
      "English Bible error:",
      error
    );

    return null;
  }
}

/* =====================================================
   GET TAMIL SCRIPTURE
===================================================== */

async function getTamilScripture(
  reference: string
): Promise<string | null> {
  const book = getBookName(reference);
  const chapter = getChapter(reference);

  if (!book || !chapter) {
    return null;
  }

  const file =
    tamilBookFiles[book];

  if (!file) {
    return null;
  }

  const url =
    `https://raw.githubusercontent.com/aruljohn/Bible-tamil/master/` +
    encodeURIComponent(file);

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 86400,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Tamil Bible returned ${response.status}`
      );
    }

    const data: TamilBook =
      await response.json();

    const chapterData =
      data.chapters?.find(
        (item) =>
          Number(item.chapter) === chapter
      );

    if (
      !chapterData ||
      !Array.isArray(
        chapterData.verses
      )
    ) {
      return null;
    }

    const versePart =
      getVersePart(reference);

    if (!versePart) {
      return chapterData.verses
        .map(
          (verse) =>
            `${verse.verse}. ${verse.text}`
        )
        .join(" ");
    }

    const verseNumbers =
      getVerseNumbers(
        versePart,
        chapterData.verses.length
      );

    const selected =
      chapterData.verses.filter(
        (verse) =>
          verseNumbers.includes(
            Number(verse.verse)
          )
      );

    if (selected.length === 0) {
      return null;
    }

    return selected
      .map(
        (verse) =>
          `${verse.verse}. ${verse.text}`
      )
      .join(" ");
  } catch (error) {
    console.error(
      "Tamil Bible error:",
      error
    );

    return null;
  }
}

/* =====================================================
   PAGE
===================================================== */

export default async function Readings() {
  const data =
    await getTodaysReadings();

  const today =
    new Intl.DateTimeFormat(
      "en-IN",
      {
        dateStyle: "full",
        timeZone: "Asia/Kolkata",
      }
    ).format(new Date());

  const readings =
    data?.readings;

  const readingItems: ReadingItem[] =
    [];

  if (readings?.firstReading) {
    readingItems.push({
      title: "First Reading",
      tamilTitle: "முதல் வாசகம்",
      reference:
        readings.firstReading,
    });
  }

  if (readings?.psalm) {
    readingItems.push({
      title:
        "Responsorial Psalm",
      tamilTitle:
        "பதிலுரைப் பாடல்",
      reference:
        readings.psalm,
    });
  }

  if (readings?.secondReading) {
    readingItems.push({
      title: "Second Reading",
      tamilTitle:
        "இரண்டாம் வாசகம்",
      reference:
        readings.secondReading,
    });
  }

  if (readings?.gospel) {
    readingItems.push({
      title: "Gospel",
      tamilTitle:
        "நற்செய்தி வாசகம்",
      reference:
        readings.gospel,
    });
  }

  /*
    Fetch English and Tamil Scripture
    at the same time.
  */

  const readingsWithText =
    await Promise.all(
      readingItems.map(
        async (reading) => {
          const [
            english,
            tamil,
          ] = await Promise.all([
            getEnglishScripture(
              reading.reference
            ),
            getTamilScripture(
              reading.reference
            ),
          ]);

          return {
            ...reading,
            english,
            tamil,
          };
        }
      )
    );

  return (
    <main>

      <PageHero
        title="Today's Readings"
        crumb="Readings"
      />

      <section className="section">

        <div className="container">

          {/* HEADER */}

          <div className="section-heading">

            <div>

              <div className="eyebrow">
                Daily Catholic Readings
              </div>

              <h2 className="section-title">
                Today's Word of God
              </h2>

              <p className="body-copy">
                {today}
              </p>

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

                <div className="eyebrow">
                  Liturgical Season
                </div>

                <h3>
                  {data.season ||
                    "Ordinary Time"}
                </h3>

                {data.liturgical_day && (
                  <p className="body-copy">
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

                <h3>
                  Today's readings are
                  temporarily unavailable.
                </h3>

                <p className="body-copy">
                  Please try again shortly.
                </p>

              </div>

            </div>

          ) : readingsWithText.length === 0 ? (

            <div className="card">

              <div className="card-body">

                <h3>
                  No readings available
                </h3>

                <p className="body-copy">
                  We could not find today's
                  Catholic readings.
                </p>

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

              {readingsWithText.map(
                (reading) => (

                  <article
                    className="card"
                    key={reading.title}
                  >

                    <div className="card-body">

                      {/* TITLE */}

                      <div className="eyebrow">
                        {reading.title}
                      </div>

                      <h3>
                        {reading.tamilTitle}
                      </h3>

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
                            border:
                              "1px solid rgba(0,0,0,0.08)",
                            borderRadius:
                              "14px",
                            padding: "24px",
                            background:
                              "#fafafa",
                          }}
                        >

                          <div
                            className="eyebrow"
                            style={{
                              marginBottom:
                                "12px",
                            }}
                          >
                            🇬🇧 English
                          </div>

                          {reading.english ? (

                            <p
                              style={{
                                lineHeight: 1.9,
                                whiteSpace:
                                  "pre-line",
                              }}
                            >
                              {
                                reading.english
                              }
                            </p>

                          ) : (

                            <p className="body-copy">
                              English Scripture
                              text is
                              temporarily
                              unavailable.
                            </p>

                          )}

                        </div>

                        {/* TAMIL */}

                        <div
                          style={{
                            border:
                              "1px solid rgba(0,0,0,0.08)",
                            borderRadius:
                              "14px",
                            padding: "24px",
                            background:
                              "#fafafa",
                          }}
                        >

                          <div
                            className="eyebrow"
                            style={{
                              marginBottom:
                                "12px",
                            }}
                          >
                            🇮🇳 தமிழ்
                          </div>

                          {reading.tamil ? (

                            <p
                              style={{
                                lineHeight: 2,
                                whiteSpace:
                                  "pre-line",
                                fontSize:
                                  "1.05rem",
                              }}
                            >
                              {
                                reading.tamil
                              }
                            </p>

                          ) : (

                            <p className="body-copy">
                              தமிழ் வாசகம்
                              தற்போது
                              கிடைக்கவில்லை.
                            </p>

                          )}

                        </div>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </div>

      </section>

      {/* REFLECTION */}

      <section className="wine-band">

        <div className="container">

          <div className="eyebrow">
            Reflect & Pray
          </div>

          <h2 className="section-title">
            Carry God's Word into your day
          </h2>

          <p className="body-copy">
            Take a few quiet moments to read
            today's Scripture, reflect on God's
            message and carry it with you
            throughout the day.
          </p>

        </div>

      </section>

    </main>
  );
}