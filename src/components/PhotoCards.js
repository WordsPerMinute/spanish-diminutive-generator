import React from 'react'
import { RiLoader2Line } from 'react-icons/ri';
import './PhotoCards.scss'

const PhotoCards = ({wordCardInfo, userInput, convertedWord, loadingCardInfo}) => {
    return ( 
        <section className="word-cards-container">
        <div className="word-card original">
          <h3 className="original-title">{userInput || 'Perro'}</h3>
            {loadingCardInfo ? <RiLoader2Line className="loading-wheel" /> : 
              <>
              <img src={wordCardInfo['original-photo1'] || "https://s3.amazonaws.com/FringeBucket/image_placeholder.png"} className="original-photo1" alt="original-photo1" />
              <img src={wordCardInfo['original-photo2'] || "https://s3.amazonaws.com/FringeBucket/image_placeholder.png"} className="original-photo2" alt="original-photo2" />
              </>}
        </div>

        <div className="word-card diminutive">
          <h3 className="diminutive-title">{convertedWord || 'Perrito'}</h3>
          {loadingCardInfo ? <RiLoader2Line className="loading-wheel" /> : 
              <>
              <img src={wordCardInfo['diminutive-photo1'] || "https://s3.amazonaws.com/FringeBucket/image_placeholder.png"} className="diminutive-photo1" alt="diminutive-photo1" />
              <img src={wordCardInfo['diminutive-photo2'] || "https://s3.amazonaws.com/FringeBucket/image_placeholder.png"} className="diminutive-photo2" alt="diminutive-photo2" />
              </>}
        </div>
      </section>
    );
}
 
export default PhotoCards;