import React, { useState, useCallback, useRef } from 'react';
import { doesWordExist, isWordGenderFeminine, countSyllables, comparisonImageSearch, debounce } from '../utils/WordUtils'
import PhotoCards from './PhotoCards'
import { GiPhotoCamera } from 'react-icons/gi';
// import debounce from 'lodash';
import './WordGenerator.scss';

const WordGenerator = (props) => {
  const [userInput, setUserInput] = useState('');
  const [validWord, setValidWord] = useState(true);
  const [convertedWord, setConvertedWord] = useState('');
  const [wordCardInfo, setWordCardInfo] = useState({});
  const [loadingCardInfo, setLoadingCardInfo] = useState(false);


  const convertWord = async (word) => {

    // ideas here :)
    // fixed height for p element, or other stuff
    // add English translations

    if (await doesWordExist(word)) {
      setValidWord(true);
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
    const isFeminineWord = await isWordGenderFeminine(word);

    const wordOneLetterRemoved = word.slice(0, [word.length - 1]);
    const wordTwoLettersRemoved = word.slice(0, [word.length - 2]);

    // start with the most restrictive cases, such as irregulars, and work towards more common
    if (irregularEndsInCoCa) {
      isFeminineWord ?
        setConvertedWord(`${wordTwoLettersRemoved}quita`) :
        setConvertedWord(`${wordTwoLettersRemoved}quito`)
    } else if (irregularEndsInGaGo) {
      //check if second to last letter is 'u', as with 'agua'
      if (word[word.length - 2] === 'u') {
        setConvertedWord(`${wordTwoLettersRemoved}üita`)
      } else {
        isFeminineWord ?
          setConvertedWord(`${wordOneLetterRemoved}uita`) :
          setConvertedWord(`${wordOneLetterRemoved}uito`)
      }
    } else if (word.length === 2) {
      isFeminineWord ?
        setConvertedWord(word + 'cita') :
        setConvertedWord(word + 'cito')
    } else if (syllableTotal === 1 || endsInTwoVowels) {
        if (endsInTwoVowels) {
          switch (lastLetter) {
            default:
              isFeminineWord ?
                setConvertedWord(`${wordOneLetterRemoved}ecita`) :
                setConvertedWord(`${wordOneLetterRemoved}ecito`)
          }
        } else {
          switch (lastLetter) {
            case 's':
              isFeminineWord ?
                setConvertedWord(`${wordOneLetterRemoved}cecitas`) :
                setConvertedWord(`${wordOneLetterRemoved}cecitos`)
              break;
            case 'n':
              setConvertedWord(`${word}ecito`);
              break;
            case 'z':
              isFeminineWord ?
                setConvertedWord(`${wordOneLetterRemoved}cecita`) :
                setConvertedWord(`${wordOneLetterRemoved}cecito`)
              break;
            case 'a':
              isFeminineWord ?
                setConvertedWord(`${wordOneLetterRemoved}cecita`) :
                setConvertedWord(`${wordOneLetterRemoved}cecito`)
              break;
            default:
              isFeminineWord ?
                setConvertedWord(`${word.slice(0, [word.length])}ecita`) :
                setConvertedWord(`${word.slice(0, [word.length])}ecito`)
          }
        }
    } else if (lastLetter === 'o') {
        setConvertedWord(`${wordOneLetterRemoved}ito`)
    } else if (lastLetter === 'a') {
        setConvertedWord(`${wordOneLetterRemoved}ita`)
    } else if (endsInConsonantButNotRNZ) {
        isFeminineWord ?
          setConvertedWord(`${word}ita`) :
          setConvertedWord(`${word}ito`)
    } else if (endsInNREIUOrAccentedVowel) {
        isFeminineWord ?
          setConvertedWord(`${word}cita`) :
          setConvertedWord(`${word}cito`)
    } else if (lastLetter === 'z') {
        isFeminineWord ?
          setConvertedWord(`${wordOneLetterRemoved}cita`) :
          setConvertedWord(`${wordOneLetterRemoved}cito`)
    } else {
      setConvertedWord(`${word}ito`)
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
      setConvertedWord('')
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
              setLoadingCardInfo(true)
              const result = await comparisonImageSearch(userInput, convertedWord)
              setWordCardInfo(result);
              setLoadingCardInfo(false)
            }}
          />
        </div>
        <section className="generator-results">
          <DisplayInstructionsOrResults />
        </section>
        <PhotoCards loadingCardInfo={loadingCardInfo} userInput={userInput} convertedWord={convertedWord} wordCardInfo={wordCardInfo} validWord={validWord} />
      </>
    );
}

export default WordGenerator;