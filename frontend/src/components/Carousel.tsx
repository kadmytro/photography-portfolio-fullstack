import React, { useState, useEffect } from 'react';

interface IImage {
  src: string
  alt: string
  description: string
}

interface CarouselProps {
  images: IImage[]
}

export function  Carousel(props : CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(Math.floor(Math.random() * props.images.length));

  const images = props.images;

    
  useEffect(() => {
      let interval : NodeJS.Timer;
      interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
      }, Math.floor(Math.random() * 3000 + 2000));

    return () => {
      clearInterval(interval);
    };
  }, [images.length]);

  const handleIndicatorClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="w-2/4 h-fit bg-gray-100 p-4">
      <div className="w-full mx-auto relative">
        <div className="w-full h-80">
          <img
            className="w-full h-80 object-cover rounded-sm"
            src={images[currentSlide].src}
            alt={images[currentSlide].alt}
          />
        </div>
        <p className="text-center mt-2">{images[currentSlide].description}</p>
        <div className="flex justify-center mt-2 align-baseline">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full mx-1 cursor-pointer ${
                index === currentSlide ? 'bg-gray-800' : 'bg-gray-400'
              }`}
              onClick={() => handleIndicatorClick(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
