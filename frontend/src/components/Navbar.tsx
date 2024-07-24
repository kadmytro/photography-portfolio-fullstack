import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme, Theme } from "./ThemeContext";
import headerImageDark from "../images/coverImages/header-dark.jpg";
import headerImageLight from "../images/coverImages/header-light.jpg";

export interface NavbarProps {
  homeText: string;
  homeUrl: string;
  galleryText: string;
  galleryUrl: string;
  pricesText: string;
  pricesUrl: string;
  contactsText: string;
}

export function Navbar({
  homeText,
  homeUrl,
  galleryText,
  galleryUrl,
  pricesText,
  pricesUrl,
  contactsText,
}: NavbarProps) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const topNavHeight: number = 80;
  const [topNavOpacity, setTopNavOpacity] = useState(0);
  const [displayBannerImage, setDisplayBannerImage] = useState(true);
  const topNavBannerHeight: number = displayBannerImage ? 384 : 0;

  const toggleTheme = function (): void {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  const handleScroll = () => {
    const offset = window.scrollY;
    if (!displayBannerImage || offset > topNavBannerHeight - topNavHeight) {
      setTopNavOpacity(100);
    } else {
      let opacity = (offset * 100) / (topNavBannerHeight - topNavHeight);
      opacity = opacity - (opacity % 10);
      setTopNavOpacity(opacity);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    let isGallery = location.pathname =="/gallery";
    setDisplayBannerImage(!isGallery);
    window.scrollTo({
      top: 0,
    });
    handleScroll();
  }, [location]);

  const scrollToContacts = function (): void {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <nav className={"bg-header" + (!displayBannerImage ? " h-20" : "")}>
      <div
        className={`w-full fixed top-0 py-5 bg-header z-10 bg-opacity-${displayBannerImage ? topNavOpacity : 100} ${
          topNavOpacity == 100 ? "" : " transition-colors"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-10">
          <ul className="flex space-x-10 w-1/3 items-center justify-start">
            <li>
              <Link
                className="text-headerText text-opacity-90 hover:text-opacity-100"
                to={homeUrl}
              >
                {homeText}
              </Link>
            </li>
            <li>
              <Link
                className="text-headerText text-opacity-90 hover:text-opacity-100"
                to={galleryUrl}
              >
                {galleryText}
              </Link>
            </li>
          </ul>
          <div className="text-headerText font-bold text-xl">LOGO</div>
          <ul className="flex space-x-10  cursor-pointer w-1/3 h-fit items-center justify-end">
            <li
              className={
                "svg-mask h-10 w-10 bg-headerText " +
                (theme == Theme.DARK ? "dark-theme-icon" : "light-theme-icon")
              }
              onClick={toggleTheme}
            ></li>
            <li>
              <a
                className="text-headerText text-opacity-90 hover:text-opacity-100"
                href={pricesUrl}
              >
                {pricesText}
              </a>
            </li>
            {(location.pathname === "/" || location.pathname == "/home") && (
              <li>
                <div
                  className="text-headerText cursor-pointer text-opacity-90 hover:text-opacity-100"
                  onClick={scrollToContacts}
                >
                  {contactsText}
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
      {displayBannerImage && (
        <div
          className="h-96 transition-all"
          style={{
            backgroundImage: `url(${
              theme == Theme.DARK ? headerImageDark : headerImageLight
            })`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
      )}
    </nav>
  );
}
