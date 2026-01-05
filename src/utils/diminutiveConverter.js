/**
 * Pure functions for Spanish diminutive conversion.
 * No external dependencies - safe for testing.
 */

/**
 * Exception dictionary for idiomatic diminutives that don't follow patterns.
 * These are checked FIRST before any algorithmic conversion.
 */
const IDIOMATIC_DIMINUTIVES = {
  mano: "manita", // feminine despite -o ending
  fuente: "fuentecita", // feminine despite -e ending
  hombre: "hombrito", // drops -e, not -ecito
  sal: "salecita", // feminine, uses -ecita not -cita
  hamaca: "hamacita", // no c→qu transformation
  lombriz: "lombrizita", // keeps z instead of z→c
};

/**
 * Simple syllable counter based on vowel groups.
 * @param {string} word - The word to count syllables for
 * @returns {number} Estimated syllable count
 */
export const estimateSyllables = (word) => {
  const vowels = word.match(/[aeiouáéíóú]+/gi) || [];
  return Math.max(1, vowels.length);
};

/**
 * Determines if a word is grammatically feminine based on common Spanish patterns.
 * NOTE: This is only used for unit testing. In production, WordGenerator uses
 * isWordGenderFeminine() from WordUtils.js which scrapes dictionary for accurate gender.
 * @param {string} word - The word to check
 * @returns {boolean} True if likely feminine
 */
export const isLikelyFeminine = (word) => {
  // Specific exceptions - check first
  const feminineExceptions = ["flor", "luz", "mano", "llave", "fuente", "mamá"];
  if (feminineExceptions.includes(word)) return true;

  // Masculine exceptions (override ending-based rules)
  const masculineExceptions = ["papá"];
  if (masculineExceptions.includes(word)) return false;

  // Words ending in accented -á are NOT automatically feminine (e.g., papá is masculine)
  // Only unaccented -a is a feminine marker
  if (word.endsWith("a")) return true;

  // Common feminine endings
  if (word.endsWith("ción") || word.endsWith("sión")) return true;
  if (word.endsWith("dad") || word.endsWith("tad")) return true;
  if (word.endsWith("tud")) return true;
  if (word.endsWith("umbre")) return true;

  // Default to masculine for -o, -e, consonants, accented vowels
  return false;
};

/**
 * Converts a Spanish word to its diminutive form.
 * Pure function for easy testing.
 * @param {string} word - The word to convert
 * @param {boolean} isFeminine - Whether the word is grammatically feminine
 * @param {number} syllableCount - Number of syllables in the word
 * @returns {string} The diminutive form
 */
