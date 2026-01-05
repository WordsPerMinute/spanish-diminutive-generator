const silabea = require("silabea");
const cheerio = require("cheerio");

export const countSyllables = (word) => {
  const wordExceptions = [];
  if (wordExceptions.includes(word)) {
    return 2;
  }
  let silabas = silabea.getSilabas(`${word}`);
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
    `https://www.wordreference.com/definicion/${word}`
  );
  const htmlText = await response.text();
  const $ = cheerio.load(htmlText);

  // Check if word exists
  const exists = $("p#noEntryFound").text().length <= 1;
  if (!exists) {
    return { exists: false };
  }

  // Determine gender
  let isFeminine = false;
  const genderInfo = $("strong+ .POS2").first().text();

  // if the length is 2, that means it's only one gender, and greater means multiple
  if (genderInfo.length > 2) {
    switch (word[word.length - 1]) {
      case "o":
      case "e":
      case "r":
        break;
      default:
        isFeminine = true;
    }
  } else {
    if ($("strong+ .POS2").text()[1] === "f") {
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

const API_BASE = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000'
  : '';

/**
 * Fetches comparison images for a word and its diminutive form.
 * @param {string} word - The original word
 * @param {string} diminutive - The diminutive form
 * @returns {Promise<{original: {word: string, images: string[]}, diminutive: {word: string, images: string[]}}>}
 */
export const fetchComparisonImages = async (word, diminutive) => {
  const [originalResults, diminutiveResults] = await Promise.all([
    fetch(`${API_BASE}/images?word=${encodeURIComponent(word)}`).then(res => res.json()),
    fetch(`${API_BASE}/images?word=${encodeURIComponent(diminutive)}`).then(res => res.json())
  ]);

  return {
    original: {
      word,
      images: originalResults.images_results.map(img => img.thumbnail)
    },
    diminutive: {
      word: diminutive,
      images: diminutiveResults.images_results.map(img => img.thumbnail)
    }
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

