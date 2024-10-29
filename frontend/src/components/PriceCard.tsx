import React from "react";
import Button from "../base_components/Button";
import ContactUsForm from "./ContactUsForm";

interface PriceCardProps {
  title: string;
  image: string;
  description: string;
  price: string;
  openPopupCallback?: (content: React.ReactNode, title?: string) => void;
  closePopupCallback?: () => void;
}

const PriceCard: React.FC<PriceCardProps> = ({
  title,
  image,
  description,
  price,
  openPopupCallback,
  closePopupCallback,
}) => {
  return (
    <div className="w-full h-fit bg-card text-cardText p-6 rounded-lg shadow-md transform transition-transform duration-300">
      <img
        src={image}
        alt="Product"
        className="w-full h-80 object-cover rounded-lg mb-4"
        draggable="false"
      />
      <h2 className="text-3xl font-bold text-center mb-2 font-title">{title}</h2>
      <ul className="text-lg mb-2">
        {description.split("\n").map((line, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2">•</span> {/* Custom marker */}
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <p className="text-2xl font-semibold mb-4">{price}</p>
      {openPopupCallback && (
        <Button
          text="Contact us"
          className="w-full"
          onClick={() =>
            openPopupCallback(
              <ContactUsForm
                onFormSubmitted={closePopupCallback}
                defaultSubject={title}
                openPopupCallback={openPopupCallback}
                closePopupCallback={closePopupCallback}
              ></ContactUsForm>,
              "Contact us"
            )
          }
        />
      )}
    </div>
  );
};

export default PriceCard;
