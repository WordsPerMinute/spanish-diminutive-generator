import React, { useState, useCallback, useRef } from 'react';
import { doesWordExist, isWordGenderFeminine, countSyllables, comparisonImageSearch, debounce } from '../utils/WordUtils'
import PhotoCards from './PhotoCards'
import { GiPhotoCamera } from 'react-icons/gi';
// import debounce from 'lodash';
import './WordGenerator.scss';

const WordGenerator = (props) => {
  const [userInput, setUserInput] = useState('');
  const [validatedInput, setValidatedInput] = useState('');
  const [wordWhenClicked, setWordWhenClicked] = useState('');
  const [validWord, setValidWord] = useState(false);
  const [convertedWord, setConvertedWord] = useState('');
  const [wordCardInfo, setWordCardInfo] = useState({});
  const [loadingCardInfo, setLoadingCardInfo] = useState(false);

  const convertWord = async (word) => {

    // ideas here :)
    // fixed height for p element, or other stuff
    // add English translations

    if (await doesWordExist(word)) {
      setValidWord(true);
      setValidatedInput(word);
    } else {
      setValidWord(false);
      return
    }

    // break the conditions out ahead of time to improve readability
    const syllableTotal = countSyllables(word);
    const lastLetter = word[word.length - 1];
    const vowelCondition = /[aeiouáéíóú]/;
    const endsInVowel = !(word[word.length - 1].search(vowelCondition) === -1) ? true : false;
    const endsInTwoVowels = (endsInVowel && word[word.length - 2] && !(word[word.length - 2].search(vowelCondition) === -1)) ? true : false;
    const consonantButNotRNZCondition = /[b-df-hj-mp-qstv-y]/;
    const endsInConsonantButNotRNZ = !(word[word.length - 1].search(consonantButNotRNZCondition) === -1) ? true : false;
    const endsInNREIUOrAccentedVowelCondition = /[nreiuáéíóú]/;
    const endsInNREIUOrAccentedVowel = !(word[word.length - 1].search(endsInNREIUOrAccentedVowelCondition) === -1) ? true : false;
    const irregularEndsInGaGoCondition = /(ga|go|gua)$/;
    const irregularEndsInGaGo = !(word.search(irregularEndsInGaGoCondition) === -1) ? true : false;
    const irregularEndsInCoCaCondition = /(co|ca)$/;
    const irregularEndsInCoCa = !(word.search(irregularEndsInCoCaCondition) === -1) ? true : false;
    const irregularEndsInZoZaCondition = /(zo|za)$/;
    const irregularEndsInZoZa = !(word.search(irregularEndsInZoZaCondition) === -1) ? true : false;
    const irregularEndsInEoEaCondition = /(eo|ea)$/;
    // this condition exists because although there's a "two vowel" check, eo/ea is an exception to that rule
    // it might also be possible to instead modify endsInTwoVowels
    const irregularEndsInEoEa = !(word.search(irregularEndsInEoEaCondition) === -1) ? true : false;
    const irregularEndsInVoVaCondition = /(vo|va)$/;
    const irregularEndsInVoVa = !(word.search(irregularEndsInVoVaCondition) === -1) ? true : false;
    const isFeminineWord = await isWordGenderFeminine(word);

    const wordOneLetterRemoved = word.slice(0, [word.length - 1]);
    const wordTwoLettersRemoved = word.slice(0, [word.length - 2]);

    const sanitizeThenSetConvertedWord = (unsanitizedWord) => {

      // We are removing all accented characters or "diacritics", because diminutives never contain them
      let sanitizedWord = unsanitizedWord
        .replace(/[é]/g,"e")
        .replace(/[í]/g,"i")
        .replace(/[á]/g,"a")
        .replace(/[ó]/g,"o")
        .replace(/[ú]/g,"u")

      setConvertedWord(sanitizedWord);
    }
    //irregularEndsInEoEaCondition
    //
    // start with the most restrictive cases, such as irregulars, and work towards more common
    if (irregularEndsInEoEa) {
      isFeminineWord ?
        sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}ita`) :
        sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}ito`)
    } else if (irregularEndsInVoVa) {
      isFeminineWord ?
        sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}ecita`) :
        sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}ecito`)
    } else if (irregularEndsInZoZa) {
      isFeminineWord ?
        sanitizeThenSetConvertedWord(`${wordTwoLettersRemoved}cita`) :
        sanitizeThenSetConvertedWord(`${wordTwoLettersRemoved}cito`)
    } else if (irregularEndsInCoCa) {
      isFeminineWord ?
        sanitizeThenSetConvertedWord(`${wordTwoLettersRemoved}quita`) :
        sanitizeThenSetConvertedWord(`${wordTwoLettersRemoved}quito`)
    } else if (irregularEndsInGaGo) {
      //check if second to last letter is 'u', as with 'agua'
      if (word[word.length - 2] === 'u') {
        sanitizeThenSetConvertedWord(`${wordTwoLettersRemoved}üita`)
      } else {
        isFeminineWord ?
          sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}uita`) :
          sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}uito`)
      }
    } else if (word.length === 2) {
      isFeminineWord ?
        sanitizeThenSetConvertedWord(word + 'cita') :
        sanitizeThenSetConvertedWord(word + 'cito')
    } else if (syllableTotal === 1 || endsInTwoVowels) {
        if (endsInTwoVowels) {
          switch (lastLetter) {
            default:
              isFeminineWord ?
                sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}ecita`) :
                sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}ecito`)
          }
        } else {
          switch (lastLetter) {
            case 's':
              isFeminineWord ?
                sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}cecitas`) :
                sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}cecitos`)
              break;
            case 'n':
              sanitizeThenSetConvertedWord(`${word}ecito`);
              break;
            case 'z':
              isFeminineWord ?
                sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}cecita`) :
                sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}cecito`)
              break;
            case 'a':
              isFeminineWord ?
                sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}cecita`) :
                sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}cecito`)
              break;
            default:
              isFeminineWord ?
                sanitizeThenSetConvertedWord(`${word.slice(0, [word.length])}ecita`) :
                sanitizeThenSetConvertedWord(`${word.slice(0, [word.length])}ecito`)
          }
        }
    } else if (lastLetter === 'o') {
        sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}ito`)
    } else if (lastLetter === 'a') {
        sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}ita`)
    } else if (endsInConsonantButNotRNZ) {
        isFeminineWord ?
          sanitizeThenSetConvertedWord(`${word}ita`) :
          sanitizeThenSetConvertedWord(`${word}ito`)
    } else if (endsInNREIUOrAccentedVowel) {
        isFeminineWord ?
          sanitizeThenSetConvertedWord(`${word}cita`) :
          sanitizeThenSetConvertedWord(`${word}cito`)
    } else if (lastLetter === 'z') {
        isFeminineWord ?
          sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}cita`) :
          sanitizeThenSetConvertedWord(`${wordOneLetterRemoved}cito`)
    } else {
      sanitizeThenSetConvertedWord(`${word}ito`)
    }
  }

  const debouncedOnChange = useCallback(
    debounce((value) => onChange(value), 500),
    []
  );

  const onChange = (value) => {
    if (value.length > 1) {
      setUserInput(value)
      const currentSearch = value;
      convertWord(currentSearch)
    } else {
      setValidWord(false);
      setConvertedWord('');
      setUserInput(value)
    }
  };

  const DisplayInstructionsOrResults = () => {
    if (validWord === false && userInput.length > 0) {
      return (
        <>
          <p className="invalid">Enter a valid word!</p>
        </>
      )
    } 
    if (convertedWord.length === 0) {
      return (
        <>
          <p>Enter a word to get its diminutive!</p>
          <p>Click the camera for a comparison...</p>
        </>
      )
    } 
    if (validWord === true & convertedWord.length > 1) {
      return (
        <p>{convertedWord}</p>
      )
    }
  };
  
  return (
      <>
        <div className="search-wrapper">
          <input
            type="text"
            className="search-box"
            onChange={event => debouncedOnChange(event.target.value)}
          />
          <GiPhotoCamera 
            className="contract-icon"
            onClick={async () => {
              setLoadingCardInfo(true);
              const result = await comparisonImageSearch(userInput, convertedWord)
              setWordCardInfo(result);
              setWordWhenClicked(userInput)
              setLoadingCardInfo(false);
            }}
          />
        </div>
        <section className="generator-results">
          <DisplayInstructionsOrResults />
        </section>
        <PhotoCards 
          loadingCardInfo={loadingCardInfo} 
          validatedInput={validatedInput} 
          convertedWord={convertedWord} 
          wordCardInfo={wordCardInfo} 
          validWord={validWord} 
          wordWhenClicked={wordWhenClicked}
        />
      </>
    );
}

export default WordGenerator;