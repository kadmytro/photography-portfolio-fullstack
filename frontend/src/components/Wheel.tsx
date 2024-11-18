import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

interface WheelProps {
  items: React.ReactNode[];
  initialItemWidth?: number;
}

type ScreenType = "wide" | "narrow" | "mobile";

const Wheel: React.FC<WheelProps> = ({ items, initialItemWidth = 300 }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [fade, setFade] = useState(false);
  const [screenType, setScreenType] = useState<ScreenType>("wide");
  const [isDragging, setIsDragging] = useState(false);
  const [startTouch, setStartTouch] = useState<React.Touch | null>(null);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [containerWidth, setContainerWidth] = useState(initialItemWidth);
  const [wheelHeight, setWheelHeight] = useState(0);
  const [itemWidth, setItemWidth] = useState<number>(initialItemWidth);
  const [itemMargin, setItemMargin] = useState<number>(25);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const updateContainerWidth = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      setContainerWidth(containerWidth);
    }
  };

  const updateWheelHeight = () => {
    if (itemsRef) {
      const heights = itemsRef.current.map((item) => item?.clientHeight || 0);
      const maxHeight = Math.max(...heights);
      setWheelHeight(maxHeight);
    }
  };

  useEffect(() => {
    const itemWithMargin = initialItemWidth + 2 * itemMargin;
    if (containerWidth <= itemWithMargin) {
      setItemWidth(Math.min(containerWidth, initialItemWidth));
    } else {
      setItemWidth(initialItemWidth);
    }
  }, [containerWidth]);

  useEffect(() => {
    setTimeout(updateWheelHeight, 100);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 7000);

    return () => clearInterval(interval);
  }, [currentIndex, items]);

  useEffect(() => {
    updateContainerWidth();
  }, [containerRef.current]);

  useEffect(() => {
    updateWheelHeight();
  }, [items, itemWidth]);

  const onResize = () => {
    const width = window.innerWidth;
    let newScreenType: ScreenType;

    if (width > 1000) {
      newScreenType = "wide";
    } else if (width > 450) {
      newScreenType = "narrow";
    } else {
      newScreenType = "mobile";
    }
    setScreenType(newScreenType);
    updateContainerWidth();
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
    setStartTouch(e.touches[0]);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startTouch) return;

    const touch = e.touches[0];

    if (
      !isDragging &&
      Math.abs(touch.clientX - (startTouch?.clientX ?? 0)) <
        Math.abs(touch.clientY - (startTouch?.clientY ?? 0))
    ) {
      setStartTouch(null);
      return;
    }

    e.stopPropagation();
    document.body.style.overflow = "hidden";
    setIsDragging(true);
    const itemFullWidth = itemWidth + 2 * itemMargin;
    const deltaX = touch.clientX - startTouch.clientX;
    if (Math.abs(deltaX) > itemFullWidth) {
      const trueDelta = itemFullWidth * (deltaX / Math.abs(deltaX));
      setOffsetX(trueDelta);
    } else {
      setOffsetX(deltaX);
    }
  };

  const handleTouchEnd = () => {
    document.body.style.overflow = "";
    if (!isDragging && !fade) return;
    setStartTouch(null);
    setIsTransitioning(true);
    setIsDragging(false);
    const fullItemWidth = itemWidth + 2 * itemMargin;
    const relativeOffsetX = offsetX / fullItemWidth;
    const newOffset =
      relativeOffsetX < -0.1
        ? -fullItemWidth
        : relativeOffsetX > 0.1
        ? fullItemWidth
        : 0;
    setOffsetX(newOffset);
    const newIndex =
      relativeOffsetX < -0.1
        ? (currentIndex + 1) % items.length
        : relativeOffsetX > 0.1
        ? (currentIndex - 1 + items.length) % items.length
        : currentIndex;
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setFade(false);
      setOffsetX(0);
      setIsTransitioning(false);
    }, 500);
  };

  const getTranslateValue = () => {
    const width = itemWidth + 2 * itemMargin;
    const translatePercentage =
      containerWidth / 2 + offsetX - (visibleItems.length * width) / 2;
    return translatePercentage;
  };

  const getVisibleItems = () => {
    const maxFullItems = containerWidth / itemWidth;
    const totalItemsNumber = maxFullItems + (maxFullItems % 2 ? 2 : 1);
    const result = [];

    for (let i = Math.floor(totalItemsNumber / 2); i > 0; i--) {
      const index = (currentIndex - i + items.length) % items.length;
      result.push(items[index]);
    }

    result.push(items[currentIndex]);

    for (let i = 1; i <= Math.floor(totalItemsNumber / 2); i++) {
      const index = (currentIndex + i) % items.length;
      result.push(items[index]);
    }

    return result;
  };

  const visibleItems = getVisibleItems();

  const handleNext = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (!items.length) return;
    e?.stopPropagation();
    e?.currentTarget.blur();
    setIsTransitioning(true);
    setFade(true);
    setOffsetX(-(itemWidth + 2 * itemMargin));
    setTimeout(() => {
      let newIndex = (currentIndex + 1) % items.length;
      setCurrentIndex(newIndex);
      setFade(false);
      setOffsetX(0);
      setIsTransitioning(false);
    }, 200);
  };

  const handlePrev = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (!items.length) return;
    e?.stopPropagation();
    e?.currentTarget.blur();
    setIsTransitioning(true);
    setFade(true);
    setOffsetX(itemWidth + 2 * itemMargin);
    setTimeout(() => {
      setCurrentIndex((currentIndex - 1 + items.length) % items.length);
      setFade(false);
      setOffsetX(0);
      setIsTransitioning(false);
    }, 200);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrev();
      } else if (event.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex]);

  const calculateItemStyle = (
    index: number
  ): React.CSSProperties | undefined => {
    const centralItemIndex = Math.floor(visibleItems.length / 2);
    const fullWidth = itemWidth + itemMargin * 2;
    const currentCenterIndex = centralItemIndex - offsetX / fullWidth;
    const angle = (90 / centralItemIndex) * (currentCenterIndex - index);
    const radian = (angle * Math.PI) / 180;
    const scale = Math.pow(
      1 -
        Math.abs(index - currentCenterIndex) *
          (screenType === "mobile" ? 0.01 : 0.1),
      2
    );
    const translate =
      Math.abs(currentCenterIndex - index) * angle * Math.abs(Math.sin(radian));
    const opacity =
      Math.abs(currentCenterIndex - index) >= items.length / 2
        ? 0
        : 1 - Math.abs(currentCenterIndex - index) * 0.1;
    return {
      width: `${itemWidth}px`,
      marginInline: `${itemMargin}px`,
      transform: `translateX(${translate}px) scale(${
        1 - Math.abs(Math.sin(radian)) * 0.3
      })`,
      zIndex: `${Math.round(scale * 100) / 10}`,
      opacity: opacity,
      transition: `${isDragging || offsetX === 0 ? "none" : "transform 0.15s"}`,
    };
  };

  const gotoIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="relative w-full min-h-400px overflow-hidden flex-col flex justify-center items-center z-10"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={isDragging ? { touchAction: "none" } : {}}
    >
      <div className="relative flex items-center justify-center h-full w-full z-20">
        {screenType !== "mobile" && (
          <button
            className="w-12 h-full z-20 absolute left-0 text-left pl-3 bg-transparent bg-opacity-0 border-none text-primaryText 
              text-opacity-60 hover:text-opacity-100 hover:text-5xl duration-200 transition-all text-4xl cursor-pointer select-none"
            onClick={handlePrev}
          >
            ‹
          </button>
        )}
        <div
          className={`flex w-full h-full items-center ${
            (offsetX !== 0 && !isDragging) || fade
              ? " transition-transform ease-in-out"
              : ""
          }`}
          ref={containerRef}
          style={{
            transform: `translateX(${getTranslateValue()}px)`,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 content-center h-full w-full transition-opacity"
              style={calculateItemStyle(index)}
              ref={(el) => (itemsRef.current[index] = el)}
            >
              {item}
            </div>
          ))}
        </div>
        {screenType !== "mobile" && (
          <button
            className="w-12 h-full z-20 absolute right-0 text-right pe-3 bg-transparent bg-opacity-0 border-none text-primaryText 
            text-opacity-60 hover:text-opacity-100 hover:text-5xl transition-all text-4xl cursor-pointer select-none"
            onClick={handleNext}
          >
            ›
          </button>
        )}
      </div>
      <div className="flex space-x-2 my-5">
        {Array.isArray(items) &&
          items.map((_, index) => (
            <button
              key={index}
              className={classNames(
                "w-3 h-3 rounded-full",
                (Math.round(
                  currentIndex - offsetX / (2 * itemMargin + itemWidth)
                ) +
                  items.length) %
                  items.length ===
                  index
                  ? "bg-blue-500"
                  : "bg-gray-300"
              )}
              onClick={() => gotoIndex(index)}
            />
          ))}
      </div>
    </div>
  );
};

Wheel.propTypes = {};

export default Wheel;
