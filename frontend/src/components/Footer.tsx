import React, { useEffect, useState } from "react";
import { Links } from "@shared/types/Links";
import api from "../services/api";

function Footer() {
  
  const [links, setLinks] = useState<Links>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await api.get('/api/details/links');
        setLinks(response.data);
      } catch (error) {
        console.error('Failed to fetch the links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
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
    <div className="h-36 bg-footer text-footerText items-center flex justify-between justify-items-center">
      {!loading && <div className="flex-1 flex gap-4 h-fit justify-center">
        {Object.entries(links).map(([key, value]) =>
          renderLink(key.replace("Link", ""), value)
        )}
      </div>}
      <div className="w-fit flex-1 h-fit text-center text-lg">
        @kadmytro 2024, all rights reserved
      </div>
      <div className="flex-1 h-fit"></div>
    </div>
  );
}

export default Footer;
