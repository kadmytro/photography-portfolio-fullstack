import React, { useState } from "react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  if (!isOpen || children === null) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-primary bg-opacity-20 backdrop-blur">
      <div className="relative w-fit bg-card p-4 text-cardText rounded-lg shadow-lg">
        <div
          className="absolute z-20 top-4 right-2 svg-mask close-icon w-7 h-7 bg-cardText cursor-pointer hover:scale-125 transition-all"
          onClick={onClose}
        />
        {title && <h3 className="text-center text-2xl">{title}</h3>}
        <div className="z-10">{children}</div>
      </div>
    </div>
  );
};
