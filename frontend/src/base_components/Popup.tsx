import React, { useState } from "react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  containerClassName?: string;
  containerStyle?: React.CSSProperties | undefined;
  className?: string;
  style?: React.CSSProperties | undefined;
}

export const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  children,
  title,
  containerClassName,
  containerStyle,
  className,
  style,
}) => {
  if (!isOpen || children === null) return null;

  return (
    <div
      className={
        "fixed inset-0 max-h-full z-50 flex justify-center bg-primary bg-opacity-20 backdrop-blur overflow-auto " +
        (containerClassName != undefined ? containerClassName : "")
      }
      style={containerStyle}
    >
      <div
        className={
          "relative w-fit max-w-full my-auto h-fit narrow:min-w-300px bg-card p-4 text-cardText rounded-lg shadow-lg " +
          (className != undefined ? className : "")
        }
        style={style}
      >
        <div
          className="absolute z-20 top-4 right-2 svg-mask close-icon w-7 h-7 bg-cardText cursor-pointer hover:scale-125 transition-all"
          onClick={onClose}
        />
        {title && (
          <h3 className="text-center text-2xl font-title px-5">{title}</h3>
        )}
        <div className="z-10">{children}</div>
      </div>
    </div>
  );
};
