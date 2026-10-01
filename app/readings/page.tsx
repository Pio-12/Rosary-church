import fs from "node:fs/promises";
import path from "node:path";
import ReadingsContent from "./ReadingsContent";

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
  chapter: number | string;
  verses: BibleVerse[];
};

type RcTamilBook = {
  bookNumber?: number;
  englishName: string;
  tamilName: string;
  tamilShortName?: string;
  osisId?: string;
  chapters: BibleChapter[];
};

type EnglishChapter = {
  verses: BibleVerse[];
};

type ReadingItem = {
  title: string;
  tamilTitle: string;
  reference: string;
  tamilReference: string;
};

/* =====================================================
   GET TODAY'S CATHOLIC READINGS
===================================================== */

async function getTodaysReadings(): Promise<ReadingsData | null> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const url = `https://cpbjr.github.io/catholic-readings-api/readings/${year}/${month}-${day}.json`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error(`Readings API returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Catholic readings API error:", error);
    return null;
  }
}

/* =====================================================
   BOOK NAME MAPPINGS (CATHOLIC CANON)
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
  "Song of Solomon": "canticle-of-canticles",

  Wisdom: "wisdom",
  Sirach: "ecclesiasticus",
  Ecclesiasticus: "ecclesiasticus",

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

const tamilBookNames: Record<string, string> = {
  Genesis: "தொடக்க நூல்",
  Exodus: "விடுதலைப் பயணம்",
  Leviticus: "லேவியர்",
  Numbers: "எண்ணிக்கை",
  Deuteronomy: "இணைச் சட்டம்",
  Joshua: "யோசுவா",
  Judges: "நீதித் தலைவர்கள்",
  Ruth: "ரூத்து",
  "1 Samuel": "1 சாமுவேல்",
  "2 Samuel": "2 சாமுவேல்",
  "1 Kings": "1 அரசர்கள்",
  "2 Kings": "2 அரசர்கள்",
  "1 Chronicles": "1 குறிப்பேடு",
  "2 Chronicles": "2 குறிப்பேடு",
  Ezra: "எஸ்ரா",
  Nehemiah: "நெகேமியா",
  Tobit: "தோபித்து",
  Judith: "யூதித்து",
  Esther: "எஸ்தர்",
  Job: "யோபு",
  Psalms: "திருப்பாடல்கள்",
  Psalm: "திருப்பாடல்கள்",
  Proverbs: "நீதிமொழிகள்",
  Ecclesiastes: "சபை உரையாளர்",
  "Song of Songs": "இனிமைமிகு பாடல்",
  "Song of Solomon": "இனிமைமிகு பாடல்",
  Wisdom: "சாலமோனின் ஞானம்",
  Sirach: "சீராக்கின் ஞானம்",
  Ecclesiasticus: "சீராக்கின் ஞானம்",
  Isaiah: "எசாயா",
  Jeremiah: "எரேமியா",
  Lamentations: "புலம்பல்",
  Baruch: "பாரூக்கு",
  Ezekiel: "எசேக்கியேல்",
  Daniel: "தானியேல்",
  Hosea: "ஒசேயா",
  Joel: "யோவேல்",
  Amos: "ஆமோஸ்",
  Obadiah: "ஒபதியா",
  Jonah: "யோனா",
  Micah: "மீக்கா",
  Nahum: "நாகூம்",
  Habakkuk: "அபக்கூக்கு",
  Zephaniah: "செப்பனியா",
  Haggai: "ஆகாய்",
  Zechariah: "செக்கரியா",
  Malachi: "மலாக்கி",
  "1 Maccabees": "1 மக்கபேயர்",
  "2 Maccabees": "2 மக்கபேயர்",
  Matthew: "மத்தேயு",
  Mark: "மாற்கு",
  Luke: "லூக்கா",
  John: "யோவான்",
  Acts: "திருத்தூதர் பணிகள்",
  Romans: "உரோமையர்",
  "1 Corinthians": "1 கொரிந்தியர்",
  "2 Corinthians": "2 கொரிந்தியர்",
  Galatians: "கலாத்தியர்",
  Ephesians: "எபேசியர்",
  Philippians: "பிலிப்பியர்",
  Colossians: "கொலோசையர்",
  "1 Thessalonians": "1 தெசலோனிக்கர்",
  "2 Thessalonians": "2 தெசலோனிக்கர்",
  "1 Timothy": "1 திமொத்தேயு",
  "2 Timothy": "2 திமொத்தேயு",
  Titus: "தீத்து",
  Philemon: "பிலமோன்",
  Hebrews: "எபிரேயர்",
  James: "யாக்கோபு",
  "1 Peter": "1 பேதுரு",
  "2 Peter": "2 பேதுரு",
  "1 John": "1 யோவான்",
  "2 John": "2 யோவான்",
  "3 John": "3 யோவான்",
  Jude: "யூதா",
  Revelation: "திருவெளிப்பாடு",
};

/* =====================================================
   CLEAN ENGLISH SCRIPTURE MARKUP
   Removes <sc>, <na>, <cr>, and any raw tags
===================================================== */

function cleanEnglishVerse(txt: string): string {
  if (!txt) return "";
  return txt
    // Replace <sc>text</sc> with text itself
    .replace(/<sc>(.*?)<\/sc>/gi, "$1")
    // Strip annotations/notes like <na>[1]</na>
    .replace(/<na>[\s\S]*?<\/na>/gi, "")
    // Strip cross-references like <cr>[1]</cr>
    .replace(/<cr>[\s\S]*?<\/cr>/gi, "")
    // Strip any remaining html/xml tags
    .replace(/<[^>]+>/g, "")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    .trim();
}

/* =====================================================
   REFERENCE PARSER
   Supports:
   - Semicolon chapters: Job 38:1, 12-21; 40:3-5
   - Cross-chapter ranges: Genesis 1:26-2:3
   - Letter suffixes: Psalm 139:13-14ab
===================================================== */

type RefSegment = {
  chapter: number;
  verses?: number[];
  start?: number;
  end?: number;
};

function getBookName(reference: string): string | null {
  const books = Object.keys(englishBookSlugs).sort(
    (a, b) => b.length - a.length
  );

  for (const book of books) {
    if (reference === book || reference.startsWith(`${book} `)) {
      return book;
    }
  }

  return null;
}

function parseReferenceSegments(
  bookName: string,
  reference: string
): RefSegment[] {
  let remainder = reference.trim();
  if (remainder.toLowerCase().startsWith(bookName.toLowerCase())) {
    remainder = remainder.slice(bookName.length).trim();
  }
  if (remainder.includes("[")) {
    remainder = remainder.split("[")[0].trim();
  }

  const parts = remainder
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  const segments: RefSegment[] = [];
  let currentChapter: number | null = null;

  for (const part of parts) {
    const crossMatch = part.match(/^(\d+):(\d+)\s*-\s*(\d+):(\d+)$/);
    if (crossMatch) {
      const ch1 = parseInt(crossMatch[1], 10);
      const v1 = parseInt(crossMatch[2], 10);
      const ch2 = parseInt(crossMatch[3], 10);
      const v2 = parseInt(crossMatch[4], 10);
      for (let ch = ch1; ch <= ch2; ch++) {
        segments.push({
          chapter: ch,
          start: ch === ch1 ? v1 : 1,
          end: ch === ch2 ? v2 : Infinity,
        });
      }
      currentChapter = ch2;
      continue;
    }

    const colonIdx = part.indexOf(":");
    let chapterNum: number;
    let versePart: string;
    if (colonIdx !== -1) {
      chapterNum = parseInt(part.slice(0, colonIdx).trim(), 10);
      versePart = part.slice(colonIdx + 1).trim();
      currentChapter = chapterNum;
    } else {
      chapterNum = currentChapter || 1;
      versePart = part;
    }

    const verses: number[] = [];
    const cleaned = versePart.replace(/[a-zA-Z]/g, "").trim();
    for (const chunk of cleaned.split(",")) {
      const trimmed = chunk.trim();
      if (!trimmed) continue;
      if (trimmed.includes("-")) {
        const [s, e] = trimmed.split("-").map((x) => parseInt(x, 10));
        if (Number.isFinite(s) && Number.isFinite(e)) {
          for (let v = s; v <= e; v++) verses.push(v);
        }
      } else {
        const v = parseInt(trimmed, 10);
        if (Number.isFinite(v)) verses.push(v);
      }
    }

    segments.push({
      chapter: chapterNum,
      verses: [...new Set(verses)],
    });
  }

  return segments;
}

function getTamilReference(reference: string): string {
  const book = getBookName(reference);
  if (!book) return reference;
  const tn = tamilBookNames[book] || book;
  return reference.replace(book, tn);
}

/* =====================================================
   GET ENGLISH SCRIPTURE
===================================================== */

async function getEnglishScripture(reference: string): Promise<string | null> {
  const book = getBookName(reference);
  if (!book) return null;

  const slug = englishBookSlugs[book];
  if (!slug) return null;

  const segments = parseReferenceSegments(book, reference);
  if (segments.length === 0) return null;

  const results: string[] = [];

  for (const seg of segments) {
    const url = `https://thedouayrheims.com/api/chapter/${slug}/${seg.chapter}`;
    try {
      const response = await fetch(url, {
        next: {
          revalidate: 86400,
        },
      });

      if (!response.ok) continue;

      const data: EnglishChapter = await response.json();
      if (!data?.verses || !Array.isArray(data.verses)) continue;

      let selectedVerses: BibleVerse[] = [];

      if (seg.verses && seg.verses.length > 0) {
        const needed = new Set(seg.verses);
        selectedVerses = data.verses.filter((v) =>
          needed.has(Number(v.verse))
        );
      } else if (seg.start !== undefined && seg.end !== undefined) {
        selectedVerses = data.verses.filter((v) => {
          const num = Number(v.verse);
          return num >= seg.start! && num <= seg.end!;
        });
      } else {
        selectedVerses = data.verses;
      }

      for (const v of selectedVerses) {
        const cleaned = cleanEnglishVerse(v.text);
        if (cleaned) {
          results.push(`${v.verse}. ${cleaned}`);
        }
      }
    } catch (err) {
      console.error(`English Bible fetch error for ${slug} ${seg.chapter}:`, err);
    }
  }

  return results.length > 0 ? results.join("\n\n") : null;
}

