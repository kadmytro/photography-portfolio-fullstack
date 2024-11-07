import React, { useEffect, useState } from "react";
import api from "../services/api";
import LoadingWheel from "./LoadingWheel";
import { Contact } from "@shared/types/Contact";

type ScreenType = "wide" | "narrow" | "mobile";

function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [screenType, setScreenType] = useState<ScreenType>("wide");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get("/api/details/contacts/");
        setContacts(response.data);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const onResize = () => {
    const width = window.innerWidth;
    let newScreenType: ScreenType;

    if (width > 1000) {
      newScreenType = "wide";
    } else if (width > 750) {
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

  const handleClick = (type: string, value: string) => {
    switch (type) {
      case "email":
        window.location.href = `mailto:${value}`;
        break;
      case "phone":
        window.location.href = `tel:${value}`;
        break;
      case "location":
        window.open(
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            value
          )}`
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className="text-primaryText py-12">
      <h3 className="text-4xl text-center py-4 px-10 font-title">Contacts</h3>
      {!loading && (
        <div
          className={`max-w-1000px place-content-center py-4 mx-auto content-center ${
            screenType === "mobile" ? "w-fit" : " flex w-4/5 justify-between"
          }`}
        >
          {Array.isArray(contacts) &&
            contacts.map((contact) =>
              screenType === "mobile" ? (
                <div
                  key={contact.type}
                  onClick={() => handleClick(contact.type, contact.value)}
                  className="flex gap-4 w-fit  my-4"
                >
                  <div
                    className={`svg-mask ${
                      contact.type + "-icon"
                    } h-10 w-10 bg-contain bg-no-repeat bg-primaryText bg-opacity-80`}
                  />
                  <div>{contact.displayValue}</div>
                </div>
              ) : (
                <div
                  key={contact.type}
                  className="h-60 w-60 cursor-pointer content-center"
                  onClick={() => handleClick(contact.type, contact.value)}
                >
                  <div
                    className={`svg-mask ${
                      contact.type + "-icon"
                    } h-24 w-24 mx-auto bg-contain bg-no-repeat bg-primaryText bg-opacity-80 hover:bg-opacity-100`}
                  ></div>
                  <div className="text-center w-full py-4 text-lg">
                    {contact.displayValue}
                  </div>
                </div>
              )
            )}
        </div>
      )}
      {loading && <LoadingWheel />}
    </div>
  );
}

export default Contacts;