export const convertTodiminutive = (word, isFeminine, syllableCount) => {
  // 1. Check idiomatic exceptions FIRST (most restrictive)
  if (IDIOMATIC_DIMINUTIVES[word]) {
    return IDIOMATIC_DIMINUTIVES[word];
  }

  const lastLetter = word[word.length - 1];
  const vowelCondition = /[aeiouáéíóú]/;
  const endsInVowel = vowelCondition.test(word[word.length - 1]);
  const endsInTwoVowels =
    endsInVowel &&
    word[word.length - 2] &&
    vowelCondition.test(word[word.length - 2]);
  const consonantButNotRNZCondition = /[b-df-hj-mp-qstv-y]/;
  const endsInConsonantButNotRNZ = consonantButNotRNZCondition.test(
    word[word.length - 1]
  );
  const endsInNREIUOrAccentedVowelCondition = /[nreiuéíóú]/; // removed á - handled separately
  const endsInNREIUOrAccentedVowel = endsInNREIUOrAccentedVowelCondition.test(
    word[word.length - 1]
  );
  const irregularEndsInGaGo = /(ga|go|gua)$/.test(word);
  const irregularEndsInCoCa = /(co|ca)$/.test(word);
  const irregularEndsInZoZa = /(zo|za)$/.test(word);
  const irregularEndsInEoEa = /(eo|ea)$/.test(word);
  const irregularEndsInVoVa = /(vo|va)$/.test(word);
  const irregularEndsInEnyeOR = /(ñor|ñora)$/.test(word);

  // 2. Words ending in accented -á: replace the vowel (papá → papito, mamá → mamita)
  const endsInAccentedA = /á$/.test(word);

  // 3. Monosyllabic words ending in -r or -l take -cito/-cita directly (sal is idiomatic exception)
  const isMonosyllabicRL = syllableCount === 1 && /[rl]$/.test(word);

  // 4. Multisyllabic words ending in -os drop -os and add -ito (carlos → carlito)
  const endsInOs = syllableCount > 1 && /os$/.test(word);

  // 5. Monosyllabic words ending in -e take -ececito (pie → piececito)
  const isMonosyllabicE = syllableCount === 1 && /e$/.test(word);

  const wordOneLetterRemoved = word.slice(0, word.length - 1);
  const wordTwoLettersRemoved = word.slice(0, word.length - 2);

  const sanitize = (unsanitizedWord) => {
    return unsanitizedWord
      .replace(/[é]/g, "e")
      .replace(/[í]/g, "i")
      .replace(/[á]/g, "a")
      .replace(/[ó]/g, "o")
      .replace(/[ú]/g, "u");
  };

  let result;

  if (endsInAccentedA) { // ex: papá → papito
    result = isFeminine
      ? `${wordOneLetterRemoved}ita`
      : `${wordOneLetterRemoved}ito`;
  } else if (irregularEndsInEnyeOR) { // ex: señor → señorito
    result = isFeminine ? `${wordOneLetterRemoved}ita` : `${word}ito`;
  } else if (irregularEndsInEoEa) { // ex: feo → feito
    result = isFeminine
      ? `${wordOneLetterRemoved}ita`
      : `${wordOneLetterRemoved}ito`;
  } else if (irregularEndsInVoVa) { // ex: nuevo → nuevecito
    result = isFeminine
      ? `${wordOneLetterRemoved}ecita`
      : `${wordOneLetterRemoved}ecito`;
  } else if (irregularEndsInZoZa) { // ex: pedazo → pedacito
    result = isFeminine
      ? `${wordTwoLettersRemoved}cita`
      : `${wordTwoLettersRemoved}cito`;
  } else if (irregularEndsInCoCa) { // ex: poco → poquito
    result = isFeminine
      ? `${wordTwoLettersRemoved}quita`
      : `${wordTwoLettersRemoved}quito`;
  } else if (irregularEndsInGaGo) { // ex: amigo → amiguito, agua → agüita
    if (word[word.length - 2] === "u") {
      result = `${wordTwoLettersRemoved}üita`;
    } else {
      result = isFeminine
        ? `${wordOneLetterRemoved}uita`
        : `${wordOneLetterRemoved}uito`;
    }
  } else if (endsInOs) { // ex: carlos → carlito
    result = `${wordTwoLettersRemoved}ito`;
  } else if (isMonosyllabicE) { // ex: pie → piececito
    result = isFeminine ? `${word}cecita` : `${word}cecito`;
  } else if (word.length === 2) { // ex: té → tecito
    result = isFeminine ? word + "cita" : word + "cito";
  } else if (isMonosyllabicRL) { // ex: flor → florcita, sol → solcito
    result = isFeminine ? `${word}cita` : `${word}cito`;
  } else if (syllableCount === 1 || endsInTwoVowels) { // ex: pez → pececito, sandía → sandiecita
    if (endsInTwoVowels) {
      result = isFeminine
        ? `${wordOneLetterRemoved}ecita`
        : `${wordOneLetterRemoved}ecito`;
    } else {
      switch (lastLetter) {
        case "s":
          result = isFeminine
            ? `${wordOneLetterRemoved}cecitas`
            : `${wordOneLetterRemoved}cecitos`;
          break;
        case "n":
          result = `${word}ecito`;
          break;
        case "z":
        case "a":
          result = isFeminine
            ? `${wordOneLetterRemoved}cecita`
            : `${wordOneLetterRemoved}cecito`;
          break;
        default:
          result = isFeminine ? `${word}ecita` : `${word}ecito`;
      }
    }
  } else if (lastLetter === "o") { // ex: perro → perrito
    result = `${wordOneLetterRemoved}ito`;
  } else if (lastLetter === "a") { // ex: casa → casita
    result = `${wordOneLetterRemoved}ita`;
  } else if (endsInConsonantButNotRNZ) { // ex: reloj → relojito
    result = isFeminine ? `${word}ita` : `${word}ito`;
  } else if (endsInNREIUOrAccentedVowel) { // ex: camión → camioncito
    result = isFeminine ? `${word}cita` : `${word}cito`;
  } else if (lastLetter === "z") { // ex: lápiz → lapicito
    result = isFeminine
      ? `${wordOneLetterRemoved}cita`
      : `${wordOneLetterRemoved}cito`;
  } else {
    result = `${word}ito`;
  }

  return sanitize(result);
};
