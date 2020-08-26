import React from 'react'
import { RiLoader2Line } from 'react-icons/ri';
import './PhotoCards.scss'
import SampleInput1 from '../images/perro1.jpeg'
import SampleInput2 from '../images/perro2.jpeg'
import SampleOuput1 from '../images/perrito1.jpeg'
import SampleOutput2 from '../images/perrito2.jpeg'

// prevent mismatched words and photos
// maybe camera with arrow tooltop explaining to click
const PhotoCards = ({ wordCardInfo, validatedInput, convertedWord, loadingCardInfo, validWord, wordWhenClicked, sampleNames }) => {

    return ( 
        <section className="word-cards-container">
        <div className="word-card original">
          <h3 className="original-title">{(validWord && wordWhenClicked === validatedInput) ? validatedInput : wordCardInfo['word'] || 'perro'}</h3>
            {loadingCardInfo ? <RiLoader2Line className="loading-wheel" /> : 
              <>
                <div className="card-image-wrapper"><img src={wordCardInfo['original-photo1'] || SampleInput1} className="original-photo1" alt="original-photo1" /></div>
                <div className="card-image-wrapper"><img src={wordCardInfo['original-photo2'] || SampleInput2} className="original-photo2" alt="original-photo2" /></div>
              </>}
        </div>

        <div className="word-card diminutive">
          <h3 className="diminutive-title">{(validWord && wordWhenClicked === validatedInput) ? convertedWord : wordCardInfo['diminutive'] || 'perrito'}</h3>
          {loadingCardInfo ? <RiLoader2Line className="loading-wheel" /> : 
              <>
              <div className="card-image-wrapper"><img src={wordCardInfo['diminutive-photo1'] || SampleOuput1} className="diminutive-photo1" alt="diminutive-photo1" /></div>
              <div className="card-image-wrapper"><img src={wordCardInfo['diminutive-photo2'] || SampleOutput2} className="diminutive-photo2" alt="diminutive-photo2" /></div>
              </>}
        </div>
      </section>
    );
}
 
export default PhotoCards;