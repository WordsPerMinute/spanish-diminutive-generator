import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const WordGenerator = (props) => {
  const [convertedWord, setConvertedWord] = useState('');
  const [showConvertedWord, setShowConvertedWord] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [convertedWordDiv, setConvertedWordDiv] = useState(null);

  const convertWord = (word) => {
    if (word[word.length - 1] === 'o') {
      setConvertedWord(word.slice(0, [word.length - 1]) + 'ito')
    } else if (word[word.length - 1] === 'a') {
      setConvertedWord(word.slice(0, [word.length - 1]) + 'ita')
    }  else if (word[word.length - 1] === 'r') {
      setConvertedWord(word + 'ito')
    } else if (
      word[word.length - 1] === ('a')
      || word[word.length - 1] === ('á')
      || word[word.length - 1] === ('e')
      || word[word.length - 1] === ('é')
      || word[word.length - 1] === ('i')
      || word[word.length - 1] === ('í')
      || word[word.length - 1] === ('o')
      || word[word.length - 1] === ('ó')
      || word[word.length - 1] === ('u')
      || word[word.length - 1] === ('ú')
      ) {
      setConvertedWord(word + 'cito')
    } else {
      setConvertedWord(word + 'ito')
    }
  }

  const onChange = (e) => {
    console.log('onChanges');

    // setUserInput(e.currentTarget.value);
    if (e.target.value.length > 0) {
      let currentSearch = e.target.value;
      convertWord(currentSearch)
    } else {
      setConvertedWord('')
    }

  };

  const onClick = (e) => {
    setShowConvertedWord(false);
    setUserInput(e.currentTarget.innerText)
  };

  const onKeyDown = (e) => {

    if (e.keyCode === 13) {
      return;
    } else if (e.keyCode === 38) {
      // up arrow
      return;
    } else if (e.keyCode === 40) {
      // down arrow
      return;
    }
  };

  if (setConvertedWord && userInput) {
    let convertedWordDiv = (
      <></>
    )

    if (convertedWord.length) {
      setConvertedWordDiv(
        <ul className="convertedWord">
          <li className={"search-box"} key={userInput} onClick={onClick}>
            {convertedWord}
          </li>
        </ul>
      );
    } else {
      setConvertedWordDiv(
        <div className="no-options">
          <em>Enter a word above to generate the diminutive!</em>
        </div>
      );
    }
  }
  
  return (
      <React.Fragment>
        <div className="search">
          <input
            type="text"
            className="search-box"
            onChange={onChange}
          />
          <input type="submit" value="" className="search-btn" />
        </div>
        {convertedWord}
      </React.Fragment>
    );
}

export default WordGenerator;