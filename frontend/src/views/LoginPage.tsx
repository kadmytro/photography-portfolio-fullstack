import React, { useEffect, useState } from "react";
import Login from "../components/Login";
import { Popup } from "../base_components/Popup";
import Button from "../base_components/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

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
      <Helmet> <title>Login</title> </Helmet>
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
