const silabea = require("silabea");
const cheerio = require("cheerio");

/**
 * Counts the number of syllables in a word.
 * @param {string} word - The word to analyze
 * @returns {number} The syllable count
 */
export const countSyllables = (word) => {
  // Words that the syllable library handles incorrectly are hardcoded here.
  const wordExceptions = [];
  if (wordExceptions.includes(word)) {
    return 2;
  }

  const silabas = silabea.getSilabas(word);
  return silabas.numeroSilaba;
};

/**
 * Fetches word info from WordReference and returns existence and gender.
 * Single request instead of two separate calls.
 * @param {string} word - The word to look up
 * @returns {Promise<{exists: false} | {exists: true, isFeminine: boolean}>}
 */
export const getWordInfo = async (word) => {
  const response = await fetch(
    `https://www.wordreference.com/definicion/${word}`,
  );
  const htmlText = await response.text();
  const $ = cheerio.load(htmlText);

  // Check if word exists in the dictionary
  const exists = $("p#noEntryFound").text().length <= 1;
  if (!exists) {
    return { exists: false };
  }

  // Determine gender
  let isFeminine = false;
  const wordLastLetter = word[word.length - 1];
  // Target the CSS class containing gender info ('nm', 'nf', 'nm, nf')
  const genderInfo = $("strong+ .POS2").first().text();

  // A gender tag longer than 2 chars (e.g. "nm, nf") means the word has two
  // possible genders, so we infer the feminine form from the word's ending.
  if (genderInfo.length > 2) {
    switch (wordLastLetter) {
      case "o": // ex: amigo
      case "e": // ex: presidente
      case "r": // ex: doctor
        break;
      default: // ex: amiga, presidenta, doctora
        isFeminine = true;
    }
    // A 2-char tag (e.g. "nf" or "nm") means a single gender.
  } else {
    if (genderInfo[1] === "f") {
      isFeminine = true;
    }
  }

  return { exists: true, isFeminine };
};

// Keep old functions for backwards compatibility, but they now use getWordInfo
export const doesWordExist = async (word) => {
  const { exists } = await getWordInfo(word);
  return exists;
};

export const isWordGenderFeminine = async (word) => {
  const { isFeminine } = await getWordInfo(word);
  return isFeminine;
};

const API_BASE =
  process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";

/**
 * Fetches comparison images for a word and its diminutive form.
 * @param {string} word - The original word
 * @param {string} diminutive - The diminutive form
 * @returns {Promise<{original: {word: string, images: string[]}, diminutive: {word: string, images: string[]}}>}
 */
export const fetchComparisonImages = async (word, diminutive) => {
  const fetchImages = (term) =>
    fetch(`${API_BASE}/images?word=${encodeURIComponent(term)}`).then((res) =>
      res.json(),
    );

  const toThumbnails = (results) =>
    results.images_results.map((img) => img.thumbnail);

  const [originalResults, diminutiveResults] = await Promise.all([
    fetchImages(word),
    fetchImages(diminutive),
  ]);

  return {
    original: {
      word,
      images: toThumbnails(originalResults),
    },
    diminutive: {
      word: diminutive,
      images: toThumbnails(diminutiveResults),
    },
  };
};

export function debounce(fn, delay) {
  let timeoutID;
  return function (...args) {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