/* =====================================================
   GET RC TAMIL SCRIPTURE (OFFICIAL திருவிவிலியம்)
===================================================== */

async function getTamilScripture(reference: string): Promise<string | null> {
  const book = getBookName(reference);
  if (!book) return null;

  const segments = parseReferenceSegments(book, reference);
  if (segments.length === 0) return null;

  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "rc-tamil-bible",
      `${book}.json`
    );

    const raw = await fs.readFile(filePath, "utf-8");
    const bookData: RcTamilBook = JSON.parse(raw);

    if (!bookData?.chapters || !Array.isArray(bookData.chapters)) {
      return null;
    }

    const results: string[] = [];

    for (const seg of segments) {
      const chapterData = bookData.chapters.find(
        (c) => Number(c.chapter) === seg.chapter
      );
      if (!chapterData?.verses) continue;

      let selectedVerses: BibleVerse[] = [];

      if (seg.verses && seg.verses.length > 0) {
        const needed = new Set(seg.verses);
        selectedVerses = chapterData.verses.filter((v) =>
          needed.has(Number(v.verse))
        );
      } else if (seg.start !== undefined && seg.end !== undefined) {
        selectedVerses = chapterData.verses.filter((v) => {
          const num = Number(v.verse);
          return num >= seg.start! && num <= seg.end!;
        });
      } else {
        selectedVerses = chapterData.verses;
      }

      for (const v of selectedVerses) {
        if (v.text) {
          results.push(`${v.verse}. ${v.text}`);
        }
      }
    }

    return results.length > 0 ? results.join("\n\n") : null;
  } catch (error) {
    console.error(`RC Tamil Bible error for ${book}:`, error);
    return null;
  }
}

