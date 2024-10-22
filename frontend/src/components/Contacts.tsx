import React, { useEffect, useState } from "react";
import api from "../services/api";
import LoadingWheel from "./LoadingWheel";
import { Contact } from "@shared/types/Contact";

function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get('/api/details/contacts/');
        setContacts(response.data);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
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
      { !loading && 
        <div className="flex w-4/5 max-w-1000px place-content-center justify-between py-4 mx-auto content-center">
          {contacts.map((contact) => (
            <div
              key={contact.type}
              className="h-60 w-60 cursor-pointer content-center"
              onClick={() => handleClick(contact.type, contact.value)}
            >
              <div
                className={`svg-mask ${contact.type + "-icon"} h-24 w-24 mx-auto bg-contain bg-no-repeat bg-primaryText bg-opacity-80 hover:bg-opacity-100`}
              ></div>
              <div className="text-center w-full py-4 text-lg">{contact.displayValue}</div>
            </div>
          ))}
        </div>
      }
      { loading && <LoadingWheel/>}
    </div>
  );
}

export default Contacts;
