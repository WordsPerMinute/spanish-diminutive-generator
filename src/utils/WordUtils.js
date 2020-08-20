import React from 'react'
const cheerio = require('cheerio');


export const getWordGender = async (word) => {
    let female = false;

    const response = await fetch(`https://www.wordreference.com/definicion/${word}`)
    let htmlText = await response.text();
    let $ = cheerio.load(htmlText);
    console.log('htmlText', htmlText);
    console.log('response body:', response.body);
    let wordGender = $('strong+ .POS2').text()[1];

    if (wordGender === 'f') {
      female = true;
    }

    return female;
}

export const countSyllables = (word) => {
    word = word.toLowerCase();                                     //word.downcase!
    if(word.length <= 3) { return 1; }                             //return 1 if word.length <= 3
      word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
      word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
      return word.match(/[aeiouy]{1,2}/g).length;                    //word.scan(/[aeiouy]{1,2}/).size
}
