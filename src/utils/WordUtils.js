const silabea = require('silabea');
const cheerio = require('cheerio');

export const countSyllables = (word) => {
    const wordExceptions = []
    if(wordExceptions.includes(word)) { return 2; }
    let silabas = silabea.getSilabas(`${word}`);
    return silabas.numeroSilaba
}

export const doesWordExist = async (word) => {
    const response = await fetch(`https://www.wordreference.com/definicion/${word}`)
    let htmlText = await response.text();
    let $ = cheerio.load(htmlText);

    if ($('p#noEntryFound').text().length > 1) {return false}

    return true;
}

export const isWordGenderFeminine = async (word) => {
    let isFeminine = false;

    const response = await fetch(`https://www.wordreference.com/definicion/${word}`)
    let htmlText = await response.text();
    let $ = cheerio.load(htmlText);
    // tells whether masculine, feminine, or both in the case of amigo/amiga
    let genderInfo = $('strong+ .POS2').first().text()

    // if the length is 2, that means itś only one gender, and greater means multiple
    if (genderInfo.length > 2) {
        switch(word[word.length - 1]) {
            case 'o':
                break;
            case 'e':
                break;
            default:
                isFeminine = true;
        }
    } else {
        if ($('strong+ .POS2').text()[1] === 'f') {isFeminine = true}
    }

    return isFeminine;
}

export const comparisonImageSearch = async (word, diminutive) => {
    //Promise.all
    let infoObject = {}
    console.log(word)
    console.log(process.env.REACT_APP_API_KEY)
    console.log(`https://cors-anywhere.herokuapp.com/https://serpapi.com/search?engine=google&q=${word}&tbm=isch&ijn=0&api_key=${process.env.REACT_APP_API_KEY}`)

    const response = await fetch(`https://cors-anywhere.herokuapp.com/https://serpapi.com/search?engine=google&q=${word}&tbm=isch&ijn=0&api_key=${process.env.REACT_APP_API_KEY}`)
    let pictures = await response.json()

    infoObject['original-photo1'] = pictures.images_results[0].thumbnail;
    infoObject['original-photo2'] = pictures.images_results[1].thumbnail;
    infoObject['word'] = word

    const response2 = await fetch(`https://cors-anywhere.herokuapp.com/https://serpapi.com/search?engine=google&q=${diminutive}&tbm=isch&ijn=0&api_key=${process.env.REACT_APP_API_KEY}`)
    let pictures2 = await response2.json()

    console.log(pictures2)

    infoObject['diminutive-photo1'] = pictures2.images_results[0].thumbnail;
    infoObject['diminutive-photo2'] = pictures2.images_results[1].thumbnail;
    infoObject['diminutive'] = diminutive

    return infoObject;
}

export function debounce(fn, delay) {
    let timeoutID;
    return function(...args) {
    if(timeoutID){
        clearTimeout(timeoutID)
    }
    timeoutID = setTimeout( () => {
            fn(...args)
        }, delay) 
    }
}



