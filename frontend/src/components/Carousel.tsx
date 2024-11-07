import React, { useState, useEffect, useRef } from "react";

interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = false,
  autoPlayInterval = 20000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemWidth = 320; // Width of each item
  const visibleItems = 3; // Number of items visible in the carousel

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "clientX" in e ? e.clientX : e.touches[0].clientX;
    setIsDragging(true);
    setStartX(clientX);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = "clientX" in e ? e.clientX : e.touches[0].clientX;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    const draggedIndex = Math.round(dragOffset / itemWidth);
    const newIndex = (currentIndex - draggedIndex + items.length) % items.length;
    setCurrentIndex(newIndex);
    setDragOffset(0);
    setIsDragging(false);
  };

  useEffect(() => {
    if (autoPlay) {
      intervalRef.current = setInterval(handleNext, autoPlayInterval);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval]);

  useEffect(() => {
    if (containerRef.current) {
      const offset = -(
        (currentIndex * itemWidth) -
        (itemWidth * (visibleItems - 1)) / 2
      );
      containerRef.current.style.transition = isDragging ? "none" : "transform 0.5s ease";
      containerRef.current.style.transform = `translateX(calc(${offset}px + ${dragOffset}px))`;
    }
  }, [currentIndex, dragOffset, isDragging]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 flex items-center z-10 p-2"
        onClick={handlePrev}
      >
        <button className="p-2 bg-gray-700 text-white rounded-full focus:outline-none">
          &#10094;
        </button>
      </div>
      <div
        className="flex items-center cursor-grab"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        ref={containerRef}
      >
        {Array.isArray(items) && items.map((item, index) => (
          <div
            key={index}
            className={`mx-4 cursor-pointer transition-transform duration-300 ease-in-out ${
              index === currentIndex
                ? "transform scale-100"
                : "transform scale-75 opacity-50"
            }`}
            onClick={() => handleSelect(index)}
          >
            {item}
          </div>
        ))}
      </div>
      <div
        className="absolute inset-y-0 right-0 flex items-center z-10 p-2"
        onClick={handleNext}
      >
        <button className="p-2 bg-gray-700 text-white rounded-full focus:outline-none">
          &#10095;
        </button>
      </div>
      <div className="absolute bottom-4 flex justify-center w-full">
        {Array.isArray(items) && items.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 mx-1 rounded-full cursor-pointer ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => handleSelect(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
