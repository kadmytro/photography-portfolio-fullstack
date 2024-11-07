import React, { useEffect, useState } from "react";
import { Links } from "@shared/types/Links";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

  type ScreenType = "wide" | "narrow" | "mobile";

function Footer() {
  const [links, setLinks] = useState<Links>({});
  const [loading, setLoading] = useState(true);
  const [screenType, setScreenType] = useState<ScreenType>("wide");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await api.get("/api/details/links");
        setLinks(response.data);
      } catch (error) {
        console.error("Failed to fetch the links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

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

  const renderLink = (type: string, url: string | undefined) => {
    if (!url) return null;

    const className = `bg-footerText bg-opacity-90 rounded-full h-10 w-10 cursor-pointer svg-mask ${type}-icon`;

    return (
      <a
        key={type}
        className={className}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      ></a>
    );
  };

  return (
    <div className={`h-36 bg-footer text-footerText items-center content-center justify-items-center ${screenType === "wide" ? " flex justify-between" : ""}`}>
      {!loading && (
        <div className="flex-1 py-2 flex gap-4 h-fit justify-center">
          {Object.entries(links).map(([key, value]) =>
            renderLink(key.replace("Link", ""), value)
          )}
        </div>
      )}
      <div className="w-fit flex-1 py-2 h-fit text-center text-lg mx-auto" style={{maxWidth: "90%"}}>
        {`© Copyright 2022 - ${new Date().getFullYear()} | `} 
        <span
          className="hover:underline underline-offset-4 cursor-pointer"
          onClick={() => {
            navigate("/terms");
          }}
        >
          Disclaimer & Privacy{" "}
        </span>
      </div>
      <div className="flex-1 h-fit"></div>
    </div>
  );
}

export default Footer;
