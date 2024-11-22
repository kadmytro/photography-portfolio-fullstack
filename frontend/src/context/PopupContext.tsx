import React, { createContext, useContext, useState } from "react";
import { Popup } from "../base_components/Popup";

const PopupContext = createContext({
  openPopup: (content: React.ReactNode, title?: string) => {},
  closePopup: () => {},
});

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [popupOpened, setPopupOpened] = useState(false);
  const [popupContent, setPopupContent] = useState<React.ReactNode>(null);
  const [popupTitle, setPopupTitle] = useState<string | undefined>();

  const openPopup = (content: React.ReactNode, title?: string) => {
    setPopupContent(content);
    setPopupTitle(title);
    setPopupOpened(true);
  };

  const closePopup = () => {
    setPopupOpened(false);
    setPopupContent(null);
    setPopupTitle(undefined);
  };

  return (
    <PopupContext.Provider value={{ openPopup, closePopup }}>
      {children}
      {popupOpened && (
        <Popup isOpen={popupOpened} title={popupTitle} onClose={closePopup}>
          {popupContent}
        </Popup>
      )}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
