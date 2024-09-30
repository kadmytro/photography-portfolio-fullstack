import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme, Theme } from "../context/ThemeContext";
import headerImageDark from "../images/coverImages/header-dark.jpg";
import headerImageLight from "../images/coverImages/header-light.jpg";
import { useAuth } from "../context/AuthContextType";

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
  const navigate = useNavigate();
  const topNavHeight: number = 80;
  const [topNavOpacity, setTopNavOpacity] = useState(0);
  const [displayBannerImage, setDisplayBannerImage] = useState(true);
  const { user, logout } = useAuth();

  const toggleTheme = function (): void {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  const handleTopNavOpacity = () => {
    const offset = window.scrollY;
    const topNavBannerHeight: number = displayBannerImage ? 384 : 0;
    let opacity = 0;
    if (!displayBannerImage || offset > topNavBannerHeight - topNavHeight) {
      opacity = 50;
    } else {
      opacity = (offset * 50) / (topNavBannerHeight - topNavHeight);
      opacity = opacity - (opacity % 10);
    }

    setTopNavOpacity(opacity);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleTopNavOpacity);
    handleTopNavOpacity();
    return () => {
      window.removeEventListener("scroll", handleTopNavOpacity);
    };
  }, []);

  useEffect(() => {
    let displayBanner = !(
      location.pathname == "/gallery" ||
      location.pathname == "/login" ||
      location.pathname == "/prices" ||
      location.pathname.includes("/admin")
    );
    setDisplayBannerImage(displayBanner);
    window.scrollTo({
      top: 0,
    });
    handleTopNavOpacity();
  }, [location]);

  useEffect(() => {
    handleTopNavOpacity();
  }, [displayBannerImage]);

  const scrollToContacts = function (): void {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleLogout = async () => {
    await logout();
    if (location.pathname == "/admin") {
      navigate("/home");
    }
  };

  return (
    <nav className={"bg-header" + (!displayBannerImage ? " h-20" : "")}>
      <div
        className={`w-full fixed top-0 py-5 bg-header z-50 backdrop-blur-${
          !displayBannerImage
            ? "xl"
            : topNavOpacity < 10
            ? "none"
            : topNavOpacity < 20
            ? "sm"
            : topNavOpacity < 30
            ? "md"
            : topNavOpacity < 40
            ? "lg"
            : "xl"
        } bg-opacity-${displayBannerImage ? topNavOpacity : 50}`}
      >
        <div className="container mx-auto flex justify-between items-center text-lg px-10">
          <ul className="flex space-x-10 w-1/3 items-center justify-start">
            <li>
              <Link
                className="text-headerText text-opacity-90 hover:text-opacity-100 hover:font-medium"
                to={homeUrl}
              >
                {homeText}
              </Link>
            </li>
            <li>
              <Link
                className="text-headerText text-opacity-90 hover:text-opacity-100 hover:font-medium"
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
            />
            <li>
              <a
                className="text-headerText text-opacity-90 hover:text-opacity-100 hover:font-medium"
                href={pricesUrl}
              >
                {pricesText}
              </a>
            </li>
            {(location.pathname === "/" || location.pathname == "/home") && (
              <li>
                <div
                  className="text-headerText cursor-pointer text-opacity-90 hover:text-opacity-100 hover:font-medium"
                  onClick={scrollToContacts}
                >
                  {contactsText}
                </div>
              </li>
            )}
            {user && (
              <li>
                <div
                  className={
                    "fixed right-4 top-5 svg-mask h-10 w-10 bg-headerText cursor-pointer logout"
                  }
                  onClick={handleLogout}
                />
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
