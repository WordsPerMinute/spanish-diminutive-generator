import React from 'react'

const PhotoCards = ({wordCardInfo}) => {
    console.log(wordCardInfo)

    return ( 
        <section className="word-cards-container">
        <div className="word-card original">
          <h3 className="original-title">Perro</h3>
          <img src="https://s3.amazonaws.com/FringeBucket/image_placeholder.png" className="original-photo1" alt="original-photo1" />
          <img src="https://s3.amazonaws.com/FringeBucket/image_placeholder.png" className="original-photo2" alt="original-photo2" />
        </div>

        <div className="word-card diminutive">
          <h3 className="diminutive-title">Perrito</h3>
          <img src="https://s3.amazonaws.com/FringeBucket/image_placeholder.png" className="diminutive-photo1" alt="diminutive-photo1" />
          <img src="https://s3.amazonaws.com/FringeBucket/image_placeholder.png" className="diminutive-photo2" alt="diminutive-photo2" />

        </div>
      </section>
    );
}
 
export default PhotoCards;