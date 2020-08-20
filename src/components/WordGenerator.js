import React, { useState, setState } from 'react';
import { isWordGenderFeminine, countSyllables, comparisonImageSearch } from '../utils/WordUtils'
import PhotoCards from './PhotoCards'

import { GiPhotoCamera } from 'react-icons/gi';
import './WordGenerator.scss';

const WordGenerator = (props) => {
  const [userInput, setUserInput] = useState('');
  const [convertedWord, setConvertedWord] = useState('');
  const [wordCardInfo, setWordCardInfo] = useState({});

  const convertWord = async (word) => {

    // break the conditions out ahead of time to improve readability 
    const syllableTotal = countSyllables(word)
    const lastLetter = word[word.length - 1]
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
    const feminineWord = await isWordGenderFeminine(word);

    const wordOneLetterRemoved = word.slice(0, [word.length - 1]);
    const wordTwoLettersRemoved = word.slice(0, [word.length - 2]);

    // start with the most restrictive cases, such as irregulars, and work towards more common
    if (irregularEndsInCoCa) {
      feminineWord ?
        setConvertedWord(wordTwoLettersRemoved + 'quita') :
        setConvertedWord(wordTwoLettersRemoved + 'quito')
    } else if (irregularEndsInGaGo) {
      //check if second to last letter is 'u', as with 'agua'
      if (word[word.length - 2] === 'u') {
        setConvertedWord(wordTwoLettersRemoved + 'üita')
      } else {
        feminineWord ?
          setConvertedWord(wordOneLetterRemoved + 'uita') :
          setConvertedWord(wordOneLetterRemoved + 'uito')
      }
    } else if (word.length === 2) {
      feminineWord ?
        setConvertedWord(word + 'cita') :
        setConvertedWord(word + 'cito')
    } else if (syllableTotal === 1 || endsInTwoVowels) {
        if (endsInTwoVowels) {
          switch (lastLetter) {
            default:
              feminineWord ?
                setConvertedWord(wordOneLetterRemoved + 'ecita') :
                setConvertedWord(wordOneLetterRemoved + 'ecito')
          }
        } else {
          switch (lastLetter) {
            case 's':
              feminineWord ?
                setConvertedWord(wordOneLetterRemoved + 'cecitas') :
                setConvertedWord(wordOneLetterRemoved + 'cecitos')
              break;
            case 'n':
              setConvertedWord(word + 'ecito');
              break;
            case 'z':
              feminineWord ?
                setConvertedWord(wordOneLetterRemoved + 'cecita') :
                setConvertedWord(wordOneLetterRemoved + 'cecito')
              break;
            case 'a':
              feminineWord ?
                setConvertedWord(wordOneLetterRemoved + 'cecita') :
                setConvertedWord(wordOneLetterRemoved + 'cecito')
              break;
            default:
              feminineWord ?
                setConvertedWord(word.slice(0, [word.length]) + 'ecita') :
                setConvertedWord(word.slice(0, [word.length]) + 'ecito')
          }
        }
    } else if (lastLetter === 'o') {
        setConvertedWord(wordOneLetterRemoved + 'ito')
    } else if (lastLetter === 'a') {
        setConvertedWord(wordOneLetterRemoved + 'ita')
    } else if (endsInConsonantButNotRNZ) {
        feminineWord ?
          setConvertedWord(word + 'ita') :
          setConvertedWord(word + 'ito')
    } else if (endsInNREIUOrAccentedVowel) {
        feminineWord ?
          setConvertedWord(word + 'cita') :
          setConvertedWord(word + 'cito')
    } else if (lastLetter === 'z') {
        feminineWord ?
          setConvertedWord(wordOneLetterRemoved + 'cita') :
          setConvertedWord(wordOneLetterRemoved + 'cito')
    } else {
      setConvertedWord(word + 'ito')
    }
  }

  const onChange = (e) => {
    setUserInput(e.target.value)

    if (e.target.value.length > 0) {
      let currentSearch = e.target.value;
      convertWord(currentSearch)
    } else {
      setConvertedWord('')
    }
  };
  
  return (
      <>
        <div className="search-wrapper">
          <input
            type="text"
            className="search-box"
            onChange={onChange}
          />
          <GiPhotoCamera 
            className="contract-icon"
            onClick={async () => {
              setWordCardInfo({...comparisonImageSearch(userInput, convertedWord)})
              console.log('completed', wordCardInfo)
            }}
          />
        </div>
        <section className="generator-results">
          {convertedWord.length === 0 ? 
            <><p>Enter a word to get its diminutive!</p><p>When ready, click the camera for a comparison...</p></> : 
            <p>{convertedWord}</p>}
        </section>
        <PhotoCards wordCardInfo={wordCardInfo}/>
      </>
    );
}

export default WordGenerator;