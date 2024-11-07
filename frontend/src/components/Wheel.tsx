import React, { useState, useEffect, useRef } from "react";
import { useDrag } from "@use-gesture/react";
import { animated } from "react-spring";
import classNames from "classnames";

interface WheelProps {
  items: React.ReactNode[];
  initialItemWidth?: number;
}

const Wheel: React.FC<WheelProps> = ({ items, initialItemWidth = 300 }) => {
  const angleStep = 180 / (items.length - 1);
  const [angle, setAngle] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [wheelHeight, setWheelHeight] = useState(0);
  const [itemWidth, setItemWidth] = useState<number>(initialItemWidth);

  const inertiaRef = useRef<number | null>(null);
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
    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, [containerRef.current]);

  useEffect(() => {
    if (containerWidth <= initialItemWidth + 56) {
      setItemWidth(containerWidth);
    } else if (itemWidth !== initialItemWidth) {
      setItemWidth(initialItemWidth);
    }
  }, [containerWidth]);

  useEffect(() => {
    updateContainerWidth();
    setTimeout(updateWheelHeight, 100);
  });

  useEffect(() => {
    updateWheelHeight();
  }, [items, itemWidth]);

  useEffect(() => {
    const interval = setInterval(() => {
      rotateWheel("right");
    }, 7000);

    return () => clearInterval(interval);
  }, [angle, angleStep]);

  const bind = useDrag(
    ({
      movement: [x],
      memo = angle,
      velocity: [vx, _],
      direction: [dx],
      last,
    }) => {
      let newAngle = memo + x * -0.075; // Adjusted sensitivity
      if (newAngle < 0) {
        newAngle = 180 + newAngle;
      } else if (newAngle > 180) {
        newAngle = newAngle - 180;
      }
      setAngle(newAngle);
      if (last) {
        setVelocity(vx * dx);
        inertiaRef.current = requestAnimationFrame(inertiaStep); // Start inertia
      }
      return memo;
    },
    { axis: "x" }
  );

  useEffect(() => {
    return () => {
      if (inertiaRef.current) {
        cancelAnimationFrame(inertiaRef.current);
      }
    };
  }, []);

  const inertiaStep = () => {
    setAngle((prevAngle) => prevAngle + velocity);
    setVelocity((prevVelocity) => prevVelocity * 0.96);

    if (Math.abs(velocity) > 0.1) {
      inertiaRef.current = requestAnimationFrame(inertiaStep);
    } else {
      const normalizedAngle = angle;
      const closestAngle = Math.round(normalizedAngle / angleStep) * angleStep;
      setAngle(closestAngle);
      setVelocity(0);
    }
  };

  const calculateItemStyle = (index: number) => {
    const displayNumber =
      items.length > 4 && containerWidth > 4 * itemWidth ? 5 : 3;
    let currentAngle = index * angleStep - angle;

    if (Math.abs(currentAngle / angleStep) > displayNumber / 2) {
      currentAngle =
        currentAngle < 0
          ? (items.length + index) * angleStep - angle
          : (index - items.length) * angleStep - angle;
    }

    const radian = (currentAngle * Math.PI) / 180;
    const currentPosition = Math.abs(currentAngle / angleStep);

    const scale =
      1 - 0.05 * (currentPosition + currentPosition * currentPosition);
    const x = Math.sin(radian) * ((itemWidth * items.length) / 3);
    const opacity = currentPosition >= displayNumber / 2 ? 0 : scale;

    return {
      transform: `translateX(${x}px) scale(${scale})`,
      zIndex: Math.round(scale * 100),
      opacity: opacity,
      width: `${itemWidth}px`,
      transition: "all 0.3s ease",
    };
  };

  const rotateWheel = (direction: "left" | "right") => {
    const step = direction === "right" ? angleStep : -angleStep;
    let newAngle = angle + step;

    if (newAngle < -0.5) {
      newAngle = 180;
    } else if (newAngle > 180.5) {
      newAngle = 0;
    }
    setAngle(newAngle);
  };

  const rotateToIndex = (index: number) => {
    const targetAngle = index * angleStep;
    setAngle(targetAngle);
  };

  return (
    <div className="relative w-full min-h-400px overflow-hidden flex flex-col items-center justify-center">
      <div
        className="relative w-full h-fit z-10 flex items-center justify-center"
        style={{ height: `${wheelHeight}px` }}
      >
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 z-50 w-10
                    flex items-center justify-center
                    hover:backdrop-blur-md hover:bg-primary hover:bg-opacity-10 transition-all duration-300 max-h-full"
          style={{ height: `${wheelHeight}px` }}
        >
          <div className="w-full h-full hover:bg-gradient-to-r hover:from-primary hover:from-20% transition-all items-center duration-300">
            <button
              className="h-full w-full hover:scale-125 cursor-pointer duration-300 
                        font-bold text-4xl text-primaryText text-center justify-center text-opacity-60 hover:text-opacity-100"
              onClick={() => rotateWheel("left")}
            >
              ‹
            </button>
          </div>
        </div>
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 z-50 w-10
                    flex items-center justify-center
                    hover:backdrop-blur-md hover:bg-primary hover:bg-opacity-10 transition-all duration-300 max-h-full"
          style={{ height: `${wheelHeight}px` }}
        >
          <div className="w-full h-full bg-primary bg-opacity-0 hover:bg-gradient-to-l hover:from-primary hover:from-20% transition-all items-center duration-300">
            <button
              className="h-full w-full hover:scale-125 cursor-pointer 
                        font-bold text-4xl text-primaryText text-center justify-center text-opacity-60 hover:text-opacity-100 transition-all duration-300"
              onClick={() => rotateWheel("right")}
            >
              ›
            </button>
          </div>
        </div>
        <div
          {...bind()}
          ref={containerRef}
          className={`relative flex items-center justify-center w-full z-10 h-600px cursor-grab active:cursor-grabbing ${
            containerWidth <= initialItemWidth + 56 ? " mx-7" : " mx-14"
          }`}
        >
          {items.map((item, index) => (
            <animated.div
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              style={calculateItemStyle(index)}
              className={classNames(
                "absolute",
                "flex items-center justify-center",
                "transition-transform duration-200"
              )}
            >
              {item}
            </animated.div>
          ))}
        </div>
      </div>

      <div className="flex space-x-2 my-5">
        {items.map((_, index) => (
          <button
            key={index}
            className={classNames(
              "w-3 h-3 rounded-full",
              Math.abs(index * angleStep - angle) < angleStep / 2
                ? "bg-blue-500"
                : "bg-gray-300"
            )}
            onClick={() => rotateToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Wheel;
