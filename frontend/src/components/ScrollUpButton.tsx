import React, { useState, useEffect } from "react";

export const ScrollUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);

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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed bottom-10 right-5 z-10">
    <div
      onClick={handleClick}
      className={`p-3 text-center content-center cursor-pointer w-14 h-14 border-footerText border-1 rounded-full text-2xl bold bg-primary text-footerText transition-all opacity-60 hover:opacity-90
        ${isVisible ? "block" : "hidden"}`}
      data-tooltip="Scroll up"
    >
      <div className="svg-mask mx-auto arrow-up-icon bg-primaryText h-6 w-6"/>
    </div>
    </div>
  );
};
