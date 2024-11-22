import React, { useState } from "react";
import Login from "../components/Login";
import { Popup } from "../base_components/Popup";
import { HelmetProvider } from "react-helmet-async";

function LoginPage() {
  const [popupOpened, setPopupOpened] = useState(false);
  const [popupContent, setPopupContent] = useState<React.ReactNode>(null);
  const onPopupClose = () => {
    setPopupContent(null);
    setPopupOpened(false);
  };

  const onPopupOpen = (content: React.ReactNode) => {
    setPopupContent(content);
    setPopupOpened(true);
  };

  return (
    <>
      <HelmetProvider> <title>Login</title> </HelmetProvider>
      <Login
        openPopupCallback={onPopupOpen}
        closePopupCallback={onPopupClose}
      />
      <Popup
        isOpen={popupOpened}
        title="Success!"
        onClose={onPopupClose}
        containerClassName="mt-20"
        className="-top-10"
      >
        {popupContent}
      </Popup>
    </>
  );
}

export default LoginPage;
