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
    <button
      onClick={handleClick}
      className={`fixed bottom-10 right-5 p-3 w-14 h-14 shadow-sm shadow-primaryText rounded-full text-2xl bold bg-primary text-footerText  transition-all opacity-60 hover:opacity-100
        ${isVisible ? "block" : "hidden"}`}
    >
      ↑
    </button>
  );
};
