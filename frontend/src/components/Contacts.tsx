import React from "react";

type ContactItem = {
  id: string;
  iconClass: string;
  label: string;
  value: string;
  displayValue: string;
  type: "email" | "phone" | "location";
};

const contactItems: ContactItem[] = [
  {
    id: "phone",
    iconClass: "phone-icon",
    label: "Phone",
    value: "+4 25 23 254",
    displayValue: "+4 25 23 254", // Example, can be formatted as needed
    type: "phone",
  },
  {
    id: "location",
    iconClass: "location-icon",
    label: "Location",
    value: "London, UK",
    displayValue: "London, UK", // Example, can be formatted as needed
    type: "location",
  },
  {
    id: "email",
    iconClass: "email-icon",
    label: "Email",
    value: "some.email@email.com",
    displayValue: "some.email@email.com", // Example, can be formatted as needed
    type: "email",
  },
];

function Contacts() {
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
      <h3 className="text-4xl text-center py-4 px-10">Contacts</h3>
      <div className="flex w-4/5 max-w-1000px place-content-center justify-between py-4 mx-auto">
        {contactItems.map((item) => (
          <div
            key={item.id}
            className="h-60 w-60 cursor-pointer"
            onClick={() => handleClick(item.type, item.value)}
          >
            <div
              className={`svg-mask ${item.iconClass} h-40 w-40 mx-auto bg-contain bg-no-repeat bg-primaryText bg-opacity-80`}
            ></div>
            <div className="text-center w-full py-4">{item.displayValue}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contacts;
