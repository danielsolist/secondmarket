import React, { useState } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="image-gallery-empty">
        <p>No hay imágenes disponibles</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="image-gallery">
      <div className="image-gallery-main">
        <img 
          src={images[currentIndex]} 
          alt={`Imagen ${currentIndex + 1}`}
          className="main-image"
        />
        {images.length > 1 && (
          <>
            <button 
              className="gallery-nav gallery-nav-prev" 
              onClick={goToPrevious}
              aria-label="Imagen anterior"
            >
              ‹
            </button>
            <button 
              className="gallery-nav gallery-nav-next" 
              onClick={goToNext}
              aria-label="Siguiente imagen"
            >
              ›
            </button>
            <div className="gallery-counter">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="image-gallery-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToImage(index)}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <img src={image} alt={`Miniatura ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
