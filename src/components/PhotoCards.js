import React from 'react'
import { RiLoader2Line } from 'react-icons/ri';
import './PhotoCards.scss'
import SampleInput1 from '../images/perro1.jpeg'
import SampleInput2 from '../images/perro2.jpeg'
import SampleOuput1 from '../images/perrito1.jpeg'
import SampleOutput2 from '../images/perrito2.jpeg'

const DEFAULT_IMAGES = {
  original: [SampleInput1, SampleInput2],
  diminutive: [SampleOuput1, SampleOutput2]
};

const PhotoCards = ({ wordCardInfo, validatedInput, convertedWord, loadingCardInfo, validWord, wordWhenClicked }) => {
    const isCurrentSearch = validWord && wordWhenClicked === validatedInput;

    const getDisplayTitle = (currentWord, cachedWord, fallback) => {
      if (loadingCardInfo) return currentWord;
      if (isCurrentSearch) return currentWord;
      return cachedWord || fallback;
    };

    const originalTitle = getDisplayTitle(validatedInput, wordCardInfo.original?.word, 'perro');
    const diminutiveTitle = getDisplayTitle(convertedWord, wordCardInfo.diminutive?.word, 'perrito');

    const originalImages = wordCardInfo.original?.images || DEFAULT_IMAGES.original;
    const diminutiveImages = wordCardInfo.diminutive?.images || DEFAULT_IMAGES.diminutive;

    return (
        <section className="word-cards-container">
        <div className="word-card original">
          <h3 className="original-title">{originalTitle}</h3>
            {loadingCardInfo ? <RiLoader2Line className="loading-wheel" /> :
              <>
                <div className="card-image-wrapper"><img src={originalImages[0]} className="original-photo1" alt="original 1" /></div>
                <div className="card-image-wrapper"><img src={originalImages[1]} className="original-photo2" alt="original 2" /></div>
              </>}
        </div>

        <div className="word-card diminutive">
          <h3 className="diminutive-title">{diminutiveTitle}</h3>
          {loadingCardInfo ? <RiLoader2Line className="loading-wheel" /> :
              <>
              <div className="card-image-wrapper"><img src={diminutiveImages[0]} className="diminutive-photo1" alt="diminutive 1" /></div>
              <div className="card-image-wrapper"><img src={diminutiveImages[1]} className="diminutive-photo2" alt="diminutive 2" /></div>
              </>}
        </div>
      </section>
    );
}
 
export default PhotoCards;