/* =====================================================
   PAGE
===================================================== */

export default async function Readings() {
  const data = await getTodaysReadings();
  const readings = data?.readings;

  const readingItems: ReadingItem[] = [];

  if (readings?.firstReading) {
    readingItems.push({
      title: "First Reading",
      tamilTitle: "முதல் வாசகம்",
      reference: readings.firstReading,
      tamilReference: getTamilReference(readings.firstReading),
    });
  }

  if (readings?.psalm) {
    readingItems.push({
      title: "Responsorial Psalm",
      tamilTitle: "பதிலுரைப் பாடல்",
      reference: readings.psalm,
      tamilReference: getTamilReference(readings.psalm),
    });
  }

  if (readings?.secondReading) {
    readingItems.push({
      title: "Second Reading",
      tamilTitle: "இரண்டாம் வாசகம்",
      reference: readings.secondReading,
      tamilReference: getTamilReference(readings.secondReading),
    });
  }

  if (readings?.gospel) {
    readingItems.push({
      title: "Gospel",
      tamilTitle: "நற்செய்தி வாசகம்",
      reference: readings.gospel,
      tamilReference: getTamilReference(readings.gospel),
    });
  }

  /*
    Fetch English and Tamil Scripture concurrently
  */
  const readingsWithText = await Promise.all(
    readingItems.map(async (reading) => {
      const [english, tamil] = await Promise.all([
        getEnglishScripture(reading.reference),
        getTamilScripture(reading.reference),
      ]);

      return {
        ...reading,
        english,
        tamil,
      };
    })
  );

  return <ReadingsContent data={data} readingsWithText={readingsWithText} />;
}
