import React, { useState, useEffect, CSSProperties } from "react";
import { PhotoCardProps } from "./PhotoCard";

interface FullscreenImageViewerProps {
  items: PhotoCardProps[];
  selectedItemId: number;
  onClose: () => void;
}

const FullscreenImageViewer: React.FC<FullscreenImageViewerProps> = ({
  items,
  selectedItemId,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(
    items.findIndex((p) => p.id === selectedItemId)
  );
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setCurrentIndex(items.findIndex((p) => p.id === selectedItemId));
  }, [selectedItemId]);

  const handleNext = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
      setFade(false);
    }, 150);
  };

  const handlePrev = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + items.length) % items.length
      );
      setFade(false);
    }, 150);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrev();
      } else if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const calculateImageStyles = (): CSSProperties => {
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    const imageHeight = items[currentIndex].height;
    const imageWidth = items[currentIndex].width;
    const windowRatio = (windowWidth * 0.9 - 40) / (windowHeight * 0.95); //this includes the margins and other, in order to make precise calculations
    const imageRatio = imageWidth / imageHeight;

    if (windowRatio > imageRatio) {
      // Window is wider than image, limit by height
      return {
        height: "100%",
        width: "auto",
      };
    } else {
      // Window is taller than image, limit by width
      return {
        width: "100%",
        height: "auto",
      };
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen backdrop-blur-lg bg-primary bg-opacity-70 flex justify-center items-center z-50">
      <div className="relative flex items-center justify-center h-full w-full">
        <button
          className="w-5% h-80% text-center align-middle bg-transparent border-none text-primaryText text-opacity-60 hover:text-opacity-100 hover:text-5xl transition-all text-4xl cursor-pointer select-none"
          onClick={handlePrev}
        >
          ‹
        </button>
        <div className="w-90% h-95% flex justify-center items-center my-0 mx-5">
          <img
            src={items[currentIndex].image}
            alt={items[currentIndex].caption}
            style={calculateImageStyles()}
            className={`transition-opacity duration-200 ${
              fade ? "opacity-40" : "opacity-100"
            }`}
          />
        </div>
        <button
          className="w-5% h-80% text-center align-middle bg-transparent border-none text-primaryText text-opacity-60 hover:text-opacity-100 hover:text-5xl transition-all text-4xl cursor-pointer select-none"
          onClick={handleNext}
        >
          ›
        </button>
      </div>
      <button
        className="w-16 h-16 absolute text-center top-1 right-2 bg-transparent border-none text-primaryText text-opacity-60 hover:text-opacity-100 hover:text-5xl transition-all text-4xl cursor-pointer select-none"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};

export default FullscreenImageViewer;
