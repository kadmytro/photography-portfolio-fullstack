import React, { useState, useEffect, CSSProperties, useRef } from "react";
import { PhotoCardProps } from "./PhotoCard";

interface FullscreenImageViewerProps {
  items: PhotoCardProps[];
  selectedItemId: number;
  onClose: () => void;
}

type ScreenType = "wide" | "narrow" | "mobile";

const FullscreenImageViewer: React.FC<FullscreenImageViewerProps> = ({
  items,
  selectedItemId,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(
    items.findIndex((p) => p.id === selectedItemId)
  );
  const [fade, setFade] = useState(false);
  const [screenType, setScreenType] = useState<ScreenType>("wide");
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const onResize = () => {
    const width = window.innerWidth;
    let newScreenType: ScreenType;

    if (width > 1000) {
      newScreenType = "wide";
    } else if (width > 750) {
      newScreenType = "narrow";
    } else {
      newScreenType = "mobile";
    }
    setScreenType(newScreenType);
  };

  useEffect(() => {
    onResize();
  });

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (isTransitioning) return;
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    const deltaX = e.touches[0].clientX - startX;
    setOffsetX(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsTransitioning(true);
    setIsDragging(false);
    const containerWidth = window.innerWidth;
    const relativeOffsetX = offsetX / containerWidth;
    const newOffset =
      relativeOffsetX < -0.025
        ? -containerWidth
        : relativeOffsetX > 0.025
        ? containerWidth
        : 0;
    setOffsetX(newOffset);
    const newIndex =
      relativeOffsetX < -0.025
        ? (currentIndex + 1) % items.length
        : relativeOffsetX > 0.025
        ? (currentIndex - 1 + items.length) % items.length
        : currentIndex;
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setOffsetX(0);
      setIsTransitioning(false);
    }, 200);
  };

  const getTranslateValue = () => {
    const translatePercentage = -100 + (offsetX / window.innerWidth) * 100;
    return translatePercentage;
  };

  const getVisibleImages = () => {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    const nextIndex = (currentIndex + 1) % items.length;
    return [items[prevIndex], items[currentIndex], items[nextIndex]];
  };

  const visibleImages = getVisibleImages();

  const calculateImageStyles = (image: PhotoCardProps): CSSProperties => {
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    const imageHeight = image.height;
    const imageWidth = image.width;
    const windowRatio =
      screenType === "wide"
        ? (windowWidth * 0.9 - 40) / (windowHeight * 0.95)
        : windowWidth / windowHeight;
    const imageRatio = imageWidth / imageHeight;

    if (windowRatio > imageRatio) {
      return {
        height: "100%",
        width: "auto",
      };
    } else {
      return {
        width: "100%",
        height: "auto",
      };
    }
  };
  const handleNext = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setFade(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
      setFade(false);
    }, 150);
  };

  const handlePrev = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
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

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen backdrop-blur-lg bg-primary bg-opacity-70 flex justify-center items-center z-50"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "none", WebkitTapHighlightColor: "transparent" }}
    >
      <div className="relative flex items-center justify-center h-full w-full z-20">
        <button
          className="w-1/3 wide:w-1/5 h-full z-20 absolute left-0 text-left pl-3 bg-transparent bg-opacity-0 border-none text-primaryText text-opacity-0 
            narrow:text-opacity-60 narrow:hover:text-opacity-100 narrow:hover:text-5xl transition-all text-4xl cursor-pointer select-none"
          onClick={handlePrev}
          style={{ WebkitTapHighlightColor: "transparent", userSelect: "none" }}
        >
          ‹
        </button>
        <div
          className={`flex h-full items-center ${
            offsetX !== 0 && !isDragging
              ? " transition-transform ease-in-out"
              : ""
          }`}
          style={{
            transform: `translateX(${getTranslateValue()}%)`,
          }}
        >
          {visibleImages.map((image, idx) => (
            <div
              key={image.id}
              className="flex-shrink-0 content-center h-full w-full"
            >
              <img
                src={image.image}
                alt={image.caption}
                style={calculateImageStyles(image)}
                draggable="false"
                className={`mx-auto transition-opacity duration-200 ${
                  fade ? "opacity-40" : "opacity-100"
                }`}
              />
            </div>
          ))}
        </div>
        <button
          className="w-1/3 wide:w-1/5 h-full z-20 absolute right-0 text-right pe-3 bg-transparent bg-opacity-0 border-none text-primaryText text-opacity-0 
            narrow:text-opacity-60 narrow:hover:text-opacity-100 narrow:hover:text-5xl transition-all text-4xl cursor-pointer select-none"
          onClick={handleNext}
          style={{ WebkitTapHighlightColor: "transparent", userSelect: "none" }}
        >
          ›
        </button>
      </div>
      <button
        className="w-9 h-9 z-50 narrow:w-16 narrow:h-16 absolute text-center top-1 right-1 bg-transparent border-none text-primaryText text-opacity-60 hover:text-opacity-100 hover:text-5xl transition-all text-4xl cursor-pointer select-none"
        onClick={onClose}
        style={{ WebkitTapHighlightColor: "transparent", userSelect: "none" }}
      >
        ×
      </button>
    </div>
  );
};

export default FullscreenImageViewer;
