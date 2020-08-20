import React, { useState, useEffect } from 'react';
// import $ from 'jquery'
// var googleTranslate = require('google-translate')(apiKey, options);
const cheerio = require('cheerio');
const request = require('request');

const WordGenerator = (props) => {
  const [convertedWord, setConvertedWord] = useState('');
  const [showConvertedWord, setShowConvertedWord] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [convertedWordDiv, setConvertedWordDiv] = useState(null);


  const getWordGender = (word) => {
    let gender = '';
    console.log(word)
    request({
      method: 'GET',
      url: `https://www.wordreference.com/definicion/${word}`,
      
    }, (err, res, body) => {
      if (err) return console.error(err);
      let $ = cheerio.load(body);
      let wordGender = $('strong+ .POS2').text()[1];
      console.log(wordGender)

      if (wordGender === 'f') {
        gender = 'female';
      } else {
        gender = 'male';
      }
    });
    console.log(gender)
    return gender;
  }

  const convertWord = (word) => {

    const countSyllables = (word) => {
      word = word.toLowerCase();                                     //word.downcase!
      if(word.length <= 3) { return 1; }                             //return 1 if word.length <= 3
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
        word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
        return word.match(/[aeiouy]{1,2}/g).length;                    //word.scan(/[aeiouy]{1,2}/).size
    }



    const syllableTotal = countSyllables(word)

    const lastLetter = word[word.length - 1]

    if (syllableTotal === 1) {
      switch (lastLetter) {
        case 's':
          setConvertedWord(word.slice(0, [word.length - 1]) + 'cecitos')
          break;
        case 'n':
          setConvertedWord(word + 'ecito');
        default:
          setConvertedWord(word + 'ecito');

      }
    } else if (word[word.length - 1] === 'o') {
      setConvertedWord(word.slice(0, [word.length - 1]) + 'ito')
    } else if (word[word.length - 1] === 's') {
      console.log('came here')

    } else if (word[word.length - 1] === 'a') {
      setConvertedWord(word.slice(0, [word.length - 1]) + 'ita')
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
      || word[word.length - 1] === ('n')
      || word[word.length - 1] === ('r')
      ) {
      setConvertedWord(word + 'cito')
    } else if (word[word.length - 1] === 'z') {
      // use translation API for gender
      // setConvertedWord(word.slice(0, [word.length - 1]) + 'cita')
      // setConvertedWord(word.slice(0, [word.length - 1]) + 'cito')
      let wordUP = getWordGender(word);
      console.log(wordUP)
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