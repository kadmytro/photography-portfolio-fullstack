import React from "react";

export interface FooterProps {
  telegramLink?: string;
  instagramLink?: string;
  linkedInLink?: string;
  youTubeLink?: string;
}

function Footer(props: FooterProps) {
  return (
    <div className="h-36 bg-footer text-footerText items-center flex justify-between justify-items-center">
      <div className="flex-1 flex gap-4 h-fit justify-center">
        {props.telegramLink && (
          <a
            className="bg-footerText bg-opacity-90 rounded-full h-10 w-10 cursor-pointer svg-mask tg-icon"
            href={props.telegramLink}
            target="_blank"
            rel="noopener noreferrer"
          ></a>
        )}
        {props.instagramLink && (
          <a
            className="bg-footerText bg-opacity-90 rounded-full h-10 w-10  cursor-pointer svg-mask ig-icon"
            href={props.instagramLink}
            target="_blank"
            rel="noopener noreferrer"
          ></a>
        )}
        {props.linkedInLink && (
          <a
            className="bg-footerText bg-opacity-90 rounded-full h-10 w-10 cursor-pointer svg-mask lin-icon"
            href={props.linkedInLink}
            target="_blank"
            rel="noopener noreferrer"
          ></a>
        )}
        {props.youTubeLink && (
          <a
            className="bg-footerText bg-opacity-90 rounded-full h-10 w-10 cursor-pointer svg-mask ytb-icon"
            href={props.youTubeLink}
            target="_blank"
            rel="noopener noreferrer"
          ></a>
        )}
      </div>
      <div className="w-fit flex-1 h-fit text-center text-lg">
        @kadmytro 2024, all rights reserved
      </div>
      <div className="flex-1 h-fit"></div>
    </div>
  );
}

export default Footer;
