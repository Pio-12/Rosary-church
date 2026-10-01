import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "data", "rc-tamil-bible");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const bookKeyUrl =
  "https://raw.githubusercontent.com/jayarathina/Tamil-Bible-Database/master/MySQL/t_bookkey.sql";
const bibleViewUrl =
  "https://raw.githubusercontent.com/jayarathina/Tamil-Bible-Database/master/MySQL/t_mybibleview.sql";

// Clean unwanted characters/symbols from text
function cleanVerseText(txt) {
  if (!txt) return "";
  return txt
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    // Remove internal database markers like footnote indicator (␢), paragraph symbol (⒫), superscript/subscript parentheses, asterisks, etc.
    .replace(/[\u2422\u24B7\u24D0-\u24E9\u2474-\u249B\u2460-\u2473\u207D\u207E\u208D\u208E*]/g, "")
    // Remove any xml/html-like tags
    .replace(/<[^>]+>/g, "")
    // Clean up multiple spaces
    .replace(/\s+/g, " ")
    .trim();
}

async function run() {
  console.log("Fetching book keys...");
  const bookKeyRes = await fetch(bookKeyUrl);
  if (!bookKeyRes.ok) throw new Error("Failed to fetch t_bookkey.sql");
  const bookKeySql = await bookKeyRes.text();

  // Parse t_bookkey
  // INSERT INTO `t_bookkey` (`bn`, `osis_id`, `en`, `tn_f`, `tn_s`, `tn_a`, `tn_o`, `intro`) VALUES
  // (1, 'Gen', 'Genesis', 'தொடக்க நூல்', ...)
  const bookRegex =
    /\((\d+),\s*'([^']*)',\s*'([^']*)',\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)'/g;
  const booksByNum = {};
  let match;
  while ((match = bookRegex.exec(bookKeySql)) !== null) {
    const num = parseInt(match[1], 10);
    const osis = match[2];
    let enName = match[3];
    if (enName === "Song of Solomon") enName = "Song of Songs";
    const tnFull = match[4].replace(/\\'/g, "'");
    const tnShort = match[5].replace(/\\'/g, "'");

    booksByNum[num] = {
      bn: num,
      osis,
      en: enName,
      tnFull,
      tnShort,
    };
  }

  console.log(`Parsed ${Object.keys(booksByNum).length} books.`);

  console.log("Fetching Bible verses SQL...");
  const bibleViewRes = await fetch(bibleViewUrl);
  if (!bibleViewRes.ok) throw new Error("Failed to fetch t_mybibleview.sql");
  const bibleSql = await bibleViewRes.text();

  console.log("Parsing verses...");
  // Structure: bn (2 digits), ch (3 digits), vs (3 digits)
  // (01001001, '...', 'V')
  const verseRegex = /\((\d{8}),\s*'((?:[^'\\]|\\.)*)',\s*'([TV])'\)/g;

  // Group by book num -> chapter num -> array of { verse, text }
  const booksData = {};
  for (const num of Object.keys(booksByNum)) {
    booksData[num] = {};
  }

  let totalVerses = 0;
  while ((match = verseRegex.exec(bibleSql)) !== null) {
    const idStr = match[1];
    const rawTxt = match[2];
    const type = match[3];

    // We only care about verses ('V')
    if (type !== "V") continue;

    const bookNum = parseInt(idStr.slice(0, 2), 10);
    const chapterNum = parseInt(idStr.slice(2, 5), 10);
    const verseNum = parseInt(idStr.slice(5, 8), 10);

    if (!booksData[bookNum]) {
      booksData[bookNum] = {};
    }
    if (!booksData[bookNum][chapterNum]) {
      booksData[bookNum][chapterNum] = [];
    }

    const cleaned = cleanVerseText(rawTxt);
    booksData[bookNum][chapterNum].push({
      verse: verseNum,
      text: cleaned,
    });
    totalVerses++;
  }

  console.log(`Processed ${totalVerses} verses. Writing JSON files...`);

  const manifest = [];

  for (const [numStr, bookInfo] of Object.entries(booksByNum)) {
    const num = parseInt(numStr, 10);
    const chaptersObj = booksData[num] || {};
    const chaptersArray = Object.keys(chaptersObj)
      .map((ch) => parseInt(ch, 10))
      .sort((a, b) => a - b)
      .map((ch) => ({
        chapter: ch,
        verses: chaptersObj[ch].sort((a, b) => a.verse - b.verse),
      }));

    const bookData = {
      bookNumber: num,
      englishName: bookInfo.en,
      tamilName: bookInfo.tnFull,
      tamilShortName: bookInfo.tnShort,
      osisId: bookInfo.osis,
      chapters: chaptersArray,
    };

    const fileName = `${bookInfo.en}.json`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(bookData));

    manifest.push({
      bookNumber: num,
      englishName: bookInfo.en,
      tamilName: bookInfo.tnFull,
      fileName,
      totalChapters: chaptersArray.length,
    });

    // Also write aliases if helpful, e.g. "Psalms.json" and "Psalm.json"
    if (bookInfo.en === "Psalms") {
      fs.writeFileSync(
        path.join(outputDir, "Psalm.json"),
        JSON.stringify(bookData)
      );
    }
    if (bookInfo.en === "Song of Songs") {
      fs.writeFileSync(
        path.join(outputDir, "Song of Solomon.json"),
        JSON.stringify(bookData)
      );
    }
  }

  // Write manifest
  fs.writeFileSync(
    path.join(outputDir, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log("Successfully built RC Tamil Bible files in", outputDir);
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
