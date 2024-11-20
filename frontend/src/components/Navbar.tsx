import React, { useEffect, useRef, useState } from "react";
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

type ScreenType = "wide" | "narrow" | "mobile";

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
  const [mustHaveBannerImage, setMustHaveBannerImage] = useState(
    mustHaveBanner()
  );
  const { user, logout } = useAuth() || { user: null, logout: null };
  const containerRef = useRef<HTMLInputElement>(null);
  const [screenType, setScreenType] = useState<ScreenType>("wide");
  const [menuOpen, setMenuOpen] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleTheme = function (): void {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleTopNavOpacity = () => {
    const offset = window.scrollY;
    const topNavBannerHeight: number = (displayBannerImage && mustHaveBannerImage) ? 384 : 0;
    let opacity = 0;
    if (!(displayBannerImage && mustHaveBannerImage) || offset > topNavBannerHeight - topNavHeight) {
      opacity = 50;
    } else {
      opacity = (offset * 50) / (topNavBannerHeight - topNavHeight);
      opacity = opacity - (opacity % 10);
    }

    setTopNavOpacity(opacity);
    setMenuOpen(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleTopNavOpacity);
    handleTopNavOpacity();
    return () => {
      window.removeEventListener("scroll", handleTopNavOpacity);
    };
  }, []);

  function mustHaveBanner() {
    return !(
      location.pathname == "/gallery" ||
      location.pathname == "/login" ||
      location.pathname == "/forgot-password" ||
      location.pathname.startsWith("/reset-password") ||
      location.pathname == "/prices" ||
      location.pathname == "/terms" ||
      location.pathname.includes("/admin")
    );
  }

  useEffect(() => {
    setMustHaveBannerImage(mustHaveBanner());
    window.scrollTo({
      top: 0,
    });
    handleTopNavOpacity();
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    handleTopNavOpacity();
  }, [displayBannerImage, mustHaveBannerImage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToContacts = function (): void {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleLogout = async () => {
    if (logout) {
      await logout();
      if (location.pathname === "/admin") {
        navigate("/home");
      }
    }
  };

  const onResize = () => {
    const containerWidth = containerRef.current?.clientWidth || 1024;
    let newScreenType: ScreenType;
    let displayBanner = false;

    if (containerWidth > 1000) {
      newScreenType = "wide";
      displayBanner = true;
    } else if (containerWidth > 450) {
      newScreenType = "narrow";
    } else {
      newScreenType = "mobile";
    }
    setScreenType(newScreenType);
    setDisplayBannerImage(displayBanner);
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
    setMenuOpen(false);
  }, [screenType]);

  return (
    <nav
      className={
        "w-full bg-header font-title" + ((displayBannerImage && mustHaveBannerImage) ? "" : " h-20")
      }
      ref={containerRef}
    >
      <div
        className={`w-full fixed top-0 h-20 content-center py-5 bg-header z-50 backdrop-blur-${
          !(displayBannerImage && mustHaveBannerImage)
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
        } bg-opacity-${(displayBannerImage && mustHaveBannerImage) ? topNavOpacity : 50} ${
          menuOpen ? " border-b-1 border-headerText border-opacity-40" : ""
        }`}
        style={{ minWidth: "325px" }}
      >
        <div className="w-full mx-auto relative flex justify-between items-center text-xl px-10 narrow:px-16 wide:px-32">
          {screenType === "wide" && (
            <ul className="flex space-x-10 w-1/3 items-center justify-start underline-offset-4">
              <li>
                <Link
                  className="text-headerText text-opacity-90 hover:text-opacity-100 hover:underline"
                  to={homeUrl}
                >
                  {homeText}
                </Link>
              </li>
              <li>
                <Link
                  className="text-headerText text-opacity-90 hover:text-opacity-100 hover:underline"
                  to={galleryUrl}
                >
                  {galleryText}
                </Link>
              </li>
            </ul>
          )}
          {screenType !== "wide" && (
            <div className="relative w-9 h-7 content-center+" ref={menuRef}>
              <li
                className={
                  "absolute -left-6 narrow:-left-10 top-1/2 -translate-y-1/2 inset-0 svg-mask h-9 w-9 bg-headerText cursor-pointer hover:scale-110 transition-all menu-icon"
                }
                onClick={toggleMenu}
              />
              {menuOpen && (
                <ul className="bg-header min-w-300px w-1/3 backdrop-blur-xl bg-opacity-20 fixed text-headerText top-20 left-0 p-2 font-title underline-offset-4">
                  <li
                    className="p-4 w-full text-opacity-90 hover:text-opacity-100 hover:underline cursor-pointer"
                    onClick={() => {
                      navigate(homeUrl);
                    }}
                  >
                    {homeText}
                  </li>
                  <li
                    className="p-4 text-opacity-90 hover:text-opacity-100 hover:underline cursor-pointer"
                    onClick={() => {
                      navigate(galleryUrl);
                    }}
                  >
                    {galleryText}
                  </li>
                  <li
                    className="p-4 text-opacity-90 hover:text-opacity-100 hover:underline cursor-pointer"
                    onClick={() => {
                      navigate(pricesUrl);
                    }}
                  >
                    {pricesText}
                  </li>
                </ul>
              )}
            </div>
          )}
          <Link
            className={`text-headerText font-bold text-xl cursor-pointer svg-mask logo-image bg-primaryText h-10 hover:scale-110 transition-all absolute ${
              screenType === "mobile"
                ? " right-28 w-1/2"
                : " left-1/2 -translate-x-1/2 w-56"
            }`}
            to={homeUrl}
          ></Link>
          {screenType !== "wide" && (
            <div
              className={`svg-mask h-7 w-7 bg-headerText  hover:scale-110 transition-all cursor-pointer absolute right-16 ${
                theme == Theme.DARK ? " dark-theme-icon" : "light-theme-icon"
              }`}
              onClick={toggleTheme}
            />
          )}
          {screenType === "wide" && (
            <ul className="flex space-x-10 w-1/3 h-fit items-center justify-end underline-offset-4">
              <li
                className={
                  "svg-mask h-7 w-7 bg-headerText  hover:scale-110 transition-all cursor-pointer " +
                  (theme == Theme.DARK ? "dark-theme-icon" : "light-theme-icon")
                }
                onClick={toggleTheme}
              />
              <li>
                <Link
                  className="text-headerText text-opacity-90 hover:text-opacity-100 hover:underline cursor-pointer"
                  to={pricesUrl}
                >
                  {pricesText}
                </Link>
              </li>
              {(location.pathname === "/" || location.pathname == "/home") && (
                <li>
                  <div
                    className="text-headerText cursor-pointer text-opacity-90 hover:text-opacity-100 hover:underline"
                    onClick={scrollToContacts}
                  >
                    {contactsText}
                  </div>
                </li>
              )}
            </ul>
          )}
          {user && (
            <div
              className={
                "fixed right-4 top-1/2 -translate-y-1/2 svg-mask h-7 w-7 bg-headerText cursor-pointer logout-icon  hover:scale-110 transition-all"
              }
              onClick={handleLogout}
            />
          )}
        </div>
      </div>
      {(displayBannerImage && mustHaveBannerImage) && (
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
