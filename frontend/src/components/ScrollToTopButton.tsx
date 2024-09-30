import React, { useState, useEffect } from "react";

export const ScrollToTopButton = () => {
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
    <div
      onClick={handleClick}
      className={`fixed bottom-10 z-50 text-center right-5 p-3 cursor-pointer w-14 h-14 border-footerText border-1 rounded-full text-2xl bold bg-primary text-footerText transition-all opacity-60 hover:opacity-90
        ${isVisible ? "block" : "hidden"}`}
    >
      ↑
    </div>
  );
};
