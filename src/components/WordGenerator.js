import React, { useState, useCallback, useEffect, useRef } from 'react';
import { doesWordExist, isWordGenderFeminine, countSyllables, comparisonImageSearch, debounce } from '../utils/WordUtils';
import { convertTodiminutive } from '../utils/diminutiveConverter';
import PhotoCards from './PhotoCards'
import { GiPhotoCamera } from 'react-icons/gi';
import './WordGenerator.scss';

const WordGenerator = (props) => {
  const [userInput, setUserInput] = useState('');
  const [validatedInput, setValidatedInput] = useState('');
  const [wordWhenClicked, setWordWhenClicked] = useState('');
  const [validWord, setValidWord] = useState(false);
  const [isCheckingWord, setIsCheckingWord] = useState(false);
  const [convertedWord, setConvertedWord] = useState('');
  const [wordCardInfo, setWordCardInfo] = useState({});
  const [loadingCardInfo, setLoadingCardInfo] = useState(false);
  const [pendingSearch, setPendingSearch] = useState(false);
  const lastSearchedWord = useRef('');

  const doImageSearch = async (word, diminutive) => {
    // Skip if we already searched this word
    if (lastSearchedWord.current === word) return;

    lastSearchedWord.current = word;
    setLoadingCardInfo(true);
    const result = await comparisonImageSearch(word, diminutive);
    setWordCardInfo(result);
    setWordWhenClicked(word);
    setLoadingCardInfo(false);
  };

  // When word becomes valid and we have a pending search, execute it
  useEffect(() => {
    if (pendingSearch && validWord && convertedWord && userInput) {
      setPendingSearch(false);
      doImageSearch(userInput, convertedWord);
    }
  }, [pendingSearch, validWord, convertedWord, userInput]);

  const convertWord = async (word) => {

    // ideas here :)
    // fixed height for p element, or other stuff
    // add English translations

    setIsCheckingWord(true);
    if (await doesWordExist(word)) {
      setValidWord(true);
      setValidatedInput(word);
    } else {
      setValidWord(false);
      setIsCheckingWord(false);
      return
    }

    const syllableTotal = countSyllables(word);
    const isFeminineWord = await isWordGenderFeminine(word);
    const diminutive = convertTodiminutive(word, isFeminineWord, syllableTotal);
    setConvertedWord(diminutive);
    setIsCheckingWord(false);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((value) => onChange(value), 500),
    [] // intentionally empty - we want debounce created once
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
    if (validWord === false && userInput.length > 0 && !isCheckingWord) {
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
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                setPendingSearch(true);
              }
            }}
          />
          <GiPhotoCamera
            className="contract-icon"
            onClick={() => {
              if (validWord && convertedWord) {
                doImageSearch(userInput, convertedWord);
              }
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