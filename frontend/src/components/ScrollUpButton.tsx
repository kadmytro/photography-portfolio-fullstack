import React, { useState, useEffect } from "react";

type ScreenType = "wide" | "narrow" | "mobile";

export const ScrollUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [screenType, setScreenType] = useState<ScreenType>("wide");

  const handleScroll = () => {
    const halfHeight = window.innerHeight / 2;
    if (window.scrollY > halfHeight) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  
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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`fixed z-10 ${screenType === "mobile" ? "bottom-28 right-2" : "bottom-10 right-5"}`}>
    <div
      onClick={handleClick}
      className={`text-center content-center cursor-pointer border-footerText border-1 rounded-full bg-primary transition-all opacity-60 hover:opacity-90
        ${screenType === "mobile" ? "w-10 h-10" : "p-3 w-14 h-14"}
        ${isVisible ? "block" : "hidden"}`}
      data-tooltip="Scroll up"
    >
      <div className="svg-mask mx-auto arrow-up-icon bg-primaryText h-6 w-6"/>
    </div>
    </div>
  );
};
